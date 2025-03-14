'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/whitepaper', label: 'Free Whitepaper', isNew: true },
    { href: '/resources', label: 'Resources' },
    { href: '/visualizations', label: 'Visualizations' },
    { href: '/programs', label: 'DevRel Programs', isNew: true },
    { href: '/builder', label: 'Visualization Builder', isNew: true },
    { href: '/demo/spline', label: '3D Demo', isNew: true },
    { href: '/contact', label: 'Contact Us' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/Icon.svg" alt="DevRel Guide" width={32} height={32} style={{ width: 32, height: 32 }} priority />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DevRel Guide
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                {link.label}
                {link.isNew && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">New</span>
                )}
              </span>
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col p-4 space-y-4 bg-background border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary p-2",
                  pathname === link.href ? "text-primary bg-primary/10 rounded-lg" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.isNew && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">New</span>
                  )}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
