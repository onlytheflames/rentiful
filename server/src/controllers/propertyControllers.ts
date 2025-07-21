import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { S3Client } from "@aws-sdk/client-s3";
import { Location } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    // Dynamic Filtering: Only adds conditions when parameters are provided, so you don't get unwanted filters
    let whereConditions: Prisma.Sql[] = [];

    /*  PostgreSQL Rule:
        SELECT id FROM table ✅ (PostgreSQL converts to lowercase automatically)
        SELECT ID FROM table ✅ (PostgreSQL converts to lowercase automatically)
        SELECT "pricePerMonth" FROM table ✅ (Exact case preserved)
        SELECT pricepermonth FROM table ❌ (Would look for lowercase, but column is mixed case) 
    */

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number); // Convert ids string into number array
      whereConditions.push(
        // Prisma.sql`` is how you do raw SQL query in prisma
        // "p." is a table alias that's defined in the SQL query itself. It's a shorthand way to refer to the properties table.
        // p.id IN (1, 2, 3), check if p.id exist inside this favorite prisma array
        Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
      );
    }

    if (priceMin) {
      whereConditions.push(
        // Number(priceMin) convert priceMin into Number type (body/query default is string))
        Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      whereConditions.push(
        Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
      );
    }

    if (squareFeetMax) {
      whereConditions.push(
        Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      whereConditions.push(
        Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"` // converts the string value to PostgreSQL's custom PropertyType enum type. There are also other prisma typecastingoperator like ::INTEGER, ::BOOLEAN, ETC

        // Check schema.prisma:
        /* 
          enum PropertyType {
              Rooms
              Tinyhouse
              Apartment
              Villa
              Townhouse
              Cottage
          } 
        */
      );
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",");
      // The @> is PostgreSQL's "contains" operator for arrays and JSON data types. It checks if the left array contains all elements from the right array.
      // Amenities could be: {AirConditioning,WasherDryer,Gym, etc}
      whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
    }

    // Check if property availability date
    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
          );
        }
      }
    }

    // implements geospatial filtering to find properties within a certain distance from a given point.
    if (latitude && longitude) {
      const lat = parseFloat(latitude as string); // e.g., -8.5833 (Kupang)
      const lng = parseFloat(longitude as string); // e.g., 123.5833 (Kupang)
      const radiusInKilometers = 1000; // // Search within 1000km radius
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees, 1 degree ≈ 111 kilometers at the equator

      whereConditions.push(
        // ST_DWithin(geom1, geom2, distance) Returns true if the two geometries are within the specified distance of each other.
        Prisma.sql`ST_DWithin(          
          -- Creates a point geometry from longitude and latitude coordinates.
          l.coordinates::geometry, -- Property's location
          -- Sets the Spatial Reference System ID to 4326, which is the standard GPS coordinate system (WGS84).
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), -- Search center point
          ${degrees} -- Distance in degrees
        )`
      );
    }

    // query that joins tables, applies all our filters, and formats the result.
    const completeQuery = Prisma.sql`
      SELECT 
        p.*, -- All columns from Property table
        json_build_object( -- Build a JSON object for location data
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
    --   This defines p as the alias for the "Property" table
      FROM "Property" p 
    --   This defines l as the alias for the "Location" table
      JOIN "Location" l ON p."locationId" = l.id
    -- If filter exist: all oour whereConditions get joined with AND, if no filter: Prisma.empty means no WHERE clause - returns all properties.
      ${
        whereConditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
          : Prisma.empty
      }
    `;

    // Execute the raw query
    const properties = await prisma.$queryRaw(completeQuery);

    // This is how you make complex searching/filtering/sorting on the server side, and in the client side, we just need to pass in the correct query params to the backend.
    res.json(properties);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        location: true,
      },
    });

    if (property) {
      const coordinates: { coordinates: string }[] =
        await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

      const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
      const longitude = geoJSON.coordinates[0];
      const latitude = geoJSON.coordinates[1];

      const propertyWithCoordinates = {
        ...property,
        location: {
          ...property.location,
          coordinates: {
            longitude,
            latitude,
          },
        },
      };
      res.json(propertyWithCoordinates);
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error retrieving property: ${err.message}` });
  }
};

export const createProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      ...propertyData
    } = req.body;

    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: `properties/${Date.now()}-${file.originalname}`, // Name of the file that will be stored in S3
          Body: file.buffer, // The actual image itself
          ContentType: file.mimetype,
        };

        const uploadResult = await new Upload({
          client: s3Client,
          params: uploadParams,
        }).done();

        return uploadResult.Location;
      })
    );

    // Convert user typed location into latitude & longitude
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
      {
        street: address,
        city,
        country,
        postalcode: postalCode,
        format: "json",
        limit: "1",
      }
    ).toString()}`;
    const geocodingResponse = await axios.get(geocodingUrl, {
      headers: {
        "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com",
      },
    });
    const [longitude, latitude] =
      geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
        ? [
            parseFloat(geocodingResponse.data[0]?.lon),
            parseFloat(geocodingResponse.data[0]?.lat),
          ]
        : [0, 0];

    // create location
    /* Prisma's $queryRaw always returns an array. Since INSERT with RETURNING 
   returns exactly one row, we destructure [location] to extract the single 
   location object from the array. */
    const [location] = await prisma.$queryRaw<Location[]>` 
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;

    // create property
    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        photoUrls,
        locationId: location.id,
        managerCognitoId,
        amenities:
          typeof propertyData.amenities === "string"
            ? propertyData.amenities.split(",")
            : [],
        highlights:
          typeof propertyData.highlights === "string"
            ? propertyData.highlights.split(",")
            : [],
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth),
        securityDeposit: parseFloat(propertyData.securityDeposit),
        applicationFee: parseFloat(propertyData.applicationFee),
        beds: parseInt(propertyData.beds),
        baths: parseFloat(propertyData.baths),
        squareFeet: parseInt(propertyData.squareFeet),
      },
      include: {
        location: true,
        manager: true,
      },
    });

    res.status(201).json(newProperty);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error creating property: ${err.message}` });
  }
};
