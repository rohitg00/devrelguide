'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/50 bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/Icon.svg"
                alt="DevRel Guide"
                width={32}
                height={32}
                style={{ width: 32, height: 32 }}
                priority
              />
              <span className="font-mono font-bold text-xl text-foreground uppercase tracking-wider">
                DevRel Guide
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-mono">
              Your comprehensive platform for Developer Relations resources, visualizations, and insights
            </p>
          </div>

          <div>
            <h3 className="font-hand text-lg mb-4 text-muted-foreground">Resources</h3>
            <div className="w-full h-px bg-white/10 mb-4" />
            <ul className="space-y-2">
              <li>
                <Link href="/whitepaper" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  GitHub Programs
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  Job Opportunities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-hand text-lg mb-4 text-muted-foreground">Company</h3>
            <div className="w-full h-px bg-white/10 mb-4" />
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@devrelasservice.com"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-hand text-lg mb-4 text-muted-foreground">Legal</h3>
            <div className="w-full h-px bg-white/10 mb-4" />
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-secondary transition-colors font-mono">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              &copy; {currentYear} DevRel-As-Service. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://twitter.com/devrelasservice"
                className="text-xs text-muted-foreground hover:text-secondary transition-colors font-mono uppercase tracking-wider"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/devrel-as-service"
                className="text-xs text-muted-foreground hover:text-secondary transition-colors font-mono uppercase tracking-wider"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/rohitg00/devrelguide"
                className="text-xs text-muted-foreground hover:text-secondary transition-colors font-mono uppercase tracking-wider"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
