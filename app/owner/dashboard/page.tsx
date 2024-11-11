'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Building } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface Building {
  building_id: string
  building_name: string
  address: string
  vacant_flats: number
  created_at: string
}

export default function OwnerDashboard() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [searchCriteria, setSearchCriteria] = useState({
    building_name: '',
    address: '',
  })
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/owner/buildings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBuildings(data.buildings)
      } else {
        throw new Error('Failed to fetch buildings')
      }
    } catch (error) {
      console.error('Error fetching buildings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch buildings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    try {
      const queryParams = new URLSearchParams(searchCriteria).toString()
      const response = await fetch(`/api/owner/buildings/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBuildings(data.buildings)
      } else {
        throw new Error('Failed to search buildings')
      }
    } catch (error) {
      console.error('Error searching buildings:', error)
      toast({
        title: "Error",
        description: "Failed to search buildings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetSearch = () => {
    setIsSearching(false)
    setSearchCriteria({ building_name: '', address: '' })
    fetchBuildings()
  }

  const sortedBuildings = [...buildings].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Advanced Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search Buildings</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="building_name">Building Name</Label>
                <Input
                  id="building_name"
                  value={searchCriteria.building_name}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, building_name: e.target.value })}
                  placeholder="Enter building name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={searchCriteria.address}
                  onChange={(e) => setSearchCriteria({ ...searchCriteria, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <Button type="submit" className="w-full">Search</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Link href="/owner/add-building">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Button>
        </Link>
      </div>
      {isSearching && (
        <div className="mb-4">
          <Button variant="link" onClick={resetSearch}>
            Clear Search and Show All Buildings
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedBuildings.length > 0 ? (
          sortedBuildings.map((building) => (
            <Link href={`/owner/dashboard/${building.building_id}`} key={building.building_id}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    {building.building_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Address:</strong> {building.address}</p>
                  <p className="text-sm text-muted-foreground"><strong>Vacant Flats:</strong> {building.vacant_flats}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No buildings found. Add a new building to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}