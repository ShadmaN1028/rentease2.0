"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddFlatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    flat_number: "",
    area: "",
    rooms: "",
    bath: "",
    balcony: "",
    description: "",
    status: "",
    rent: "",
    tenancy_type: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      setId(params.id);
    } else {
      setError(
        "Building ID is missing. Please go back to the dashboard and try again."
      );
    }
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, tenancy_type: value });
  };
  const handleSelectChangeVacancy = (value: string) => {
    setFormData({ ...formData, status: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!id) {
      setError(
        "Building ID is missing. Please go back to the dashboard and try again."
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/owner/add-flat/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.ok) {
        router.push(`/owner/dashboard/${id}`);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to add flat");
      }
    } catch (error) {
      console.error("Error adding flat:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          onClick={() => router.push("/owner/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!id) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Flat to Building {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="flat_number">Flat Name</Label>
              <Input
                id="flat_number"
                name="flat_number"
                value={formData.flat_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="rooms">Number of Rooms</Label>
              <Input
                id="rooms"
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="bath">Number of Bathrooms</Label>
              <Input
                id="bath"
                name="bath"
                type="number"
                value={formData.bath}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="balcony">Number of Balconies</Label>
              <Input
                id="balcony"
                name="balcony"
                type="number"
                value={formData.balcony}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Vacancy Status</Label>
              <Select
                onValueChange={handleSelectChangeVacancy}
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vacancy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Vacant</SelectItem>
                  <SelectItem value="1">Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rent">Rent (per month)</Label>
              <Input
                id="rent"
                name="rent"
                type="number"
                value={formData.rent}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="tenancy_type">Tenancy Type</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.tenancy_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenancy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Bachelor</SelectItem>
                  <SelectItem value="1">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Flat</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
