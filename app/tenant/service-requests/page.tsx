'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, PenToolIcon as Tool, Clock, CheckCircle, XCircle } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface ServiceRequest {
  id: string
  request_type: string
  description: string
  status: number
  creation_date: string
}

interface RentedFlat {
  id: string
  title: string
}

export default function ServiceRequestPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestType, setRequestType] = useState('')
  const [description, setDescription] = useState('')
  const [rentedFlat, setRentedFlat] = useState<RentedFlat | null>(null)

  useEffect(() => {
    fetchRentedFlat()
    fetchRequests()
  }, [])

  const fetchRentedFlat = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/check-tenancy`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch rented flat')
      const data = await response.json()
      setRentedFlat(data)
    } catch (error) {
      console.error('Error fetching rented flat:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load rented flat information. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/check-requests`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch service requests')
      const data = await response.json()
      setRequests(data.data)
    } catch (error) {
      console.error('Error fetching service requests:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load service requests. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rentedFlat) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/make-requests/${rentedFlat.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_type: requestType, description }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to submit service request')
    //   toast({
    //     title: "Success",
    //     description: "Service request submitted successfully.",
    //   })
      setRequestType('')
      setDescription('')
      fetchRequests() // Refresh the list of requests
    } catch (error) {
      console.error('Error submitting service request:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to submit service request. Please try again.",
    //     variant: "destructive",
    //   })
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
      <h1 className="text-2xl font-bold mb-6">Service Requests</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit a New Request</CardTitle>
        </CardHeader>
        <CardContent>
          {rentedFlat ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="flatInfo">Flat</Label>
                <Input id="flatInfo" value={rentedFlat.title} disabled />
              </div>
              <div>
                <Label htmlFor="requestType">Request Type</Label>
                <Select onValueChange={setRequestType} value={requestType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button type="submit">Submit Request</Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">You are not currently renting any flat.</p>
              <p className="text-muted-foreground">Service requests are only available for tenants with active rentals.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
      {requests.length === 0 ? (
        <p>You have no service requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{request.request_type}</span>
                  {request.status === 0 && <Clock className="h-5 w-5 text-yellow-500" />}
                  {request.status === 1 && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {request.status === 2 && <XCircle className="h-5 w-5 text-red-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{request.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted on: {new Date(request.creation_date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}