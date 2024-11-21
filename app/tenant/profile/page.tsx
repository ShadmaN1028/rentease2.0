'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'

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
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/user-info`, { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/update-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          permanent_address: profile.permanent_address,
          contact_number: profile.contact_number,
          occupation: profile.occupation,
        }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to update profile')
      const data = await response.json()
      if (data.success) {
        
        fetchProfile() // Refresh the profile data
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

  if (!profile) {
    return <div>Error loading profile</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tenant Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="user_email">Email</Label>
              <Input
                id="user_email"
                type="email"
                value={profile.user_email}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="contact_number">Phone</Label>
              <Input
                id="contact_number"
                value={profile.contact_number}
                onChange={(e) => setProfile({...profile, contact_number: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="nid">NID</Label>
              <Input id="nid" value={profile.nid} disabled />
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={profile.occupation}
                onChange={(e) => setProfile({...profile, occupation: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="permanent_address">Permanent Address</Label>
              <Textarea
                id="permanent_address"
                value={profile.permanent_address}
                onChange={(e) => setProfile({...profile, permanent_address: e.target.value})}
                rows={3}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
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