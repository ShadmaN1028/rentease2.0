'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FlatDetails {
  flat_id: string
  flat_name: string
  area: number
  rooms: number
  baths: number
  balcony: number
  description: string
  rent: number
  tenancy_type: string
  location: string
}

export default function FlatDetailsPage() {
  const [flatDetails, setFlatDetails] = useState<FlatDetails | null>(null)
  const { flatId } = useParams()
  const router = useRouter()

  useEffect(() => {
    fetchFlatDetails()
  }, [flatId])

  const fetchFlatDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/flat/${flatId}`)
      if (response.ok) {
        const data = await response.json()
        setFlatDetails(data.flat)
      } else {
        console.error('Failed to fetch flat details')
      }
    } catch (error) {
      console.error('Error fetching flat details:', error)
    }
  }

  const handleApply = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/apply/${flatId}`, {
        method: 'POST',
      })
      if (response.ok) {
        alert('Application submitted successfully!')
        router.push('/tenant/dashboard')
      } else {
        console.error('Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
    }
  }

  if (!flatDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{flatDetails.flat_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Area:</strong> {flatDetails.area} sq ft</p>
          <p><strong>Rooms:</strong> {flatDetails.rooms}</p>
          <p><strong>Bathrooms:</strong> {flatDetails.baths}</p>
          <p><strong>Balconies:</strong> {flatDetails.balcony}</p>
          <p><strong>Location:</strong> {flatDetails.location}</p>
          <p><strong>Rent:</strong> ${flatDetails.rent}/month</p>
          <p><strong>Tenancy Type:</strong> {flatDetails.tenancy_type}</p>
          <p><strong>Description:</strong> {flatDetails.description}</p>
          <Button onClick={handleApply} className="w-full">Apply for this Flat</Button>
        </CardContent>
      </Card>
    </div>
  )
}