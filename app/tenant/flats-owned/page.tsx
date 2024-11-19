'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Home, MapPin, DollarSign, Users, Bath, Wind } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface FlatDetails {
  id: string
  title: string
  address: string
  area: string
  rooms: number
  bathrooms: number
  balcony: boolean
  rent: number
  moveInDate: string
}

export default function FlatsInfoPage() {
  const [flatDetails, setFlatDetails] = useState<FlatDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFlatDetails()
  }, [])

  const fetchFlatDetails = async () => {
    try {
      const response = await fetch('/api/tenant/flat-details', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch flat details')
      const data = await response.json()
      setFlatDetails(data)
    } catch (error) {
      console.error('Error fetching flat details:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load flat details. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!flatDetails) {
    return <div>Error loading flat details</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Flat Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{flatDetails.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5" />
            <span>{flatDetails.address}, {flatDetails.area}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Home className="h-5 w-5" />
            <span>{flatDetails.rooms} room{flatDetails.rooms > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Bath className="h-5 w-5" />
            <span>{flatDetails.bathrooms} bathroom{flatDetails.bathrooms > 1 ? 's' : ''}</span>
          </div>
          {flatDetails.balcony && (
            <div className="flex items-center space-x-4">
              <Wind className="h-5 w-5" />
              <span>Balcony</span>
            </div>
          )}
          <div className="flex items-center space-x-4">
            <DollarSign className="h-5 w-5" />
            <span>${flatDetails.rent}/month</span>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5" />
            <span>Move-in Date: {new Date(flatDetails.moveInDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}