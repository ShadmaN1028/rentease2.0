'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Home, MapPin, DollarSign, Users, Bath, Wind, Phone, LogOut } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface FlatDetails {
  building_name: string
  address: string
  first_name: string
  last_name: string
  contact_number: string
  flat_number: string
  area: string
  rooms: number
  bath: number
  balcony: number
  description: string
  start_date: string
}

export default function FlatsInfoPage() {
  const [flatDetails, setFlatDetails] = useState<FlatDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchFlatDetails()
  }, [])

  const fetchFlatDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/get-tenancy-info`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch flat details')
      const data = await response.json()
      if (data.success && data.data && data.data.length > 0) {
        setFlatDetails(data.data[0])
      } else {
        setFlatDetails(null)
      }
    } catch (error) {
      console.error('Error fetching flat details:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to load flat details. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveTenancy = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/leave-tenancy`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to leave tenancy')
      const data = await response.json()
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: "You have successfully left the tenancy.",
        // })
        router.push('/tenant/dashboard')
      } else {
        throw new Error(data.message || 'Failed to leave tenancy')
      }
    } catch (error) {
      console.error('Error leaving tenancy:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to leave tenancy. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsDialogOpen(false)
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
    return (
      <div className="container mx-auto p-4">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No Active Tenancy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">You are not currently in any tenancy.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => router.push('/tenant/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Flat Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{flatDetails.building_name} - Flat {flatDetails.flat_number}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5" />
            <span>{flatDetails.address}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Home className="h-5 w-5" />
            <span>{flatDetails.rooms} room{flatDetails.rooms > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Bath className="h-5 w-5" />
            <span>{flatDetails.bath} bathroom{flatDetails.bath > 1 ? 's' : ''}</span>
          </div>
          {flatDetails.balcony > 0 && (
            <div className="flex items-center space-x-4">
              <Wind className="h-5 w-5" />
              <span>{flatDetails.balcony} Balcon{flatDetails.balcony > 1 ? 'ies' : 'y'}</span>
            </div>
          )}
          <div className="flex items-center space-x-4">
            <DollarSign className="h-5 w-5" />
            <span>Area: {flatDetails.area} sq ft</span>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5" />
            <span>Move-in Date: {new Date(flatDetails.start_date).toLocaleDateString()}</span>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Owner Details</h2>
            <div className="flex items-center space-x-4">
              <Users className="h-5 w-5" />
              <span>{flatDetails.first_name} {flatDetails.last_name}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Phone className="h-5 w-5" />
              <span>{flatDetails.contact_number}</span>
            </div>
          </div>
          {flatDetails.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p>{flatDetails.description}</p>
            </div>
          )}
          <div className="mt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Tenancy
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to leave this tenancy?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. You will lose access to this flat and all associated information.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleLeaveTenancy}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}