"use client";

import Loading from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyQuery,
} from "@/state/api";
import { Lease, Payment, Property } from "@/types/prismaTypes";
import {
  ArrowDownToLineIcon,
  Check,
  CreditCard,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const PaymentMethod = () => {
  return (
    <div className="mt-10 flex-1 overflow-hidden rounded-xl bg-white p-6 shadow-md md:mt-0">
      <h2 className="mb-4 text-2xl font-bold">Payment method</h2>
      <p className="mb-4">Change how you pay for your plan.</p>
      <div className="rounded-lg border p-6">
        <div>
          {/* Card Info */}
          <div className="flex gap-10">
            <div className="flex h-20 w-36 items-center justify-center rounded-md bg-blue-600">
              <span className="text-2xl font-bold text-white">VISA</span>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-5">
                  <h3 className="text-lg font-semibold">Visa ending in 2024</h3>
                  <span className="rounded-full border border-primary-700 px-3 py-1 text-sm font-medium text-primary-700">
                    Default
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CreditCard className="mr-1 h-4 w-4" />
                  <span>Expiry • 26/06/2024</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="mr-1 h-4 w-4" />
                <span>billing@baseclub.com</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />
          <div className="flex justify-end">
            <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-primary-700 hover:text-primary-50">
              <Edit className="mr-2 h-5 w-5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResidenceCard = ({
  property,
  currentLease,
}: {
  property: Property;
  currentLease: Lease;
}) => {
  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-white p-6 shadow-md">
      {/* Header */}
      <div className="flex gap-5">
        <div className="h-32 w-64 rounded-xl bg-slate-500 object-cover"></div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="w-fit rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
              Active Leases
            </div>

            <h2 className="my-2 text-2xl font-bold">{property.name}</h2>
            <div className="mb-2 flex items-center">
              <MapPin className="mr-1 h-5 w-5" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>
          <div className="text-xl font-bold">
            ${currentLease.rent}{" "}
            <span className="text-sm font-normal text-gray-500">/ night</span>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div>
        <hr className="my-4" />
        <div className="flex items-center justify-between">
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Start Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="h-4 border-[0.5px] border-primary-300" />
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">End Date: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="h-4 border-[0.5px] border-primary-300" />
          <div className="xl:flex">
            <div className="mr-2 text-gray-500">Next Payment: </div>
            <div className="font-semibold">
              {new Date(currentLease.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
      {/* Buttons */}
      <div className="flex w-full justify-end gap-2">
        <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-primary-700 hover:text-primary-50">
          <User className="mr-2 h-5 w-5" />
          Manager
        </button>
        <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-primary-700 hover:text-primary-50">
          <Download className="mr-2 h-5 w-5" />
          Download Agreement
        </button>
      </div>
    </div>
  );
};

const BillingHistory = ({ payments }: { payments: Payment[] }) => {
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold">Billing History</h2>
          <p className="text-sm text-gray-500">
            Download your previous plan receipts and usage details.
          </p>
        </div>
        <div>
          <button className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-primary-700 hover:text-primary-50">
            <Download className="mr-2 h-5 w-5" />
            <span>Download All</span>
          </button>
        </div>
      </div>
      <hr className="mb-1 mt-4" />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="h-16">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Invoice #{payment.id} -{" "}
                    {new Date(payment.paymentDate).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                      payment.paymentStatus === "Paid"
                        ? "border-green-300 bg-green-100 text-green-800"
                        : "border-yellow-300 bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.paymentStatus === "Paid" ? (
                      <Check className="mr-1 inline-block h-4 w-4" />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>
                <TableCell>
                  <button className="flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-primary-700 hover:text-primary-50">
                    <ArrowDownToLineIcon className="mr-1 h-4 w-4" />
                    Download
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const Residence = () => {
  const { id } = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: property,
    isLoading: propertyLoading,
    error: propertyError,
  } = useGetPropertyQuery(Number(id));

  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(
    parseInt(authUser?.cognitoInfo?.userId || "0"),
    { skip: !authUser?.cognitoInfo?.userId },
  );
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(
    leases?.[0]?.id || 0,
    { skip: !leases?.[0]?.id },
  );

  if (propertyLoading || leasesLoading || paymentsLoading) return <Loading />;
  if (!property || propertyError) return <div>Error loading property</div>;

  const currentLease = leases?.find(
    (lease) => lease.propertyId === property.id,
  );

  return (
    <div className="dashboard-container">
      <div className="mx-auto w-full">
        <div className="gap-10 md:flex">
          {currentLease && (
            <ResidenceCard property={property} currentLease={currentLease} />
          )}
          <PaymentMethod />
        </div>
        <BillingHistory payments={payments || []} />
      </div>
    </div>
  );
};

export default Residence;
