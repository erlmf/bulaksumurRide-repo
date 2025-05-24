import React from 'react'
import { Geist } from 'next/font/google';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function main() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      
      <Card className='h-full w-full max-w-md'>
        <CardHeader> 
          <CardTitle>
            Welcome to Bulaksumur Ride
          </CardTitle>
          <CardDescription>
            This is the main page of the application. You can navigate to other pages from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint eligendi atque nisi veritatis modi officia rerum. Itaque quae ipsum provident, tenetur beatae, nobis inventore possimus voluptatem aut error tempora? Reiciendis!  </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default main
