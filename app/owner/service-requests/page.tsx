'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Info, CheckCircle, X } from 'lucide-react'

interface ServiceRequest {
  request_id: string
  flats_id: string
  user_id: string
  request_type: string
  description: string
  status: number
  creation_date: string
  flat_number: string
  building_name: string
  tenant_name: string
}

export default function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchServiceRequests()
  }, [])

  const fetchServiceRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/pending-request`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch service requests')
      }
      const data = await response.json()
      if (data.success) {
        setServiceRequests(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch service requests')
      }
    } catch (err) {
      setError('An error occurred while fetching service requests. Please try again.')
      console.error('Error fetching service requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDetailsClick = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setIsDialogOpen(true)
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/approve-request/${requestId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to approve request')
      }
      const data = await response.json()
      if (data.success) {
        
        fetchServiceRequests() // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to approve request')
      }
    } catch (err) {
      console.error('Error approving request:', err)
      
    }
  }

  const handleDenyRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/deny-request/${requestId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to deny request')
      }
      const data = await response.json()
      if (data.success) {
        
        fetchServiceRequests() // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to deny request')
      }
    } catch (err) {
      console.error('Error denying request:', err)
      
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pending Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {serviceRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRequests.map((request) => (
                  <TableRow key={request.request_id}>
                    <TableCell>{request.flat_number}</TableCell>
                    <TableCell>{request.building_name}</TableCell>
                    <TableCell>{request.tenant_name}</TableCell>
                    <TableCell>{request.request_type}</TableCell>
                    <TableCell>{new Date(request.creation_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleDetailsClick(request)} size="sm" variant="outline">
                          <Info className="mr-2 h-4 w-4" /> Details
                        </Button>
                        <Button onClick={() => handleApproveRequest(request.request_id)} size="sm" variant="default">
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                        <Button onClick={() => handleDenyRequest(request.request_id)} size="sm" variant="destructive">
                          <X className="mr-2 h-4 w-4" /> Deny
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No pending service requests found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="mt-2 space-y-2">
              <p><strong>Flat:</strong> {selectedRequest.flat_number}</p>
              <p><strong>Building:</strong> {selectedRequest.building_name}</p>
              <p><strong>Tenant:</strong> {selectedRequest.tenant_name}</p>
              <p><strong>Request Type:</strong> {selectedRequest.request_type}</p>
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <p><strong>Created At:</strong> {new Date(selectedRequest.creation_date).toLocaleString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}