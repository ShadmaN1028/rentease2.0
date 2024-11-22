'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Phone, Mail, Building } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface OwnerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
}

export default function OwnerDetailsPage() {
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOwnerDetails()
  }, [])

  const fetchOwnerDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/check-tenancy`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch owner details')
      const data = await response.json()
      setOwnerDetails(data)
    } catch (error) {
      console.error('Error fetching owner details:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load owner details. Please try again.",
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

  if (!ownerDetails) {
    return <div>Error loading owner details</div>
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
            <span>{ownerDetails.firstName} {ownerDetails.lastName}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5" />
            <span>{ownerDetails.email}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5" />
            <span>{ownerDetails.phone}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Building className="h-5 w-5" />
            <span>{ownerDetails.companyName}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}