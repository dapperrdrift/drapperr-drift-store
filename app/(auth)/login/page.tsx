"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login - will be replaced with actual auth
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
          
          <h1 className="mt-8 headline-lg text-foreground">Welcome back</h1>
          <p className="mt-2 body-lg text-muted-foreground">
            Sign in to your account to continue shopping
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email address"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 border-border" />
                <span className="body-md text-muted-foreground">Remember me</span>
              </label>
              <Link href="/reset-password" className="body-md text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 label-md bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center body-md text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-surface-container-low">
        <div className="flex h-full items-center justify-center p-12">
          <div className="max-w-md text-center">
            <p className="display-md text-foreground text-balance">
              Where Elegance Meets Edge
            </p>
            <p className="mt-4 body-lg text-muted-foreground">
              Join thousands of fashion-forward individuals who shop with Drapperr Drift.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
