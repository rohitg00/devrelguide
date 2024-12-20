'use client';

import React from 'react';
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">DevRel Resources</Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="p-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/resources" className="text-sm font-medium hover:text-primary transition-colors">
            Resources
          </Link>
          <Link href="/visualizations" className="text-sm font-medium hover:text-primary transition-colors">
            Visualizations
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 space-y-4">
          <Link
            href="/resources"
            className="block text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Resources
          </Link>
          <Link
            href="/visualizations"
            className="block text-sm font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Visualizations
          </Link>
        </div>
      )}
    </div>
  );
}
