'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface Application {
  application_id: string
  flat_number: string
  building_name: string
  application_date: string
  status: number
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/check-applications`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch applications')
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setApplications(data.data)
      } else {
        throw new Error(data.message || 'Invalid data format received from API')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setError('Failed to load applications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="secondary">Pending</Badge>
      case 1:
        return <Badge variant="default">Approved</Badge>
      case 2:
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0:
        return <Clock className="mr-2 h-4 w-4 text-yellow-500" />
      case 1:
        return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
      case 2:
        return <XCircle className="mr-2 h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="mr-2 h-4 w-4 text-gray-500" />
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
      <h1 className="text-2xl font-bold mb-6">Your Applications</h1>
      {applications.length === 0 ? (
        <p>You have no applications yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <Card key={application.application_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{application.flat_number}</span>
                  {getStatusBadge(application.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Applied on: {new Date(application.application_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(application.status)}
                    <span>Status: {application.status === 1 ? 'Pending' : application.status === 2 ? 'Approved' : 'Rejected'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">Building: </span>
                    <span className="ml-2">{application.building_name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}