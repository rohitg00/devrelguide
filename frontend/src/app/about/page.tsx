'use client'

import { ArrowRight, Users, BookOpen, Code, LineChart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          About DevRel Resources
        </h1>
        <p className="text-xl text-muted-foreground">
          Empowering Developer Relations professionals to build and nurture thriving developer communities
        </p>
      </div>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto mb-20 bg-gradient-to-b from-background to-muted p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We are dedicated to empowering Developer Relations professionals with comprehensive resources, tools, and insights to build and nurture thriving developer communities.
        </p>
      </section>

      {/* What We Do Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Developer Relations Expertise</h3>
            <p className="text-muted-foreground">
              We provide expert guidance and resources for building and scaling developer relations programs, from strategy development to community management.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Community Building</h3>
            <p className="text-muted-foreground">
              Our platform offers tools and insights for creating engaging developer communities, fostering collaboration, and driving meaningful interactions.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Code className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Content Strategy</h3>
            <p className="text-muted-foreground">
              We help you create compelling technical content that resonates with developers, from documentation to blog posts and tutorials.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <LineChart className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
            <p className="text-muted-foreground">
              Access data-driven insights and visualizations to measure the impact of your developer relations initiatives and make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-primary">Community First</h3>
            <p className="text-muted-foreground">
              We believe in the power of community and put developers' needs at the center of everything we do.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-primary">Knowledge Sharing</h3>
            <p className="text-muted-foreground">
              We're committed to sharing best practices and fostering learning within the DevRel community.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-primary">Data-Driven</h3>
            <p className="text-muted-foreground">
              We emphasize the importance of metrics and analytics in building successful DevRel programs.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-primary">Innovation</h3>
            <p className="text-muted-foreground">
              We continuously explore new ways to improve developer experience and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-secondary/10 p-12 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Want to learn more about how we can help you build and scale your developer relations program?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:contact@devrelasservice.com"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6"
          >
            Contact Us
          </a>
          <a
            href="https://calendly.com/ghumare64/devrel-as-service"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6"
          >
            Schedule a Call <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
