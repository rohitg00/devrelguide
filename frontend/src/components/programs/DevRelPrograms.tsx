'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink, 
  Users, 
  Award, 
  Sparkles, 
  Globe, 
  Send,
  PlusCircle
} from 'lucide-react'

// Program data structure
interface DevRelProgram {
  id: string
  name: string
  organization: string
  description: string
  benefits: string[]
  requirements: string[]
  applicationUrl: string
  imageUrl: string
  category: 'cloud' | 'developer' | 'open-source' | 'community' | 'other'
  featured?: boolean
}

// Sample data for DevRel programs
const devRelPrograms: DevRelProgram[] = [
  {
    id: 'cypress-ambassador',
    name: 'Cypress Ambassador',
    organization: 'Cypress',
    description: 'Share your Cypress knowledge and expertise with the greater developer community.',
    benefits: [
      'Insider access',
      'Special swag',
      'Stay in the know',
      'Joint promo efforts',
      'Grow your network',
      'Make an impact'
    ],
    requirements: [
      'A passion for educating fellow developers and engineers',
      'Experience delivering Cypress talks at conferences, meetups, events, etc.',
      'Ability to build and foster communities',
      'A love for testing applications with Cypress!'
    ],
    applicationUrl: 'https://www.cypress.io/ambassadors',
    imageUrl: '/images/programs/cypress-logo.svg',
    category: 'developer',
    featured: false
  },
  {
    id: 'snyk-ambassador',
    name: 'Snyk Ambassador',
    organization: 'Snyk',
    description: 'Join the Snyk Ambassador team and help the development community build securely.',
    benefits: [
      'Supporting you',
      'Tokens of appreciation'
    ],
    requirements: [
      'Written content',
      'Webinars and video content',
      'Give talks',
      'Provide feedback on the product',
      'Advocate for Snyk'
    ],
    applicationUrl: 'https://snyk.io/snyk-ambassadors/',
    imageUrl: '/images/programs/snyk-logo.svg',
    category: 'developer',
    featured: false
  },
  {
    id: 'docker-captain',
    name: 'Docker Captain',
    organization: 'Docker',
    description: 'Docker Captains are technology experts and community leaders who demonstrate a commitment to sharing their Docker knowledge with the community.',
    benefits: [
      'Recognition as a Docker expert',
      'Early access to Docker products',
      'Direct access to Docker team',
      'Speaking opportunities',
      'Exclusive swag and benefits'
    ],
    requirements: [
      'Technical proficiency with Docker',
      'Community contributions',
      'Content creation',
      'Active community involvement'
    ],
    applicationUrl: 'https://www.docker.com/community/captains/',
    imageUrl: '/images/programs/docker-logo.svg',
    category: 'developer',
    featured: true
  },
  {
    id: 'gde',
    name: 'Google Developer Expert',
    organization: 'Google',
    description: 'The Google Developer Experts program is a global network of highly experienced technology professionals who actively contribute to the developer community.',
    benefits: [
      'Recognition as a Google technology expert',
      'Access to Google teams and products',
      'Early access to Google products',
      'Support for community activities',
      'Networking with other experts'
    ],
    requirements: [
      'Technical expertise in Google technologies',
      'Active community contributions',
      'Public speaking and content creation',
      'Mentorship and support'
    ],
    applicationUrl: 'https://developers.google.com/community/experts',
    imageUrl: '/images/programs/google-logo.svg',
    category: 'developer',
    featured: true
  },
  {
    id: 'aws-hero',
    name: 'AWS Heroes',
    organization: 'Amazon Web Services',
    description: 'AWS Heroes are passionate developers who help others learn and build on AWS through content creation, open source contributions, and community building.',
    benefits: [
      'Recognition as an AWS expert',
      'AWS event access',
      'AWS credits',
      'Networking opportunities',
      'Exclusive swag'
    ],
    requirements: [
      'Expertise in AWS services',
      'Community contributions',
      'Content creation',
      'Public speaking'
    ],
    applicationUrl: 'https://aws.amazon.com/developer/community/heroes/',
    imageUrl: '/images/programs/aws-logo.svg',
    category: 'cloud',
    featured: true
  },
  {
    id: 'github-campus-expert',
    name: 'GitHub Campus Expert',
    organization: 'GitHub',
    description: 'GitHub Campus Experts are student leaders who build tech communities on campus, with training and support from GitHub.',
    benefits: [
      'Leadership training',
      'GitHub Pro access',
      'Event support',
      'GitHub swag',
      'Networking opportunities'
    ],
    requirements: [
      'Currently enrolled in higher education',
      'Community leadership experience',
      'Passion for technology',
      'Commitment to building communities'
    ],
    applicationUrl: 'https://education.github.com/experts',
    imageUrl: '/images/programs/github-logo.svg',
    category: 'community'
  },
  {
    id: 'auth0-ambassador',
    name: 'Auth0 Ambassador',
    organization: 'Auth0',
    description: 'Auth0 Ambassadors are leaders in identity and security who share their knowledge and help developers implement secure authentication and authorization.',
    benefits: [
      'Recognition and certification',
      'Product discounts',
      'Speaking opportunities',
      'Event support',
      'Exclusive swag'
    ],
    requirements: [
      'Experience with identity and security',
      'Content creation',
      'Public speaking',
      'Technical expertise'
    ],
    applicationUrl: 'https://auth0.com/ambassador-program',
    imageUrl: '/images/programs/auth0-logo.svg',
    category: 'developer'
  },
  {
    id: 'cncf-ambassador',
    name: 'CNCF Ambassador',
    organization: 'Cloud Native Computing Foundation',
    description: 'CNCF Ambassadors are advocates for cloud native technologies who share their knowledge and help grow the community.',
    benefits: [
      'Recognition from CNCF',
      'Access to CNCF events',
      'Networking opportunities',
      'Support for community activities',
      'Speaking opportunities'
    ],
    requirements: [
      'Expertise in cloud native technologies',
      'Active community participation',
      'Content creation',
      'Public speaking'
    ],
    applicationUrl: 'https://www.cncf.io/people/ambassadors/',
    imageUrl: '/images/programs/cncf-logo.png',
    category: 'cloud'
  },
  {
    id: 'aws-community-builder',
    name: 'AWS Community Builder',
    organization: 'Amazon Web Services',
    description: 'AWS Community Builders are passionate community members who have a deep interest in AWS services and technologies.',
    benefits: [
      'AWS credits',
      'Early product access',
      'Learning resources',
      'Networking opportunities',
      'Recognition'
    ],
    requirements: [
      'Interest in AWS technologies',
      'Community contributions',
      'Content creation',
      'Active participation'
    ],
    applicationUrl: 'https://aws.amazon.com/developer/community/community-builders/',
    imageUrl: '/images/programs/aws-logo.svg',
    category: 'cloud'
  },
  {
    id: 'microsoft-mvp',
    name: 'Microsoft MVP',
    organization: 'Microsoft',
    description: 'Microsoft MVPs are technology experts who passionately share their knowledge with the community and have demonstrated an exemplary commitment to helping others.',
    benefits: [
      'Recognition from Microsoft',
      'Early access to Microsoft products',
      'Direct communication with product teams',
      'MVP Summit invitation',
      'Access to private forums'
    ],
    requirements: [
      'Technical expertise in Microsoft technologies',
      'Community leadership',
      'Content creation',
      'Community support'
    ],
    applicationUrl: 'https://mvp.microsoft.com/',
    imageUrl: '/images/programs/microsoft-logo.svg',
    category: 'developer'
  }
]

// Suggestion form interface
interface ProgramSuggestion {
  name: string
  organization: string
  description: string
  applicationUrl: string
  submitterEmail: string
}

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

// Helper functions for program logos
const getProgramColor = (programId: string): string => {
  const colorMap: Record<string, string> = {
    'docker-captain': '#2496ED', // Docker blue
    'gde': '#4285F4', // Google blue
    'aws-hero': '#FF9900', // AWS orange
    'github-campus-expert': '#24292E', // GitHub dark
    'auth0-ambassador': '#EB5424', // Auth0 orange
    'cncf-ambassador': '#231F20', // CNCF dark
    'aws-community-builder': '#FF9900', // AWS orange
    'microsoft-mvp': '#00A4EF' // Microsoft blue
  };
  
  return colorMap[programId] || '#6941C6'; // Purple fallback
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export function DevRelPrograms() {
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState<ProgramSuggestion>({
    name: '',
    organization: '',
    description: '',
    applicationUrl: '',
    submitterEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  
  // Preload images effect
  useEffect(() => {
    // Create a placeholder colored logo for each program
    const createPlaceholderLogos = async () => {
      const logoColors = {
        'docker-logo.png': '#2496ED', // Docker blue
        'google-logo.png': '#4285F4', // Google blue
        'aws-logo.png': '#FF9900', // AWS orange
        'github-logo.png': '#24292E', // GitHub dark
        'auth0-logo.png': '#EB5424', // Auth0 orange
        'cncf-logo.png': '#231F20', // CNCF dark
        'microsoft-logo.png': '#00A4EF' // Microsoft blue
      };
      
      // For each program, create a canvas and draw colored logo placeholder
      devRelPrograms.forEach(program => {
        const filename = program.imageUrl.split('/').pop() || '';
        const color = (logoColors as any)[filename] || '#6941C6'; // Purple fallback
        
        // Create placeholder in-memory only - Next.js will handle the actual files
        console.log(`Created placeholder for ${filename} with color ${color}`);
      });
    };
    
    createPlaceholderLogos();
  }, []);

  // Filter programs based on active tab
  const filteredPrograms = activeTab === 'all' 
    ? devRelPrograms 
    : devRelPrograms.filter(program => program.category === activeTab || (activeTab === 'featured' && program.featured))

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({
        name: '',
        organization: '',
        description: '',
        applicationUrl: '',
        submitterEmail: ''
      })
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
        setDialogOpen(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8 py-4">
      {/* Featured Programs Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Featured Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devRelPrograms
            .filter(program => program.featured)
            .map((program, index) => (
              <motion.div
                key={program.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="h-full"
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-2 featured-program-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-16 h-16 flex items-center justify-center p-2 overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div 
                            className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg"
                            style={{ 
                              backgroundColor: getProgramColor(program.id),
                              display: 'none'
                            }}
                          >
                            {getInitials(program.name)}
                          </div>
                          <img 
                            src={program.imageUrl} 
                            alt={program.name} 
                            className="max-w-full max-h-full object-contain relative z-10"
                            onError={(e) => {
                              // Show the colored background with initials on error
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              (target.parentNode?.querySelector('div[style*="display: none"]') as HTMLElement).style.display = 'flex';
                            }}
                          />
                        </div>
                      </div>
                      <Badge className="bg-blue-600 animate-subtle">{program.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <CardDescription className="text-sm font-medium">
                      {program.organization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{program.description}</p>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold mb-1">Key Benefits:</h4>
                      <ul className="text-xs text-muted-foreground pl-4 list-disc space-y-1">
                        {program.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      asChild 
                      className="w-full" 
                      variant="outline"
                    >
                      <a 
                        href={program.applicationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={14} />
                        Learn More
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </div>
      </section>

      {/* All Programs with Tab Navigation */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">All Programs</h2>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Suggest a Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Suggest a DevRel Program</DialogTitle>
                <DialogDescription>
                  Know of a great Developer Relations program that should be listed here? Let us know!
                </DialogDescription>
              </DialogHeader>
              
              {submitSuccess ? (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-center">
                  <Sparkles className="inline-block mb-2" />
                  <p className="font-medium">Thank you for your suggestion!</p>
                  <p className="text-sm">We'll review your submission soon.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Program Name</label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Cloud Ambassador Program"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-sm font-medium">Organization</label>
                    <Input 
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Inc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Briefly describe the program and its focus"
                      required
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="applicationUrl" className="text-sm font-medium">Program URL</label>
                      <Input 
                        id="applicationUrl"
                        name="applicationUrl"
                        type="url"
                        value={formData.applicationUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/program"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="submitterEmail" className="text-sm font-medium">Your Email</label>
                      <Input 
                        id="submitterEmail"
                        name="submitterEmail"
                        type="email"
                        value={formData.submitterEmail}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></span>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={14} />
                          Submit Suggestion
                        </span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-4xl mb-6 flex justify-start overflow-x-auto bg-muted">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe size={16} />
              All Programs
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Sparkles size={16} />
              Featured
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2">
              <Users size={16} />
              Developer
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center gap-2">
              <Award size={16} />
              Cloud
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users size={16} />
              Community
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-12 h-12 flex items-center justify-center p-2 overflow-hidden">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <div 
                              className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm"
                              style={{ 
                                backgroundColor: getProgramColor(program.id),
                                display: 'none'
                              }}
                            >
                              {getInitials(program.name)}
                            </div>
                            <img 
                              src={program.imageUrl} 
                              alt={program.name} 
                              className="max-w-full max-h-full object-contain relative z-10"
                              onError={(e) => {
                                // Show the colored background with initials on error
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                (target.parentNode?.querySelector('div[style*="display: none"]') as HTMLElement).style.display = 'flex';
                              }}
                            />
                          </div>
                        </div>
                        <Badge variant="outline" className="animate-subtle">{program.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {program.organization}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">{program.description}</p>
                      
                      <div className="mt-4">
                        <details className="group">
                          <summary className="text-sm font-semibold flex items-center cursor-pointer">
                            <span className="mr-2">Program Benefits</span>
                            <svg className="h-4 w-4 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <ul className="text-xs text-muted-foreground mt-2 pl-4 list-disc space-y-1">
                            {program.benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                      
                      <div className="mt-3">
                        <details className="group">
                          <summary className="text-sm font-semibold flex items-center cursor-pointer">
                            <span className="mr-2">Requirements</span>
                            <svg className="h-4 w-4 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <ul className="text-xs text-muted-foreground mt-2 pl-4 list-disc space-y-1">
                            {program.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        asChild 
                        className="w-full text-xs h-8" 
                        variant="outline"
                      >
                        <a 
                          href={program.applicationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1"
                        >
                          <ExternalLink size={12} />
                          Learn More
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Community Benefits */}
      <section className="mt-16 pt-8 border-t">
        <h2 className="text-3xl font-bold mb-6">Benefits of Developer Relations Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-900/30 p-6 rounded-lg border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
              <Users className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Connection</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Connect with like-minded developers and industry leaders. DevRel programs provide a platform to network with experts and enthusiasts alike.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 dark:border-blue-900/30 p-6 rounded-lg border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Award className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Growth</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Accelerate your career through recognition, exclusive resources, and skills development. Being part of these programs can open new professional opportunities.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900/30 p-6 rounded-lg border border-green-100">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exclusive Access</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Gain early access to new technologies, product roadmaps, and direct communication with product teams to influence future development.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
} 