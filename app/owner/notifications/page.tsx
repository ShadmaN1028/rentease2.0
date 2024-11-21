'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Bell, CheckCircle, Send } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface Notification {
  notification_id: string
  user_id: string
  description: string
  status: number
  creation_date: string
  first_name: string
  last_name: string
  flat_number: string
}

interface Tenancy {
  user_id: string
  first_name: string
  last_name: string
  flat_number: string
}

export default function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [tenancies, setTenancies] = useState<Tenancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTenant, setSelectedTenant] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {
    fetchNotifications()
    fetchTenancies()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/notifications-list`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to load notifications. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTenancies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/notifications/tenancy-list`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch tenancies')
      const data = await response.json()
      setTenancies(data.data)
    } catch (error) {
      console.error('Error fetching tenancies:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to load tenancy list. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleSendNotification = async () => {
    if (!selectedTenant || !notificationMessage) {
      // toast({
      //   title: "Error",
      //   description: "Please select a tenant and enter a message.",
      //   variant: "destructive",
      // })
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/send-notification/${selectedTenant}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ description: notificationMessage }),
      })
      if (!response.ok) throw new Error('Failed to send notification')
      // toast({
      //   title: "Success",
      //   description: "Notification sent successfully.",
      // })
      setSelectedTenant('')
      setNotificationMessage('')
      fetchNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to send notification. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/mark-as-read/${notificationId}`, {
        method: 'PUT',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to mark notification as read')
      // toast({
      //   title: "Success",
      //   description: "Notification marked as read.",
      // })
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // toast({
      //   title: "Error",
      //   description: "Failed to mark notification as read. Please try again.",
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Send New Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tenant">Select Tenant</Label>
              <Select onValueChange={setSelectedTenant} value={selectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenancies.map((tenancy) => (
                    <SelectItem key={tenancy.user_id} value={tenancy.user_id}>
                      {tenancy.first_name} {tenancy.last_name} - Flat {tenancy.flat_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleSendNotification}>
              <Send className="mr-2 h-4 w-4" /> Send Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Notification History</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.notification_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {notification.first_name} {notification.last_name} - Flat {notification.flat_number}
                  </span>
                  {notification.status === 0 ? (
                    <Bell className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{notification.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Sent on: {new Date(notification.creation_date).toLocaleString()}
                </p>
                {notification.status === 0 && (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => handleMarkAsRead(notification.notification_id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}