'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Phone, MapPin } from 'lucide-react'

interface OwnerDetails {
  first_name: string
  last_name: string
  contact_number: string
  address: string
  building_name: string
}

export default function OwnerDetailsPage() {
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOwnerDetails()
  }, [])

  const fetchOwnerDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/get-tenancy-info`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch owner details')
      const data = await response.json()
      if (data.success && data.data && data.data.length > 0) {
        setOwnerDetails(data.data[0])
      } else {
        throw new Error('No owner details found')
      }
    } catch (error) {
      console.error('Error fetching owner details:', error)
      
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

  if (!ownerDetails) {
    return <div className="text-center text-red-500">Error loading owner details</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Owner Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Landlord Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5" />
            <span>{ownerDetails.first_name} {ownerDetails.last_name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5" />
            <span>{ownerDetails.contact_number}</span>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5" />
            <span>{ownerDetails.address}</span>
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5" />
            <span>{ownerDetails.building_name}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}