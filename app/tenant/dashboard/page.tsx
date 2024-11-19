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
  flats_id: number
  building_id: number
  flat_number: string
  area: string
  rooms: number
  bath: number
  balcony: number
  description: string
  status: number
  rent: string
  tenancy_type: number
  created_by: string
  creation_date: string
  last_updated_by: string
  last_update_date: string
  change_number: string
}

export default function TenantDashboard() {
  const [flats, setFlats] = useState<Flat[]>([])
  const [filteredFlats, setFilteredFlats] = useState<Flat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState({
    area: '',
    flat_number: '',
    rooms: '',
    bath: '',
    balcony: false,
    minRent: 0,
    maxRent: 50000,
  })

  useEffect(() => {
    fetchFlats()
  }, [])

  const fetchFlats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/available-flats`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch flats')
      }
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setFlats(data.data)
        setFilteredFlats(data.data)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (error) {
      console.error('Error fetching flats:', error)
      setError('Failed to fetch available flats. Please try again.')
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
      if (searchCriteria.flat_number && !flat.flat_number.toLowerCase().includes(searchCriteria.flat_number.toLowerCase())) return false
      if (searchCriteria.rooms && flat.rooms < parseInt(searchCriteria.rooms)) return false
      if (searchCriteria.bath && flat.bath < parseInt(searchCriteria.bath)) return false
      if (searchCriteria.balcony && flat.balcony === 0) return false
      const rentValue = parseFloat(flat.rent)
      if (rentValue < searchCriteria.minRent || rentValue > searchCriteria.maxRent) return false
      return true
    })
    setFilteredFlats(filtered)
    setIsDialogOpen(false)
    setIsSearchActive(true)
  }

  const resetSearch = () => {
    setSearchCriteria({
      area: '',
      flat_number: '',
      rooms: '',
      bath: '',
      balcony: false,
      minRent: 0,
      maxRent: 50000,
    })
    setFilteredFlats(flats)
    setIsSearchActive(false)
  }

  const handleApply = async (flatId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/make-applications/${flatId}`, {
        method: 'POST',
        credentials: 'include'
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
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
                  <Label htmlFor="flat_number" className="text-right">
                    Flat Number
                  </Label>
                  <Input
                    id="flat_number"
                    value={searchCriteria.flat_number}
                    onChange={(e) => setSearchCriteria({...searchCriteria, flat_number: e.target.value})}
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
                  <Label htmlFor="bath" className="text-right">
                    Bathrooms
                  </Label>
                  <Input
                    id="bath"
                    type="number"
                    value={searchCriteria.bath}
                    onChange={(e) => setSearchCriteria({...searchCriteria, bath: e.target.value})}
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
      {filteredFlats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlats.map((flat) => (
            <Card key={flat.flats_id}>
              <CardHeader>
                <CardTitle>Flat {flat.flat_number}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Area: {flat.area} sq ft</span>
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
                      <span>{flat.balcony} Balcon{flat.balcony > 1 ? 'ies' : 'y'}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>${parseFloat(flat.rent).toFixed(2)}/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      Posted on {new Date(flat.creation_date).toLocaleDateString()}
                    </Badge>
                    <Button size="sm" onClick={() => handleApply(flat.flats_id)}>Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No flats found matching your criteria.</p>
      )}
    </div>
  )
}