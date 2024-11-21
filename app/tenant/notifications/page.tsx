'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Bell, CheckCircle, AlertCircle } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Notification {
  notification_id: string
  user_id: string
  description: string
  status: number
  creation_date: string
}

export default function TenantNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/notifications-list`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      if (data.success) {
        // Sort notifications: unread first, then by creation date
        const sortedNotifications = data.data.sort((a: Notification, b: Notification) => {
          if (a.status === b.status) {
            return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
          }
          return a.status - b.status
        })
        setNotifications(sortedNotifications)
      } else {
        throw new Error(data.message || 'Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to load notifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotificationDetails = async (notificationId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/notification-details/${notificationId}`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch notification details')
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setSelectedNotification(data.data[0])
        setIsDetailsDialogOpen(true)
      } else {
        throw new Error(data.message || 'Failed to fetch notification details')
      }
    } catch (error) {
      console.error('Error fetching notification details:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load notification details. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/mark-as-read/${notificationId}`, {
        method: 'PUT',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to mark notification as read')
      const data = await response.json()
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: "Notification marked as read.",
        // })
        fetchNotifications() // Refresh the notifications list
      } else {
        throw new Error(data.message || 'Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
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
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.notification_id} className={notification.status === 0 ? "border-yellow-500" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">
                    Notification {notification.notification_id}
                  </span>
                  {notification.status === 0 ? (
                    <Bell className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{notification.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mb-4">
                  Received on: {new Date(notification.creation_date).toLocaleString()}
                </p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => fetchNotificationDetails(notification.notification_id)}>
                    View Details
                  </Button>
                  {notification.status === 0 && (
                    <Button onClick={() => handleMarkAsRead(notification.notification_id)}>
                      Mark as Read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="mt-4">
              <p className="mb-4">{selectedNotification.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Received on: {new Date(selectedNotification.creation_date).toLocaleString()}
              </p>
              <Badge className={selectedNotification.status === 0 ? "bg-yellow-500" : "bg-green-500"}>
                {selectedNotification.status === 0 ? "Unread" : "Read"}
              </Badge>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}