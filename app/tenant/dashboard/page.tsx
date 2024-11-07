'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Flat {
  flat_id: string
  flat_name: string
  area: number
  location: string
  rent: number
  tenancy_type: string
}

export default function TenantDashboard() {
  const [searchCriteria, setSearchCriteria] = useState({
    room_no: '',
    area: '',
    location: '',
    rent: '',
    tenancy_type: '',
  })
  const [flats, setFlats] = useState<Flat[]>([])
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setSearchCriteria({ ...searchCriteria, tenancy_type: value })
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const queryParams = new URLSearchParams(searchCriteria).toString()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/search-flats?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setFlats(data.flats)
      } else {
        console.error('Failed to fetch flats')
      }
    } catch (error) {
      console.error('Error searching flats:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tenant Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Flats</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="room_no">Room Number</Label>
                <Input
                  id="room_no"
                  name="room_no"
                  value={searchCriteria.room_no}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={searchCriteria.area}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={searchCriteria.location}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="rent">Max Rent</Label>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  value={searchCriteria.rent}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="tenancy_type">Tenancy Type</Label>
                <Select onValueChange={handleSelectChange} value={searchCriteria.tenancy_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenancy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="bachelor">Bachelor</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flats.map((flat) => (
          <Card key={flat.flat_id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/tenant/flat/${flat.flat_id}`)}>
            <CardHeader>
              <CardTitle>{flat.flat_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Area:</strong> {flat.area} sq ft</p>
              <p><strong>Location:</strong> {flat.location}</p>
              <p><strong>Rent:</strong> ${flat.rent}/month</p>
              <p><strong>Tenancy Type:</strong> {flat.tenancy_type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}