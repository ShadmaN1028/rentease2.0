'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Info } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface ServiceRequest {
  id: string
  flatNumber: string
  buildingName: string
  tenantName: string
  requestType: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: string
}

export default function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [response, setResponse] = useState('')

  useEffect(() => {
    fetchServiceRequests()
  }, [])

  const fetchServiceRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Replace this with your actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/service-requests`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch service requests')
      }
      const data = await response.json()
      setServiceRequests(data.serviceRequests)
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

  const handleResponseSubmit = async () => {
    if (!selectedRequest) return

    try {
      // Replace this with your actual API call
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/service-requests/${selectedRequest.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
        credentials: 'include',
      })

      if (!apiResponse.ok) {
        throw new Error('Failed to submit response')
      }

      // toast({
      //   title: "Response Sent",
      //   description: "Your response has been sent to the tenant.",
      // })

      setIsDialogOpen(false)
      setResponse('')
      fetchServiceRequests() // Refresh the list
    } catch (err) {
      console.error('Error submitting response:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to send response. Please try again.",
      //   variant: "destructive",
      // })
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
          <CardTitle className="text-2xl font-bold">Service Requests</CardTitle>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.flatNumber}</TableCell>
                    <TableCell>{request.buildingName}</TableCell>
                    <TableCell>{request.tenantName}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDetailsClick(request)} size="sm">
                        <Info className="mr-2 h-4 w-4" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No service requests found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="mt-2">
              <p><strong>Flat:</strong> {selectedRequest.flatNumber}</p>
              <p><strong>Building:</strong> {selectedRequest.buildingName}</p>
              <p><strong>Tenant:</strong> {selectedRequest.tenantName}</p>
              <p><strong>Request Type:</strong> {selectedRequest.requestType}</p>
              <p><strong>Description:</strong> {selectedRequest.description}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Created At:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
            </div>
          )}
          <Textarea
            placeholder="Type your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleResponseSubmit}>Send Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}