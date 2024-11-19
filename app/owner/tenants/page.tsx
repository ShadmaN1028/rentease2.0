'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search } from 'lucide-react'

interface Tenant {
  user_id: string
  first_name: string
  last_name: string
  flat_number: string
  building_name: string
  payment_status: 'paid' | 'unpaid'
}

export default function TenantList() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTenants()
  }, [])

  useEffect(() => {
    if (tenants.length > 0) {
      setFilteredTenants(
        tenants.filter(tenant =>
          `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, tenants])

  const fetchTenants = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/payments/tenancy-list`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tenants')
      }
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setTenants(data.data)
        setFilteredTenants(data.data)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (err) {
      setError('An error occurred while fetching tenants. Please try again.')
      console.error('Error fetching tenants:', err)
    } finally {
      setIsLoading(false)
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
          <CardTitle className="text-2xl font-bold">Tenant List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {filteredTenants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.user_id}>
                    <TableCell>{`${tenant.first_name} ${tenant.last_name}`}</TableCell>
                    <TableCell>{tenant.flat_number}</TableCell>
                    <TableCell>{tenant.building_name}</TableCell>
                    <TableCell>
                      <Badge className={tenant.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'}>
                        {tenant.payment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No tenants found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )}