import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to House Rental</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/signin/owner" passHref>
              <Button className="w-full">Owner Sign In</Button>
            </Link>
            <Link href="/signin/tenant" passHref>
              <Button className="w-full">Tenant Sign In</Button>
            </Link>
            <Link href="/signup/owner" passHref>
              <Button className="w-full" variant="outline">Owner Sign Up</Button>
            </Link>
            <Link href="/signup/tenant" passHref>
              <Button className="w-full" variant="outline">Tenant Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}