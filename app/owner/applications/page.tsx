'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"

interface Application {
  id: string
  tenantName: string
  flatNumber: string
  buildingName: string
  status: 'pending' | 'approved' | 'denied'
  appliedAt: string
}

export default function OwnerApplications() {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/applications`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        throw new Error('Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load applications. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const handleApplicationUpdate = async (applicationId: string, status: 'approved' | 'denied') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        // toast({
        //   title: "Application Updated",
        //   description: `Application ${status}.`,
        // })
        fetchApplications() // Refresh the list
      } else {
        throw new Error('Failed to update application')
      }
    } catch (error) {
      console.error('Error updating application:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to update application. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tenant Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <CardTitle>{application.tenantName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Flat:</strong> {application.flatNumber}</p>
              <p><strong>Building:</strong> {application.buildingName}</p>
              <p><strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {application.status}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {application.status === 'pending' && (
                <>
                  <Button onClick={() => handleApplicationUpdate(application.id, 'approved')} className="bg-green-500 hover:bg-green-600">Approve</Button>
                  <Button onClick={() => handleApplicationUpdate(application.id, 'denied')} className="bg-red-500 hover:bg-red-600">Deny</Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {applications.length === 0 && (
        <p className="text-center mt-4">No pending applications.</p>
      )}
    </div>
  )
}