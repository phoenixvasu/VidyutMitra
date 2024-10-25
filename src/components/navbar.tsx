"use client";

import Image from "next/image"; // Import Image for logo
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthContext } from "@/context/auth-context";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      e.preventDefault();
      const targetId = (e.currentTarget as HTMLAnchorElement)
        .getAttribute("href")
        ?.slice(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsOpen(false); // Close mobile menu after clicking a link
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", smoothScroll as EventListener);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", smoothScroll as EventListener);
      });
    };
  }, []);

  const NavLinks = () => (
    <>
      {isLandingPage && (
        <>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="#success-stories"
          >
            Success Stories
          </Link>
        </>
      )}
      {user ? (
        <>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="/learn-more"
          >
            Discover More
          </Link>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="/dashboard"
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Your Dashboard
            </Button>
          </Link>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="/settings"
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Account Settings
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="/learn-more"
          >
            Discover More
          </Link>
          <Link
            className="text-sm font-medium text-white hover:text-indigo-300"
            href="/sign-in"
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Sign In
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 sticky top-0 bg-indigo-800 text-white z-10">
      <Link className="flex items-center justify-center" href="/">
        <Image 
          src="/vidhyut-mitra-logo.png" // Corrected path to the logo
          alt="VidyutMitra Logo"
          width={35}
          height={35}
        />
        <span className="ml-2 text-2xl font-bold">VidyutMitra</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
        <NavLinks />
      </nav>

      {/* Mobile Navigation */}
      <div className="ml-auto md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
