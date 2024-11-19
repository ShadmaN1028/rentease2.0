'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Bell, CreditCard, FileText, Wrench, User, LogOut, Home } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface User {
  firstName: string
  lastName: string
  userType: 'owner' | 'tenant'
}

interface NotificationCounts {
  applications: number
  serviceRequests: number
}

const ProfileDropdown = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const router = useRouter()
  const initials = `${user.firstName}${user.lastName}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(user.userType === 'owner' ? '/owner/profile' : '/tenant/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(user.userType === 'owner' ? '/owner/dashboard' : '/tenant/dashboard')}>
          <Home className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ButtonWithNotification = ({ href, icon: Icon, label, count }: { href: string; icon: React.ElementType; label: string; count: number }) => (
  <Link href={href}>
    <Button variant="ghost" className="relative">
      <Icon className="mr-2 h-4 w-4" />
      {label}
      {count > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
        >
          {count > 9 ? '9+' : count}
        </Badge>
      )}
    </Button>
  </Link>
)

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [notificationCounts, setNotificationCounts] = useState<NotificationCounts>({ applications: 0, serviceRequests: 0 })
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [pathname])

  useEffect(() => {
    if (user) {
      fetchNotificationCounts()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const ownerResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/check-auth`, { credentials: 'include' })
      if (ownerResponse.ok) {
        const ownerData = await ownerResponse.json()
        setUser({ ...ownerData, userType: 'owner' })
        return
      }

      const tenantResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/check-auth`, { credentials: 'include' })
      if (tenantResponse.ok) {
        const tenantData = await tenantResponse.json()
        setUser({ ...tenantData, userType: 'tenant' })
        return
      }

      setUser(null)
    } catch (error) {
      console.error('Error checking authentication:', error)
      setUser(null)
    }
  }

  const fetchNotificationCounts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/${user?.userType}/notification-counts`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setNotificationCounts(data)
      }
    } catch (error) {
      console.error('Error fetching notification counts:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">House Rental</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user.userType === 'owner' ? (
                <>
                  <Link href="/owner/tenants">
                    <Button variant="ghost">
                      <Users className="mr-2 h-4 w-4" />
                      Tenants List
                    </Button>
                  </Link>
                  <Link href="/owner/notifications">
                    <Button variant="ghost">
                      <Bell className="mr-2 h-4 w-4" />
                      Send Notifications
                    </Button>
                  </Link>
                  <Link href="/owner/payments">
                    <Button variant="ghost">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Status
                    </Button>
                  </Link>
                  <ButtonWithNotification 
                    href="/owner/applications" 
                    icon={FileText} 
                    label="Applications" 
                    count={notificationCounts.applications} 
                  />
                  <ButtonWithNotification 
                    href="/owner/service-requests" 
                    icon={Wrench} 
                    label="Service Requests" 
                    count={notificationCounts.serviceRequests} 
                  />
                </>
              ) : (
                <>
                  <Link href="/tenant/owner-details">
                    <Button variant="ghost">
                      <User className="mr-2 h-4 w-4" />
                      Owner Details
                    </Button>
                  </Link>
                  <Link href="/tenant/payments">
                    <Button variant="ghost">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Status
                    </Button>
                  </Link>
                  <Link href="/tenant/flats">
                    <Button variant="ghost">
                      <Home className="mr-2 h-4 w-4" />
                      Flats Info
                    </Button>
                  </Link>
                  <ButtonWithNotification 
                    href="/tenant/applications" 
                    icon={FileText} 
                    label="Applications" 
                    count={notificationCounts.applications} 
                  />
                  <ButtonWithNotification 
                    href="/tenant/service-requests" 
                    icon={Wrench} 
                    label="Service Requests" 
                    count={notificationCounts.serviceRequests} 
                  />
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  )}