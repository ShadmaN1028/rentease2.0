'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from 'lucide-react'

interface Building {
  building_id: string
  building_name: string
  address: string
  vacant_flats: number
}

export default function OwnerDashboard() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/owner/buildings')
      if (response.ok) {
        const data = await response.json()
        setBuildings(data.data)
      } else {
        console.error('Failed to fetch buildings')
      }
    } catch (error) {
      console.error('Error fetching buildings:', error)
    }
  }

  const filteredBuildings = buildings.filter(building =>
    building.building_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="flex mb-4">
        <div className="flex-grow mr-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search buildings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <Link href="/owner/add-building">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Building
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuildings.map((building) => (
          <Link href={`/owner/dashboard/${building.building_id}`} key={building.building_id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{building.building_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Address:</strong> {building.address}</p>
                <p><strong>Vacant Flats:</strong> {building.vacant_flats}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}