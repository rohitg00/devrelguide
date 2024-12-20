'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const Header = () => {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/Icon.svg" alt="DevRel Guide" className="h-8 w-8" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DevRel Guide
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link 
            href="/whitepaper" 
            className="text-foreground hover:text-primary flex items-center gap-2"
          >
            <span>Free Whitepaper</span>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">New</span>
          </Link>
          <Link 
            href="/resources"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/resources" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Resources
          </Link>
          <Link 
            href="/visualizations"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/visualizations" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Visualizations
          </Link>
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
