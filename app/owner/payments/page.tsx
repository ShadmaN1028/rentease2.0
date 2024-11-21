'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, Plus, Edit } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface Payment {
  payment_id: string
  tenancy_id: string
  amount: number
  payment_date: string
  payment_type: number
  status: number
  flat_number: string
  first_name: string
  last_name: string
}

interface Tenancy {
  tenancy_id: string
  flat_number: string
  first_name: string
  last_name: string
}

export default function OwnerPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [partiallyPaidPayments, setPartiallyPaidPayments] = useState<Payment[]>([])
  const [unpaidPayments, setUnpaidPayments] = useState<Tenancy[]>([])
  const [tenancies, setTenancies] = useState<Tenancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false)
  const [isUpdatePaymentDialogOpen, setIsUpdatePaymentDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [newPayment, setNewPayment] = useState({
    tenancy_id: '',
    amount: '',
    payment_type: '',
    status: ''
  })

  useEffect(() => {
    fetchPayments()
    fetchTenancies()
    fetchPartiallyPaidPayments()
    fetchUnpaidPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/payments-list`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch payments')
      }
      const data = await response.json()
      if (data.success) {
        setPayments(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch payments')
      }
    } catch (err) {
      setError('An error occurred while fetching payments. Please try again.')
      console.error('Error fetching payments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTenancies = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/payments/tenancy-list`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch tenancies')
      }
      const data = await response.json()
      if (data.success) {
        setTenancies(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch tenancies')
      }
    } catch (err) {
      console.error('Error fetching tenancies:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch tenancies. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const fetchPartiallyPaidPayments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/payments/partially-paid`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch partially paid payments')
      }
      const data = await response.json()
      if (data.success) {
        setPartiallyPaidPayments(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch partially paid payments')
      }
    } catch (err) {
      console.error('Error fetching partially paid payments:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch partially paid payments. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const fetchUnpaidPayments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/payments/unpaid`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch unpaid payments')
      }
      const data = await response.json()
      if (data.success) {
        setUnpaidPayments(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch unpaid payments')
      }
    } catch (err) {
      console.error('Error fetching unpaid payments:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to fetch unpaid payments. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleAddPayment = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/payments/${newPayment.tenancy_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPayment),
      })
      if (!response.ok) {
        throw new Error('Failed to add payment')
      }
      const data = await response.json()
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: "Payment added successfully.",
        // })
        fetchPayments()
        fetchPartiallyPaidPayments()
        fetchUnpaidPayments()
        setIsAddPaymentDialogOpen(false)
        setNewPayment({ tenancy_id: '', amount: '', payment_type: '', status: '' })
      } else {
        throw new Error(data.message || 'Failed to add payment')
      }
    } catch (err) {
      console.error('Error adding payment:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to add payment. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const handleUpdatePayment = async () => {
    if (!selectedPayment) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/update-payment/${selectedPayment.payment_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: selectedPayment.amount,
          payment_type: selectedPayment.payment_type,
          status: selectedPayment.status,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update payment')
      }
      const data = await response.json()
      if (data.success) {
        // toast({
        //   title: "Success",
        //   description: "Payment updated successfully.",
        // })
        fetchPayments()
        fetchPartiallyPaidPayments()
        fetchUnpaidPayments()
        setIsUpdatePaymentDialogOpen(false)
        setSelectedPayment(null)
      } else {
        throw new Error(data.message || 'Failed to update payment')
      }
    } catch (err) {
      console.error('Error updating payment:', err)
      // toast({
      //   title: "Error",
      //   description: "Failed to update payment. Please try again.",
      //   variant: "destructive",
      // })
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-500">Paid</Badge>
      case 2:
        return <Badge className="bg-yellow-500">Partially Paid</Badge>
      case 3:
        return <Badge className="bg-red-500">Unpaid</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getPaymentType = (type: number) => {
    switch (type) {
      case 1:
        return 'Full Payment'
      case 2:
        return 'Partial Payment'
      default:
        return 'Unknown'
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
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="partial">Partially Paid</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">All Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={payments} onEdit={(payment) => {
                setSelectedPayment(payment)
                setIsUpdatePaymentDialogOpen(true)
              }} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="partial">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Partially Paid Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={partiallyPaidPayments} onEdit={(payment) => {
                setSelectedPayment(payment)
                setIsUpdatePaymentDialogOpen(true)
              }} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unpaid">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Unpaid Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <UnpaidPaymentsTable unpaidPayments={unpaidPayments} onAddPayment={(tenancy) => {
                setNewPayment({
                  tenancy_id: tenancy.tenancy_id,
                  amount: '',
                  payment_type: '',
                  status: ''
                })
                setIsAddPaymentDialogOpen(true)
              }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={fetchPayments}>Refresh Payments</Button>
      </div>

      <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment_type" className="text-right">
                Payment Type
              </Label>
              <Select onValueChange={(value) => setNewPayment({...newPayment, payment_type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Full Payment</SelectItem>
                  <SelectItem value="2">Partial Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value) => setNewPayment({...newPayment, status: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Paid</SelectItem>
                  <SelectItem value="2">Partially Paid</SelectItem>
                  <SelectItem value="3">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddPayment}>Add Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdatePaymentDialogOpen} onOpenChange={setIsUpdatePaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={selectedPayment.amount}
                  onChange={(e) => setSelectedPayment({...selectedPayment, amount: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_type" className="text-right">
                  Payment Type
                </Label>
                <Select 
                  value={selectedPayment.payment_type.toString()} 
                  onValueChange={(value) => setSelectedPayment({...selectedPayment, payment_type: Number(value)})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Full Payment</SelectItem>
                    <SelectItem value="2">Partial Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={selectedPayment.status.toString()} 
                  onValueChange={(value) =>
                    setSelectedPayment({...selectedPayment, status: Number(value)})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Paid</SelectItem>
                    <SelectItem value="2">Partially Paid</SelectItem>
                    <SelectItem value="3">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdatePayment}>Update Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PaymentsTable({ payments, onEdit }: { payments: Payment[], onEdit: (payment: Payment) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Flat</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>Payment Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.payment_id}>
            <TableCell>{payment.flat_number}</TableCell>
            <TableCell>{payment.first_name} {payment.last_name}</TableCell>
            <TableCell>${payment.amount}</TableCell>
            <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
            <TableCell>{getPaymentType(payment.payment_type)}</TableCell>
            <TableCell>{getStatusBadge(payment.status)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(payment)}>
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function UnpaidPaymentsTable({ unpaidPayments, onAddPayment }: { unpaidPayments: Tenancy[], onAddPayment: (tenancy: Tenancy) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Flat</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {unpaidPayments.map((tenancy) => (
          <TableRow key={tenancy.tenancy_id}>
            <TableCell>{tenancy.flat_number}</TableCell>
            <TableCell>{tenancy.first_name} {tenancy.last_name}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onAddPayment(tenancy)}>
                Add Payment
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function getStatusBadge(status: number) {
  switch (status) {
    case 1:
      return <Badge className="bg-green-500">Paid</Badge>
    case 2:
      return <Badge className="bg-yellow-500">Partially Paid</Badge>
    case 3:
      return <Badge className="bg-red-500">Unpaid</Badge>
    default:
      return <Badge className="bg-gray-500">Unknown</Badge>
  }
}

function getPaymentType(type: number) {
  switch (type) {
    case 1:
      return 'Full Payment'
    case 2:
      return 'Partial Payment'
    default:
      return 'Unknown'
  }
}