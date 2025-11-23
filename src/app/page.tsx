"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <div>
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col">

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-8 py-20">
          <div className="max-w-6xl w-full">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                  Welcome to hooka4u
                </p>
                <h2 className="text-5xl md:text-6xl font-bold leading-tight text-zinc-900 dark:text-white">
                  Manage Orders Efficiently
                </h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  Access the complete order management system. View table
                  orders, manage flavors, process payments, and deliver
                  exceptional service in real-time.
                </p>
              </div>

              <Link href="/login">
                <Button size="lg">Login to System</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 mt-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Design/Developed by: Devkins Private Limited Pakistan
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                © {year} Created by Jodel Aristilde (2BrothersMovement)
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                <a
                  href="mailto:seating4you@gmail.com"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  seating4you@gmail.com
                </a>
                <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
                  •
                </span>
                <a
                  href="tel:+14178930047"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  (417) 893-0047
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
