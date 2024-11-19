'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, DollarSign } from 'lucide-react'
// import { toast } from "@/components/ui/use-toast"

interface RentDetails {
  amount: number
  dueDate: string
  isPaid: boolean
}

export default function PaymentPage() {
  const [rentDetails, setRentDetails] = useState<RentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentAmount, setPaymentAmount] = useState('')

  useEffect(() => {
    fetchRentDetails()
  }, [])

  const fetchRentDetails = async () => {
    try {
      const response = await fetch('/api/tenant/rent-details', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch rent details')
      const data = await response.json()
      setRentDetails(data)
      setPaymentAmount(data.amount.toString())
    } catch (error) {
      console.error('Error fetching rent details:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to load rent details. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tenant/pay-rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentAmount) }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Payment failed')
    //   toast({
    //     title: "Success",
    //     description: "Payment successful.",
    //   })
      fetchRentDetails() // Refresh rent details after payment
    } catch (error) {
      console.error('Error making payment:', error)
    //   toast({
    //     title: "Error",
    //     description: "Payment failed. Please try again.",
    //     variant: "destructive",
    //   })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!rentDetails) {
    return <div>Error loading rent details</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Rent Payment</h1>
      <Card>
        <CardHeader>
          <CardTitle>Rent Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Amount Due:</span>
            <span className="font-bold">${rentDetails.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Due Date:</span>
            <span>{new Date(rentDetails.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <span className={rentDetails.isPaid ? "text-green-500" : "text-red-500"}>
              {rentDetails.isPaid ? "Paid" : "Unpaid"}
            </span>
          </div>
          {!rentDetails.isPaid && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="paymentAmount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-10"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Pay Now</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}