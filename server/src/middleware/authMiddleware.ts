import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Essentially grabbing the typescript value we get from JWTPayload and we're adding custom:role on top of it.
interface DecodedToken extends JwtPayload {
  sub: string; // Represents cognito id
  "custom:role"?: string;
}

// Adding on to the interface Request that already exist for typescript.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Authorization header that we set on our baseQuery in api.ts
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      // If token exist, we'll try to decode it
      const decoded = jwt.decode(token) as DecodedToken;
      const userRole = decoded["custom:role"] || "";

      // We're adding this to our request object, so our route endpoints has access to these properties
      req.user = {
        id: decoded.sub, // Represent the cognito id
        role: userRole,
      };

      // If we're passing ["manager"] into the middleware, it means that user needs to be a manager to pass this middleware
      const hasAccess = allowedRoles.includes(userRole.toLowerCase());
      if (!hasAccess) {
        res.status(403).json({ message: "Access Denied" });
        return;
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    next();
  };
};
