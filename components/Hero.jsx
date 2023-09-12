import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <div className='relative isolate overflow-hidden min-h-screen'>

        <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        fill
        className='-z-10 object-cover'
        alt="hero image"
        priority
        />

    <div className="absolute inset-0 bg-black opacity-20 -z-10" />        

    </div>
  )
}
