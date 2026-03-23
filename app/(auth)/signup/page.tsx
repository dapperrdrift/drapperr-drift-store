"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup - will be replaced with actual auth
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
  ]

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

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-md text-foreground block mb-2">First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  required
                  className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="label-md text-foreground block mb-2">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  required
                  className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="label-md text-foreground block mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="label-md text-foreground block mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                required
                className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="label-md text-foreground block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-input rounded-md bg-transparent px-4 py-3 pr-12 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${req.met ? "text-green-600" : "text-muted-foreground"}`} />
                      <span className={`body-md ${req.met ? "text-green-600" : "text-muted-foreground"}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input 
                type="checkbox" 
                required 
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary" 
              />
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
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary">
        <div className="flex h-full w-full items-center justify-center p-12">
          <div className="max-w-md text-center">
            <p className="display-md text-primary-foreground text-balance">
              Curated for the Discerning
            </p>
            <p className="mt-6 body-lg text-primary-foreground/80">
              Join our community and be the first to discover new collections and exclusive offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
