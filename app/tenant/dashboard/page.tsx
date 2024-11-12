'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { toast } from "@/components/ui/use-toast"
import { Search, Home, DollarSign, MapPin } from 'lucide-react'

interface Flat {
  flat_id: string
  flat_number: string
  building_name: string
  area: number
  address: string
  rooms: number
  baths: number
  balcony: number
  rent: number
  description: string
  status: 'available' | 'rented'
  publish_date: string
}

export default function TenantDashboard() {
  const [flats, setFlats] = useState<Flat[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchFlats()
  }, [])

  const fetchFlats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/available-flats`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setFlats(data.flats)
      } else {
        throw new Error('Failed to fetch flats')
      }
    } catch (error) {
      console.error('Error fetching flats:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to load available flats. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const filteredFlats = flats.filter(flat => 
    flat.address.toLowerCase().includes(searchTerm) ||
    flat.area.toString().includes(searchTerm) ||
    flat.rent.toString().includes(searchTerm)
  )

  const handleApply = async (flatId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/apply/${flatId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        // toast({
        //   title: "Application Submitted",
        //   description: "Your application has been sent to the owner.",
        // })
      } else {
        throw new Error('Failed to submit application')
      }
    } catch (error) {
      console.error('Error applying for flat:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to submit application. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Flats</h1>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by area, address, or rent..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlats.map((flat) => (
          <Card key={flat.flat_id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{flat.building_name} - Flat {flat.flat_number}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {flat.address}</p>
              <p className="flex items-center"><Home className="mr-2 h-4 w-4" /> {flat.area} sq ft</p>
              <p className="flex items-center"><DollarSign className="mr-2 h-4 w-4" /> ${flat.rent}/month</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setSelectedFlat(flat)}>See More</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{flat.building_name} - Flat {flat.flat_number}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <p><strong>Address:</strong> {flat.address}</p>
                    <p><strong>Area:</strong> {flat.area} sq ft</p>
                    <p><strong>Rooms:</strong> {flat.rooms}</p>
                    <p><strong>Bathrooms:</strong> {flat.baths}</p>
                    <p><strong>Balconies:</strong> {flat.balcony}</p>
                    <p><strong>Rent:</strong> ${flat.rent}/month</p>
                    <p><strong>Description:</strong> {flat.description}</p>
                    <p><strong>Published:</strong> {new Date(flat.publish_date).toLocaleDateString()}</p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={() => handleApply(flat.flat_id)}>Apply</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredFlats.length === 0 && (
        <p className="text-center mt-4">No flats found matching your search criteria.</p>
      )}
    </div>
  )
}