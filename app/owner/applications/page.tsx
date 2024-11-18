'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Application {
  applications_id: string
  user_id: string
  flats_id: string
  building_id: string
  status: number
  application_date: string
  // Add any other fields that are returned by the API
}

export default function OwnerApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/pending-applications`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setApplications(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch applications')
        }
      } else {
        throw new Error('Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError('Failed to load applications. Please try again.')
    }
  }

  const handleApplicationUpdate = async (applicationId: string, action: 'approve' | 'deny') => {
    try {
      const endpoint = action === 'approve' ? 'approve-application' : 'deny-application'
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/${endpoint}/${applicationId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setError(`Application ${action}d successfully`)
          fetchApplications() // Refresh the list
        } else {
          throw new Error(data.message || `Failed to ${action} application`)
        }
      } else {
        throw new Error(`Failed to ${action} application`)
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error)
      setError(`Failed to ${action} application. Please try again.`)
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Pending'
      case 1: return 'Approved'
      case 2: return 'Denied'
      default: return 'Unknown'
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tenant Applications</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((application) => (
          <Card key={application.applications_id}>
            <CardHeader>
              <CardTitle>Application {application.applications_id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>User ID:</strong> {application.user_id}</p>
              <p><strong>Flat ID:</strong> {application.flats_id}</p>
              <p><strong>Building ID:</strong> {application.building_id}</p>
              <p><strong>Applied:</strong> {new Date(application.application_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {getStatusText(application.status)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {application.status === 0 && (
                <>
                  <Button onClick={() => handleApplicationUpdate(application.applications_id, 'approve')} className="bg-green-500 hover:bg-green-600">Approve</Button>
                  <Button onClick={() => handleApplicationUpdate(application.applications_id, 'deny')} className="bg-red-500 hover:bg-red-600">Deny</Button>
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