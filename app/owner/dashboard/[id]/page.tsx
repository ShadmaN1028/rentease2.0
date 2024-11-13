"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
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
  status: number;
  rent: number;
  tenancy_type: number;
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
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null);
  const [flatCodes, setFlatCodes] = useState<Record<string, string>>({});
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

  const handleEditFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlat) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/flats/${editingFlat.flats_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editingFlat),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update flat");
      }

      setEditingFlat(null);
      fetchBuildingDetails();
    } catch (error) {
      console.error("Error updating flat:", error);
    }
  };

  const handleDeleteFlat = async (flatId: string) => {
    if (!confirm("Are you sure you want to delete this flat?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/flats/${flatId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete flat");
      }

      fetchBuildingDetails();
    } catch (error) {
      console.error("Error deleting flat:", error);
    }
  };

  const handleGenerateCode = async (flatId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/flats/generate-code/${flatId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate code");
      }

      fetchFlatCode(flatId);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const fetchFlatCode = async (flatId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/flats/code/${flatId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flat code");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setFlatCodes((prev) => ({ ...prev, [flatId]: data.data.code }));
      }
    } catch (error) {
      console.error("Error fetching flat code:", error);
    }
  };

  useEffect(() => {
    if (buildingDetails?.flats) {
      buildingDetails.flats.forEach((flat) => {
        if (!flatCodes[flat.flats_id]) {
          fetchFlatCode(flat.flats_id);
        }
      });
    }
  }, [buildingDetails]);

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
              className={flat.status === 1 ? "bg-green-50" : "bg-yellow-50"}
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
                  <strong>Status:</strong>{" "}
                  {flat.status === 1 ? "Occupied" : "Vacant"}
                </p>
                <p>
                  <strong>Rent:</strong> ${flat.rent}
                </p>
                <p>
                  <strong>Tenancy Type:</strong>{" "}
                  {flat.tenancy_type === 1 ? "Family" : "Bachelor"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditingFlat(flat)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Flat</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleEditFlat}
                      className="space-y-4 overflow-y-scroll max-h-screen"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="area">Area (sq ft)</Label>
                          <Input
                            id="area"
                            value={editingFlat?.area}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                area: Number(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="rooms">Rooms</Label>
                          <Input
                            id="rooms"
                            value={editingFlat?.rooms}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                rooms: Number(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="bath">Bathrooms</Label>
                          <Input
                            id="bath"
                            value={editingFlat?.bath}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                bath: Number(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="balcony">Balconies</Label>
                          <Input
                            id="balcony"
                            value={editingFlat?.balcony}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                balcony: Number(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="rent">Rent</Label>
                          <Input
                            id="rent"
                            value={editingFlat?.rent}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                rent: Number(e.target.value),
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <select
                            id="status"
                            value={editingFlat?.status}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                status: Number(e.target.value),
                              }))
                            }
                            className="w-full p-2 border rounded"
                            required
                          >
                            <option value={0}>Vacant</option>
                            <option value={1}>Occupied</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="tenancy_type">Tenancy Type</Label>
                          <select
                            id="tenancy_type"
                            value={editingFlat?.tenancy_type}
                            onChange={(e) =>
                              setEditingFlat((prev) => ({
                                ...prev!,
                                tenancy_type: Number(e.target.value),
                              }))
                            }
                            className="w-full p-2 border rounded"
                            required
                          >
                            <option value={1}>Family</option>
                            <option value={2}>Bachelor</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          value={editingFlat?.description}
                          onChange={(e) =>
                            setEditingFlat((prev) => ({
                              ...prev!,
                              description: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded"
                          rows={3}
                          required
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteFlat(flat.flats_id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
              <CardFooter>
                {flatCodes[flat.flats_id] ? (
                  <p>
                    <strong>Flat Code:</strong> {flatCodes[flat.flats_id]}
                  </p>
                ) : (
                  <Button onClick={() => handleGenerateCode(flat.flats_id)}>
                    Generate Flat Code
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No flats available for this building.</p>
      )}
    </div>
  );
}
