'use client'

import { Mail, Calendar, Twitter, Linkedin, Github, ArrowRight, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Let's Connect
        </h1>
        <p className="text-xl text-muted-foreground">
          Have questions about our DevRel resources or need assistance? We're here to help!
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-10">
          {/* Get in Touch Section */}
          <section className="bg-card p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <a 
                href="mailto:contact@devrelasservice.com"
                className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-muted-foreground">contact@devrelasservice.com</p>
                </div>
              </a>

              <a 
                href="https://calendly.com/ghumare64/devrel-as-service"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Calendar className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">Schedule a Meeting</p>
                  <p className="text-sm text-muted-foreground">Book a time that works best for you</p>
                </div>
              </a>
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-card p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://twitter.com/devrelasservice"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Twitter className="w-5 h-5 text-primary" />
                <span className="font-medium">Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/company/devrel-as-service"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Linkedin className="w-5 h-5 text-primary" />
                <span className="font-medium">LinkedIn</span>
              </a>
              <a
                href="https://github.com/rohitg00/devrelguide"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Github className="w-5 h-5 text-primary" />
                <span className="font-medium">GitHub</span>
              </a>
            </div>
          </section>
        </div>

        {/* Services Section */}
        <div className="bg-gradient-to-b from-background to-muted p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">How We Can Help</h2>
          <div className="space-y-4">
            {[
              'Developer Relations Strategy Development',
              'Community Building and Management',
              'Technical Content Creation',
              'Developer Experience Optimization',
              'DevRel Metrics and Analytics',
              'Developer Program Management'
            ].map((service, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-background/50">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{service}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="https://calendly.com/ghumare64/devrel-as-service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
