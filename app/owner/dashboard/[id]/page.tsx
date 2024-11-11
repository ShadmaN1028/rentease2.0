'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

interface Flat {
  flat_id: string
  flat_no: string
  room_no: string
  tenant_name: string | null
  status: 'rented' | 'available'
}

export default function BuildingPage() {
  const [flats, setFlats] = useState<Flat[]>([])
  const [buildingName, setBuildingName] = useState('')
  const { buildingId } = useParams()

  useEffect(() => {
    fetchBuildingDetails()
  }, [buildingId])

  const fetchBuildingDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/buildings/${buildingId}`)
      if (response.ok) {
        const data = await response.json()
        setFlats(data.flats)
        setBuildingName(data.building_name)
      } else {
        console.error('Failed to fetch building details')
      }
    } catch (error) {
      console.error('Error fetching building details:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{buildingName}</h1>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Flats</h2>
        <Link href={`/owner/dashboard/${buildingId}/add-flat`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Flat
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flats.map((flat) => (
          <Card key={flat.flat_id} className={flat.status === 'rented' ? 'bg-green-50' : 'bg-yellow-50'}>
            <CardHeader>
              <CardTitle>Flat {flat.flat_no}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Room No:</strong> {flat.room_no}</p>
              <p><strong>Status:</strong> {flat.status}</p>
              {flat.tenant_name && <p><strong>Tenant:</strong> {flat.tenant_name}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}