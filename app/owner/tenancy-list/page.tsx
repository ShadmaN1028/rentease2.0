'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Search, Info, X } from 'lucide-react'


interface Tenancy {
  tenancy_id: string
  user_id: string
  first_name: string
  last_name: string
  flat_number: string
  start_date: string
  end_date: string | null
  status: number
}

export default function TenancyList() {
  const [tenancies, setTenancies] = useState<Tenancy[]>([])
  const [filteredTenancies, setFilteredTenancies] = useState<Tenancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenancy, setSelectedTenancy] = useState<Tenancy | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [tenancyToRemove, setTenancyToRemove] = useState<string | null>(null)

  useEffect(() => {
    fetchTenancies()
  }, [])

  useEffect(() => {
    if (tenancies.length > 0) {
      setFilteredTenancies(
        tenancies.filter(tenancy =>
          `${tenancy.first_name} ${tenancy.last_name} ${tenancy.flat_number}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, tenancies])

  const fetchTenancies = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/tenancy/tenancy-list`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tenancies')
      }
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setTenancies(data.data)
        setFilteredTenancies(data.data)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (err) {
      setError('An error occurred while fetching tenancies. Please try again.')
      console.error('Error fetching tenancies:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTenancyDetails = async (tenancyId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/tenancy/tenancy-details/${tenancyId}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tenancy details')
      }
      const data = await response.json()
      if (data.success && data.data) {
        setSelectedTenancy(data.data[0])
        setIsDetailsDialogOpen(true)
      } else {
        throw new Error('Invalid data format received from API')
      }
    } catch (err) {
      console.error('Error fetching tenancy details:', err)
      
    }
  }

  const handleRemoveTenancy = (tenancyId: string) => {
    setTenancyToRemove(tenancyId)
    setIsRemoveDialogOpen(true)
  }

  const confirmRemoveTenancy = async () => {
    if (!tenancyToRemove) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/tenancy/remove-tenancy/${tenancyToRemove}`, {
        method: 'PUT',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to remove tenancy')
      }
      const data = await response.json()
      if (data.success) {
        
        fetchTenancies() // Refresh the list
      } else {
        throw new Error('Failed to remove tenancy')
      }
    } catch (err) {
      console.error('Error removing tenancy:', err)
      
    } finally {
      setIsRemoveDialogOpen(false)
      setTenancyToRemove(null)
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
          <CardTitle className="text-2xl font-bold">Tenancy List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search tenancies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {filteredTenancies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Flat Number</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenancies.map((tenancy) => (
                  <TableRow key={tenancy.tenancy_id}>
                    <TableCell>{`${tenancy.first_name} ${tenancy.last_name}`}</TableCell>
                    <TableCell>{tenancy.flat_number}</TableCell>
                    <TableCell>{new Date(tenancy.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={tenancy.status === 1 ? 'bg-green-500' : 'bg-red-500'}>
                        {tenancy.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => fetchTenancyDetails(tenancy.tenancy_id)}>
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveTenancy(tenancy.tenancy_id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No tenancies found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tenancy Details</DialogTitle>
          </DialogHeader>
          {selectedTenancy && (
            <div className="mt-4">
              <p><strong>Tenant:</strong> {selectedTenancy.first_name} {selectedTenancy.last_name}</p>
              <p><strong>Flat Number:</strong> {selectedTenancy.flat_number}</p>
              <p><strong>Start Date:</strong> {new Date(selectedTenancy.start_date).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {selectedTenancy.end_date ? new Date(selectedTenancy.end_date).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> {selectedTenancy.status === 1 ? 'Active' : 'Inactive'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Tenancy Removal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to remove this tenancy? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRemoveTenancy}>Remove Tenancy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}