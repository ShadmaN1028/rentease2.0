'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddFlatPageProps {
  params: {
    buildingId: string
  }
}

export default function AddFlatPage({ params }: AddFlatPageProps) {
  const router = useRouter()
  const [buildingId, setBuildingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    flat_name: '',
    area: '',
    rooms: '',
    baths: '',
    balcony: '',
    description: '',
    rent: '',
    tenancy_type: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.buildingId) {
      setBuildingId(params.buildingId)
    } else {
      setError('Building ID is missing. Please go back to the dashboard and try again.')
    }
  }, [params.buildingId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, tenancy_type: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!buildingId) {
      setError('Building ID is missing. Please go back to the dashboard and try again.')
      return
    }

    try {
      const response = await fetch(`/api/owner/buildings/${buildingId}/flats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/owner/dashboard/${buildingId}`)
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to add flat')
      }
    } catch (error) {
      console.error('Error adding flat:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push('/owner/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!buildingId) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Flat to Building {buildingId}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="flat_name">Flat Name</Label>
              <Input
                id="flat_name"
                name="flat_name"
                value={formData.flat_name}
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
              <Label htmlFor="baths">Number of Bathrooms</Label>
              <Input
                id="baths"
                name="baths"
                type="number"
                value={formData.baths}
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
              <Select onValueChange={handleSelectChange} value={formData.tenancy_type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tenancy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Flat</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}