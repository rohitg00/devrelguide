import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { validate } from 'email-validator'
import disposableDomains from 'disposable-email-domains'

interface EmailEntry {
  email: string
  timestamp: string
  userAgent?: string
}

// List of common business domains that are likely to be real
const commonBusinessDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'aol.com',
  'protonmail.com',
  'icloud.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'google.com',
  'facebook.com',
  'linkedin.com'
]

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]
  return disposableDomains.includes(domain.toLowerCase())
}

function hasValidDomainStructure(email: string): boolean {
  const domain = email.split('@')[1]
  // Check if domain has at least one dot and proper length
  return domain.includes('.') && 
         domain.length >= 4 && 
         domain.length <= 255 &&
         !domain.startsWith('.') &&
         !domain.endsWith('.')
}

function isSuspiciousEmail(email: string): boolean {
  const lowercaseEmail = email.toLowerCase()
  
  // Check for common spam patterns
  if (lowercaseEmail.includes('spam') || 
      lowercaseEmail.includes('test') ||
      lowercaseEmail.includes('fake') ||
      lowercaseEmail.includes('temp') ||
      lowercaseEmail.includes('disposable')) {
    return true
  }

  // Check for random string patterns
  const localPart = lowercaseEmail.split('@')[0]
  if (localPart.length > 30 || /^\d+$/.test(localPart)) {
    return true
  }

  // Check for repetitive characters
  if (/(.)\1{4,}/.test(localPart)) {
    return true
  }

  return false
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email format validation
    if (!validate(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check for disposable email domains
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: 'Disposable email addresses are not allowed' }, { status: 400 })
    }

    // Check domain structure
    if (!hasValidDomainStructure(email)) {
      return NextResponse.json({ error: 'Invalid email domain' }, { status: 400 })
    }

    // Check for suspicious patterns
    if (isSuspiciousEmail(email)) {
      return NextResponse.json({ error: 'This email appears to be invalid' }, { status: 400 })
    }

    const dataPath = path.join(process.cwd(), 'data', 'emails.json')
    let emails: EmailEntry[] = []

    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8')
      emails = JSON.parse(fileContent)

      // Check for duplicate emails
      if (emails.some(entry => entry.email.toLowerCase() === email.toLowerCase())) {
        return NextResponse.json({ error: 'This email has already been registered' }, { status: 400 })
      }
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }

    // Add new email with timestamp
    const newEntry: EmailEntry = {
      email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined
    }

    emails.push(newEntry)

    // Write back to file
    await fs.writeFile(dataPath, JSON.stringify(emails, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing email:', error)
    return NextResponse.json({ error: 'Failed to store email' }, { status: 500 })
  }
}
