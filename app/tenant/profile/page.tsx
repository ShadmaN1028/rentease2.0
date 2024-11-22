'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, AlertCircle } from 'lucide-react'

interface TenantProfile {
  user_id: string
  user_email: string
  first_name: string
  last_name: string
  nid: string
  permanent_address: string
  contact_number: string
  occupation: string
}

export default function TenantProfilePage() {
  const [profile, setProfile] = useState<TenantProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedProfile, setEditedProfile] = useState<TenantProfile | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/user-info`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setEditedProfile(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedProfile) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/update-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          permanent_address: editedProfile.permanent_address,
          contact_number: editedProfile.contact_number,
          occupation: editedProfile.occupation,
        }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to update profile')
      const data = await response.json()
      if (data.success) {
        setProfile(editedProfile)
        setIsEditDialogOpen(false)
        
      } else {
        throw new Error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to change password')
      const data = await response.json()
      if (data.success) {
       
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        throw new Error(data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!profile) {
    return <div>No profile data available</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tenant Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={profile.user_email} disabled />
            </div>
            <div>
              <Label>NID</Label>
              <Input value={profile.nid} disabled />
            </div>
            <div>
              <Label>First Name</Label>
              <Input value={profile.first_name} disabled />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={profile.last_name} disabled />
            </div>
            <div>
              <Label>Permanent Address</Label>
              <Input value={profile.permanent_address} disabled />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input value={profile.contact_number} disabled />
            </div>
            <div>
              <Label>Occupation</Label>
              <Input value={profile.occupation} disabled />
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={editedProfile?.first_name || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, first_name: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={editedProfile?.last_name || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, last_name: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanent_address">Permanent Address</Label>
                    <Textarea
                      id="permanent_address"
                      value={editedProfile?.permanent_address || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, permanent_address: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input
                      id="contact_number"
                      value={editedProfile?.contact_number || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, contact_number: e.target.value} : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={editedProfile?.occupation || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? {...prev, occupation: e.target.value} : null)}
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}