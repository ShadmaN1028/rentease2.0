"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface Flat {
  flats_id: string;
  flat_number: string;
  area: number;
  rooms: number;
  bath: number;
  balcony: number;
  description: string;
  status: "rented" | "available";
  rent: number;
  tenancy_type: string;
}

interface BuildingDetails {
  building_name: string;
  flats: Flat[];
}

export default function BuildingPage({ params }: { params: { id: string } }) {
  const [buildingDetails, setBuildingDetails] =
    useState<BuildingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBuildingDetails();
  }, [params.id]);

  const fetchBuildingDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/flats-list/${params.id}`,

        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch building details"
        );
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const buildingName = data.data[0]?.building_name || "Unknown Building";
        setBuildingDetails({
          building_name: buildingName,
          flats: data.data,
        });
        console.log(data.data);
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (error) {
      console.error("Error fetching building details:", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        router.push("/login");
      } else {
        setError("Failed to load building details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!buildingDetails) {
    return (
      <div className="container mx-auto p-4">No building details found.</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {buildingDetails.building_name}
      </h1>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Flats</h2>
        <Link href={`/owner/dashboard/${params.id}/add-flat`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Flat
          </Button>
        </Link>
      </div>
      {buildingDetails.flats && buildingDetails.flats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildingDetails.flats.map((flat) => (
            <Card
              key={flat.flats_id}
              className={
                flat.status === "rented" ? "bg-green-50" : "bg-yellow-50"
              }
            >
              <CardHeader>
                <CardTitle>Flat {flat.flat_number}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Area:</strong> {flat.area} sq ft
                </p>
                <p>
                  <strong>Rooms:</strong> {flat.rooms}
                </p>
                <p>
                  <strong>Bathrooms:</strong> {flat.bath}
                </p>
                <p>
                  <strong>Balconies:</strong> {flat.balcony}
                </p>
                <p>
                  <strong>Status:</strong> {flat.status}
                </p>
                <p>
                  <strong>Rent:</strong> ${flat.rent}
                </p>
                <p>
                  <strong>Tenancy Type:</strong> {flat.tenancy_type}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No flats available for this building.</p>
      )}
    </div>
  );
}
