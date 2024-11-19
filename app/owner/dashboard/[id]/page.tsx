'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Edit, Trash2, Home, DollarSign, MapPin, Bath, BedDouble, Wind, RefreshCw } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface Flat {
  flats_id: string
  flat_number: string
  area: number
  rooms: number
  bath: number
  balcony: number
  description: string
  status: number
  rent: number
  tenancy_type: number
}

interface BuildingDetails {
  building_name: string
  flats: Flat[]
}

export default function BuildingPage({ params }: { params: { id: string } }) {
  const [buildingDetails, setBuildingDetails] = useState<BuildingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null)
  const [flatCodes, setFlatCodes] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    fetchBuildingDetails()
  }, [params.id])

  const fetchBuildingDetails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/flats-list/${params.id}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized")
        }
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch building details")
      }

      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        const buildingName = data.data[0]?.building_name || "Unknown Building"
        setBuildingDetails({
          building_name: buildingName,
          flats: data.data,
        })
      } else {
        throw new Error("Invalid data structure")
      }
    } catch (error) {
      console.error("Error fetching building details:", error)
      if (error instanceof Error && error.message === "Unauthorized") {
        router.push("/login")
      } else {
        setError("Failed to load building details. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditFlat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFlat) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/flats/${editingFlat.flats_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingFlat),
      })

      if (!response.ok) {
        throw new Error("Failed to update flat")
      }

      setEditingFlat(null)
      fetchBuildingDetails()
      // toast({
      //   title: "Success",
      //   description: "Flat updated successfully.",
      // })
    } catch (error) {
      console.error("Error updating flat:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to update flat. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleDeleteFlat = async (flatId: string) => {
    if (!confirm("Are you sure you want to delete this flat?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/flats/${flatId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error("Failed to delete flat")
      }

      fetchBuildingDetails()
      // toast({
      //   title: "Success",
      //   description: "Flat deleted successfully.",
      // })
    } catch (error) {
      console.error("Error deleting flat:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to delete flat. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleGenerateCode = async (flatId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/flats/generate-code/${flatId}`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error("Failed to generate code")
      }

      fetchFlatCode(flatId)
      // toast({
      //   title: "Success",
      //   description: "Flat code generated successfully.",
      // })
    } catch (error) {
      console.error("Error generating code:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to generate flat code. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const fetchFlatCode = async (flatId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/flats/code/${flatId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error("Failed to fetch flat code")
      }

      const data = await response.json()
      if (data.success && data.data) {
        setFlatCodes((prev) => ({ ...prev, [flatId]: data.data.code }))
      }
    } catch (error) {
      console.error("Error fetching flat code:", error)
    }
  }

  useEffect(() => {
    if (buildingDetails?.flats) {
      buildingDetails.flats.forEach((flat) => {
        if (!flatCodes[flat.flats_id]) {
          fetchFlatCode(flat.flats_id)
        }
      })
    }
  }, [buildingDetails])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  if (!buildingDetails) {
    return <div className="container mx-auto p-4">No building details found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{buildingDetails.building_name}</h1>
        <Link href={`/owner/dashboard/${params.id}/add-flat`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Flat
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildingDetails.flats.map((flat) => (
          <Card key={flat.flats_id} className={flat.status === 1 ? "bg-green-50" : "bg-yellow-50"}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Flat {flat.flat_number}</span>
                {/* <Badge variant={flat.status === 1 ? "success" : "warning"}>
                  {flat.status === 1 ? "Occupied" : "Vacant"}
                </Badge> */}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{flat.area} sq ft</span>
              </div>
              <div className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                <span>{flat.rooms} room{flat.rooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <Bath className="mr-2 h-4 w-4" />
                <span>{flat.bath} bathroom{flat.bath > 1 ? 's' : ''}</span>
              </div>
              {flat.balcony > 0 && (
                <div className="flex items-center">
                  <Wind className="mr-2 h-4 w-4" />
                  <span>{flat.balcony} balcon{flat.balcony > 1 ? 'ies' : 'y'}</span>
                </div>
              )}
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>${flat.rent}/month</span>
              </div>
              <div className="flex items-center">
                <BedDouble className="mr-2 h-4 w-4" />
                <span>{flat.tenancy_type === 1 ? "Family" : "Bachelor"}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex justify-between w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setEditingFlat(flat)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Flat</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditFlat} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="area">Area (sq ft)</Label>
                          <Input
                            id="area"
                            value={editingFlat?.area}
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, area: Number(e.target.value) }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="rooms">Rooms</Label>
                          <Input
                            id="rooms"
                            value={editingFlat?.rooms}
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, rooms: Number(e.target.value) }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="bath">Bathrooms</Label>
                          <Input
                            id="bath"
                            value={editingFlat?.bath}
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, bath: Number(e.target.value) }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="balcony">Balconies</Label>
                          <Input
                            id="balcony"
                            value={editingFlat?.balcony}
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, balcony: Number(e.target.value) }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="rent">Rent</Label>
                          <Input
                            id="rent"
                            value={editingFlat?.rent}
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, rent: Number(e.target.value) }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <select
                            id="status"
                            value={editingFlat?.status}
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, status: Number(e.target.value) }))}
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
                            onChange={(e) => setEditingFlat(prev => ({ ...prev!, tenancy_type: Number(e.target.value) }))}
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
                          onChange={(e) => setEditingFlat(prev => ({ ...prev!, description: e.target.value }))}
                          className="w-full p-2 border rounded"
                          rows={3}
                          required
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={() => handleDeleteFlat(flat.flats_id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
              <div className="w-full">
                {flatCodes[flat.flats_id] ? (
                  <p className="text-sm">
                    <strong>Flat Code:</strong> {flatCodes[flat.flats_id]}
                  </p>
                ) : (
                  <Button onClick={() => handleGenerateCode(flat.flats_id)} className="w-full">
                    Generate Flat Code
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {buildingDetails.flats.length === 0 && (
        <p className="text-center mt-4">No flats available for this building.</p>
      )}
    </div>
  )}