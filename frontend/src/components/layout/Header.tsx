'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/blog', label: 'BLOG', isNew: true },
    { href: '/whitepaper', label: 'WHITEPAPER' },
    { href: '/resources', label: 'RESOURCES' },
    { href: '/visualizations', label: 'VISUALIZATIONS' },
    { href: '/programs', label: 'PROGRAMS' },
    { href: '/builder', label: 'BUILDER' },
    { href: '/contact', label: 'CONTACT' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/Icon.svg" alt="DevRel Guide" width={32} height={32} style={{ width: 32, height: 32 }} priority />
          <span className="font-mono font-bold text-xl text-foreground uppercase tracking-wider">
            DevRel Guide
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-mono font-medium tracking-widest uppercase transition-colors hover:text-secondary",
                isActive(link.href) ? "text-secondary" : "text-foreground/70"
              )}
            >
              <span className="flex items-center gap-2">
                {link.label}
                {link.isNew && (
                  <span className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 font-mono uppercase tracking-wider -rotate-2">NEW</span>
                )}
              </span>
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
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

      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col p-4 space-y-4 bg-background border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-mono font-medium tracking-widest uppercase transition-colors hover:text-secondary p-2",
                  isActive(link.href) ? "text-secondary border-l-2 border-secondary pl-4" : "text-foreground/70"
                )}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.isNew && (
                    <span className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 font-mono uppercase tracking-wider -rotate-2">NEW</span>
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
