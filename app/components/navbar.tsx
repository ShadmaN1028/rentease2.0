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
import { Users, Bell, CreditCard, FileText, Wrench, User, LogOut, Home, UserCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface User {
  firstName: string
  lastName: string
  userType: 'owner' | 'tenant'
}

const ProfileDropdown = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/${user.userType}/profile`)}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${user.userType}/dashboard`)}>
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
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userType = pathname.includes('/tenant') ? 'tenant' : 'owner'
    // This is a placeholder. In a real application, you'd fetch the user data from your API
    setUser({
      firstName: 'John',
      lastName: 'Doe',
      userType: userType
    })
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/logout`, { method: 'POST', credentials: 'include' })
      setUser(null)
      router.push('/signin')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user || pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
    return null
  }

  const isOwner = pathname.includes('/owner')
  const isTenant = pathname.includes('/tenant')

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">House Rental</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isOwner && (
                <>
                  <Link href="/owner/tenancy-list">
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
                    count={0} 
                  />
                  <ButtonWithNotification 
                    href="/owner/service-requests" 
                    icon={Wrench} 
                    label="Service Requests" 
                    count={0} 
                  />
                </>
              )}
              {isTenant && (
                <>
                  <Link href="/tenant/flats-owned">
                    <Button variant="ghost">
                      <Home className="mr-2 h-4 w-4" />
                      My Flat
                    </Button>
                  </Link>
                  <Link href="/tenant/landlord-details">
                    <Button variant="ghost">
                      <User className="mr-2 h-4 w-4" />
                      Owner Details
                    </Button>
                  </Link>
                  <Link href="/tenant/notifications">
                    <Button variant="ghost">
                      <User className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                  </Link>
                  <ButtonWithNotification 
                    href="/tenant/applications" 
                    icon={FileText} 
                    label="Applications" 
                    count={0} 
                  />
                  <ButtonWithNotification 
                    href="/tenant/service-requests" 
                    icon={Wrench} 
                    label="Service Requests" 
                    count={0} 
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
  )
}