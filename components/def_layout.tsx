import React from 'react';
import Link  from 'next/link';
import '@/app/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Image          from 'next/image';

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <UserProvider>
        <div className="flex flex-col bg-[#121212]">
        {/* navbar -- make into component */}
        <div className="min-h-screen w-screen w-screen p-2 flex flex-row items-center h-15">
            <Link href="/">
                <div className="w-40 h-15 hover:gradient-text-pg hover:shadow-blue transition-shadow duration-300">
                    <Image
                    src="/animated/navLogo.svg"
                    alt="Nav Logo"
                    width={170}
                    height={55}
                    />
                </div>
            </Link>

            <div className="w-full flex flex-row h-15 items-center justify-center">
                <Link href="/history">
                    <p className="px-3 opacity-75 text-l hover:gradient-text-bp hover:shadow-green transition-shadow duration-300">HISTORY</p>
                </Link>
                <Link href="/log">
                    <p className="px-3 opacity-75 text-l hover:gradient-text-gb hover:shadow-pink transition-shadow duration-300">LOG</p>
                </Link>
                <Link href="/social">
                    <p className="px-3 opacity-75 text-l hover:gradient-text-pg hover:shadow-blue transition-shadow duration-300">SOCIAL</p>
                </Link>
                <Link href="/discover">
                    <p className="px-3 opacity-75 text-l hover:gradient-text-bp hover:shadow-green transition-shadow duration-300">DISCOVER</p>
                </Link>
            </div>

            <div className="p-2 flex justify-end items-center"> 
                <Link href="api/auth/logout">
                    <div className="flex px-3 items-center hover:shadow-blue transition-shadow duration-300"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10 pr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="l-0 pl-1 text-xl font-bold hover:gradient-text-pg ">Logout</p>
                    </div>
                </Link>
            </div>

        </div>
        {/* end of nav */}

        {children}
        
        </div>
        </UserProvider>
    )
}