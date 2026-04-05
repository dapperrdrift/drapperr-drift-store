"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: `${firstName} ${lastName}`.trim(),
          phone,
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  const handleGoogleSignup = async () => {
    setError(null)
    setIsGoogleLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setError(error.message)
      setIsGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h1 className="headline-lg text-foreground">Check your email</h1>
          <p className="mt-4 body-lg text-muted-foreground">
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          <Link href="/login">
            <Button className="mt-8 bg-primary text-primary-foreground">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-2 -ml-2 w-fit px-2 text-muted-foreground hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <h1 className="mt-2 headline-lg text-foreground">Create an account</h1>
      <p className="mt-2 body-lg text-muted-foreground">
        Join Drapperr Drift and discover curated fashion
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
          <p className="body-md text-destructive">{error}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleSignup}
          className="w-full py-6 label-md"
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Connecting to Google...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Image
                src="/images/google-icon.png"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="h-4 w-4"
              />
              Continue with Google
            </span>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 body-md text-muted-foreground">Or continue with email</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-md text-foreground block mb-2">First Name</label>
            <input
              name="firstName"
              type="text"
              placeholder="Enter first name"
              required
              className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="label-md text-foreground block mb-2">Last Name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Enter last name"
              required
              className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-md text-foreground block mb-2">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="label-md text-foreground block mb-2">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full border border-input rounded-md bg-transparent px-4 py-3 body-md placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div>
            <label className="label-md text-foreground block mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>
        </div>

        {password && (
          <div className="space-y-1">
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className={`h-4 w-4 ${req.met ? "text-green-600" : "text-muted-foreground"}`} />
                <span className={`body-md ${req.met ? "text-green-600" : "text-muted-foreground"}`}>
                  {req.label}
                </span>
              </div>
            ))}
            {confirmPassword && password !== confirmPassword && (
              <p className="body-md text-destructive">Passwords do not match</p>
            )}
          </div>
        )}

        <label className="flex items-start gap-3 cursor-pointer pt-1">
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
          disabled={isLoading || isGoogleLoading}
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

      <p className="mt-4 text-center body-md text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
