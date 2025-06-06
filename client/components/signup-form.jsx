import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export function SignUpForm({
  className,
  ...props
}) {
  return (
    <>
      <div className="flex w-full justify-center">

        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Create a new account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>


        <div className="hidden md:flex md:w-1/2 items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md h-full overflow-hidden">
            <div className="relative h-full w-full">
              <Image
                src="/images/Frame 12.png"
                alt="Bulaksumur Ride"
                fill
                priority
                className="object-cover"
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
