'use client'

 import { useState } from 'react'
 import { useRouter } from 'next/navigation'
 import Link from 'next/link'
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
 import { Label } from "@/components/ui/label"
 import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
 export default function SignIn() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const router = useRouter()
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     setError('')
     try {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API}/tenant/signin`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password }),
       })
       if (res.ok) {
         const data = await res.json()
         if (data.userType === 'owner') {
           router.push('/owner/dashboard')
         } else {
           router.push('/tenant/dashboard')
         }
       } else {
         setError('Invalid email or password')
       }
     } catch (error) {
       setError('An error occurred. Please try again.')
     }
   }
   return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
       <Card className="w-full max-w-md">
         <CardHeader>
           <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="Enter your email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 placeholder="Enter your password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
             {error && <p className="text-red-500 text-sm">{error}</p>}
             <Button type="submit" className="w-full">Sign In</Button>
           </form>
         </CardContent>
         <CardFooter className="flex justify-between">
           <Link href="/signup/owner" className="text-sm text-blue-600 hover:underline">
             Sign up as Owner
           </Link>
           <Link href="/signup/tenant" className="text-sm text-blue-600 hover:underline">
             Sign up as Tenant
           </Link>
         </CardFooter>
      </Card>
     </div>
   )
 }