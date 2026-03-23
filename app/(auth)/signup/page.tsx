"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup - will be replaced with actual auth
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="display-md text-foreground">
            DRAPPERR
          </Link>
          
          <h1 className="mt-8 headline-lg text-foreground">Create an account</h1>
          <p className="mt-2 body-lg text-muted-foreground">
            Join Drapperr Drift and discover curated fashion
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="First name"
                required
                className="w-full border-b border-input bg-transparent px-0 py-3 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Last name"
                required
                className="w-full border-b border-input bg-transparent px-0 py-3 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full border-b border-input bg-transparent px-0 py-3 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone number"
                required
                className="w-full border-b border-input bg-transparent px-0 py-3 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full border-b border-input bg-transparent px-0 py-3 pr-10 body-md placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <p className="body-md text-muted-foreground">
              Password must be at least 8 characters with one uppercase letter and one number.
            </p>

            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 h-4 w-4 border-border" />
              <span className="body-md text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 label-md bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center body-md text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-surface-container-low">
        <div className="flex h-full items-center justify-center p-12">
          <div className="max-w-md text-center">
            <p className="display-md text-foreground text-balance">
              Curated for the Discerning
            </p>
            <p className="mt-4 body-lg text-muted-foreground">
              Join our community and be the first to discover new collections and exclusive offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
