// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"

// export default function AddBuilding() {
//   const [formData, setFormData] = useState({
//     building_name: '',
//     address: '',
//     vacant_flats: 0,
//     parking: 0,
//   })
//   const [error, setError] = useState('')
//   const router = useRouter()

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
//     setFormData({ ...formData, [e.target.name]: value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/add-building`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(formData),
//       })

//       if (res.ok) {
//         router.push('/owner/dashboard')
//       } else {
//         const data = await res.json()
//         setError(data.message || 'An error occurred while adding the building')
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.')
//     }
//   }

//   return (
//     <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Add New Building</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="building_name">Building Name</Label>
//               <Input
//                 id="building_name"
//                 name="building_name"
//                 type="text"
//                 placeholder="Enter building name"
//                 value={formData.building_name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 name="address"
//                 type="text"
//                 placeholder="Enter building address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="vacant_flats">Number of Vacant Flats</Label>
//               <Input
//                 id="vacant_flats"
//                 name="vacant_flats"
//                 type="number"
//                 placeholder="Enter number of vacant flats"
//                 value={formData.vacant_flats}
//                 onChange={handleChange}
//                 required
//                 min="0"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="parking">Parking Spaces Available</Label>
//               <Input
//                 id="parking"
//                 name="parking"
//                 type="number"
//                 placeholder="Enter number of parking spaces"
//                 value={formData.parking}
//                 onChange={handleChange}
//                 required
//                 min="0"
//               />
//             </div>
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             <Button type="submit" className="w-full">Add Building</Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex justify-center">
//           <Button variant="link" onClick={() => router.push('/owner/dashboard')}>
//             Back to Dashboard
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }





'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddBuilding() {
  const [formData, setFormData] = useState({
    building_name: '',
    address: '',
    vacant_flats: 0,
    parking: 0,
  })
  const [error, setError] = useState('')
  const router = useRouter()

  // Function to check authentication
  const checkAuth = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/check-auth`, {
      method: 'GET',
      credentials: 'include' // Include cookies in the request
    })
    
    if (res.status === 401) {  // 401 Unauthorized
      router.push('/signin/owner') // Redirect to login if not authenticated
    }
  }

  useEffect(() => {
    // Check authentication on component mount
    checkAuth()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/owner/buildings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(formData),
      })

      // Handle specific status codes
      if (res.status === 201) { // 201 Created - Success
        router.push('/owner/dashboard')
      } else if (res.status === 400) { // 400 Bad Request
        const data = await res.json()
        setError(data.message || 'Invalid input. Please check the data and try again.')
      } else if (res.status === 401) { // 401 Unauthorized
        router.push('/signin/owner')
      } else {
        setError('An error occurred while adding the building. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Add New Building</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="building_name">Building Name</Label>
              <Input
                id="building_name"
                name="building_name"
                type="text"
                placeholder="Enter building name"
                value={formData.building_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter building address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vacant_flats">Number of Vacant Flats</Label>
              <Input
                id="vacant_flats"
                name="vacant_flats"
                type="number"
                placeholder="Enter number of vacant flats"
                value={formData.vacant_flats}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Parking Spaces Available</Label>
              <Input
                id="parking"
                name="parking"
                type="number"
                placeholder="Enter number of parking spaces"
                value={formData.parking}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">Add Building</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push('/owner/dashboard')}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
