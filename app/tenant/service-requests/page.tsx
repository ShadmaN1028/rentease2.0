'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'


interface ServiceRequest {
  request_id: string
  request_type: string
  description: string
  status: number
  creation_date: string
}

interface Tenancy {
  flats_id: string
  flat_number: string
  building_name: string
}

export default function ServiceRequestPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestType, setRequestType] = useState('')
  const [description, setDescription] = useState('')
  const [tenancy, setTenancy] = useState<Tenancy | null>(null)

  useEffect(() => {
    fetchTenancy()
    fetchRequests()
  }, [])

  const fetchTenancy = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/get-tenancy-info`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch tenancy information')
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setTenancy(data.data[0])
      } else {
        setTenancy(null)
      }
    } catch (error) {
      console.error('Error fetching tenancy information:', error)
      
    }
  }

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/check-requests`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch service requests')
      const data = await response.json()
      if (data.success) {
        setRequests(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch service requests')
      }
    } catch (error) {
      console.error('Error fetching service requests:', error)
      setError('Failed to load service requests. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenancy) {
      
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/make-requests/${tenancy.flats_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_type: requestType, description }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to submit service request')
      const data = await response.json()
      if (data.success) {
        
        setRequestType('')
        setDescription('')
        fetchRequests()
      } else {
        throw new Error(data.message || 'Failed to submit service request')
      }
    } catch (error) {
      console.error('Error submitting service request:', error)
      
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
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
          {tenancy ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="flatInfo">Flat</Label>
                <Input id="flatInfo" value={`${tenancy.building_name} - Flat ${tenancy.flat_number}`} disabled />
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
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Applicable</AlertTitle>
              <AlertDescription>
                This function is not applicable for the current user. You need to be in a tenancy first to make service requests.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Your Requests</h2>
      {requests.length === 0 ? (
        <p>You have no service requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.request_id}>
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
                <p className="text-sm text-gray-500">
                  Status: {
                    request.status === 0 ? 'Pending' :
                    request.status === 1 ? 'Approved' :
                    request.status === 2 ? 'Denied' : 'Unknown'
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}