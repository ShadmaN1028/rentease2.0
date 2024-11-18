'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send } from 'lucide-react'
//import { toast } from "@/components/ui/use-toast"

interface UnpaidFlat {
  id: string
  flatNumber: string
  buildingName: string
  tenantName: string
  dueAmount: number
  dueDate: string
}

export default function SendNotification() {
  const [unpaidFlats, setUnpaidFlats] = useState<UnpaidFlat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUnpaidFlats()
  }, [])

  const fetchUnpaidFlats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Replace this with your actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/unpaid-flats`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch unpaid flats')
      }
      const data = await response.json()
      setUnpaidFlats(data.unpaidFlats)
    } catch (err) {
      setError('An error occurred while fetching unpaid flats. Please try again.')
      console.error('Error fetching unpaid flats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const sendNotification = async (flatId: string) => {
    try {
      // Replace this with your actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/send-notification/${flatId}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to send notification')
      }
      // toast({
      //   title: "Notification Sent",
      //   description: "Payment reminder has been sent to the tenant.",
      // })
    } catch (err) {
      console.error('Error sending notification:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to send notification. Please try again.",
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
          <CardTitle className="text-2xl font-bold">Send Payment Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {unpaidFlats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Due Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaidFlats.map((flat) => (
                  <TableRow key={flat.id}>
                    <TableCell>{flat.flatNumber}</TableCell>
                    <TableCell>{flat.buildingName}</TableCell>
                    <TableCell>{flat.tenantName}</TableCell>
                    <TableCell>${flat.dueAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(flat.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => sendNotification(flat.id)} size="sm">
                        <Send className="mr-2 h-4 w-4" /> Send Reminder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No unpaid flats found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}