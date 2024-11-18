'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Home, DollarSign, MapPin, Bath, BedDouble, Wind, RefreshCw } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface Flat {
  id: string
  title: string
  address: string
  area: string
  rooms: number
  bathrooms: number
  balcony: boolean
  rent: number
  postedDate: string
}

export default function TenantDashboard() {
  const [flats, setFlats] = useState<Flat[]>([])
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState({
    area: '',
    address: '',
    rooms: '',
    bathrooms: '',
    balcony: false,
    minRent: 0,
    maxRent: 50000,
  })

  useEffect(() => {
    fetchFlats()
  }, [])

  const fetchFlats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/available-flats`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch flats')
      }
      const data = await response.json()
      setFlats(data.flats)
      setFilteredFlats(data.flats)
    } catch (error) {
      console.error('Error fetching flats:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch available flats. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    const filtered = flats.filter(flat => {
      if (searchCriteria.area && !flat.area.toLowerCase().includes(searchCriteria.area.toLowerCase())) return false
      if (searchCriteria.address && !flat.address.toLowerCase().includes(searchCriteria.address.toLowerCase())) return false
      if (searchCriteria.rooms && flat.rooms < parseInt(searchCriteria.rooms)) return false
      if (searchCriteria.bathrooms && flat.bathrooms < parseInt(searchCriteria.bathrooms)) return false
      if (searchCriteria.balcony && !flat.balcony) return false
      if (flat.rent < searchCriteria.minRent || flat.rent > searchCriteria.maxRent) return false
      return true
    })
    setFilteredFlats(filtered)
    setIsDialogOpen(false)
    setIsSearchActive(true)
  }

  const resetSearch = () => {
    setSearchCriteria({
      area: '',
      address: '',
      rooms: '',
      bathrooms: '',
      balcony: false,
      minRent: 0,
      maxRent: 50000,
    })
    setFilteredFlats(flats)
    setIsSearchActive(false)
  }

  const handleApply = async (flatId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/apply/${flatId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to apply for flat')
      }
      // toast({
      //   title: "Application Submitted",
      //   description: "Your application has been successfully submitted.",
      // })
    } catch (error) {
      console.error('Error applying for flat:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to submit application. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Flats</h1>
        <div className="space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Search className="mr-2 h-4 w-4" /> Advanced Search
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search Flats</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="area" className="text-right">
                    Area
                  </Label>
                  <Input
                    id="area"
                    value={searchCriteria.area}
                    onChange={(e) => setSearchCriteria({...searchCriteria, area: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={searchCriteria.address}
                    onChange={(e) => setSearchCriteria({...searchCriteria, address: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rooms" className="text-right">
                    Rooms
                  </Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={searchCriteria.rooms}
                    onChange={(e) => setSearchCriteria({...searchCriteria, rooms: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bathrooms" className="text-right">
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={searchCriteria.bathrooms}
                    onChange={(e) => setSearchCriteria({...searchCriteria, bathrooms: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="balcony" className="text-right">
                    Balcony
                  </Label>
                  <Input
                    id="balcony"
                    type="checkbox"
                    checked={searchCriteria.balcony}
                    onChange={(e) => setSearchCriteria({...searchCriteria, balcony: e.target.checked})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Rent Range</Label>
                  <div className="col-span-3">
                    <Slider
                      min={0}
                      max={50000}
                      step={100}
                      value={[searchCriteria.minRent, searchCriteria.maxRent]}
                      onValueChange={(value) => setSearchCriteria({...searchCriteria, minRent: value[0], maxRent: value[1]})}
                    />
                    <div className="flex justify-between mt-2">
                      <span>${searchCriteria.minRent}</span>
                      <span>${searchCriteria.maxRent}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </DialogContent>
          </Dialog>
          {isSearchActive && (
            <Button onClick={resetSearch} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset Search
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlats.map((flat) => (
          <Card key={flat.id}>
            <CardHeader>
              <CardTitle>{flat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{flat.address}, {flat.area}</span>
                </div>
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  <span>{flat.rooms} room{flat.rooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="mr-2 h-4 w-4" />
                  <span>{flat.bathrooms} bathroom{flat.bathrooms > 1 ? 's' : ''}</span>
                </div>
                {flat.balcony && (
                  <div className="flex items-center">
                    <Wind className="mr-2 h-4 w-4" />
                    <span>Balcony</span>
                  </div>
                )}
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>${flat.rent}/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    Posted on {new Date(flat.postedDate).toLocaleDateString()}
                  </Badge>
                  <Button size="sm" onClick={() => handleApply(flat.id)}>Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredFlats.length === 0 && (
        <p className="text-center mt-4">No flats found matching your criteria.</p>
      )}
    </div>
  )
}