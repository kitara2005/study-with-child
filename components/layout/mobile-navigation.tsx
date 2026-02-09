'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavigationProps {
  navLinks: NavLink[];
}

export function MobileNavigation({ navLinks }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <nav className="bg-background absolute top-16 right-0 left-0 border-b shadow-lg">
          <div className="container flex flex-col py-4">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className="justify-start"
                onClick={() => setIsOpen(false)}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
