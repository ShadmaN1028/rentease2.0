"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Building } from "lucide-react";

interface Building {
  owner_id: number;
  building_id: number;
  building_name: string;
  address: string;
  vacant_flats: number;
  parking: number;
}

export default function OwnerDashboard() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    const filtered = buildings.filter(
      (building) =>
        building.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuildings(filtered);
  }, [searchTerm, buildings]);

  const fetchBuildings = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/buildings`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setBuildings(data.data);
          setFilteredBuildings(data.data);
        } else {
          throw new Error("Invalid data structure");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch buildings");
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
      if (error instanceof Error && error.message === "Unauthorized") {
        router.push("/login");
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search buildings..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Link href="/owner/add-building">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuildings.length > 0 ? (
          filteredBuildings.map((building) => (
            <Link
              href={`/owner/dashboard/${building.building_id}`}
              key={building.building_id}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    {building.building_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Address:</strong> {building.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Vacant Flats:</strong> {building.vacant_flats}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Parking:</strong> {building.parking ? "Yes" : "No"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">
              No buildings found. Add a new building to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}