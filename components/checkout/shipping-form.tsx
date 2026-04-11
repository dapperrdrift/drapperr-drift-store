"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void
  initialData?: Partial<ShippingAddress>
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
]

export function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
  })
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})
  const [isPincodeLoading, setIsPincodeLoading] = useState(false)
  const [pincodeNote, setPincodeNote] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Partial<ShippingAddress> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Invalid phone number"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  useEffect(() => {
    let ignore = false

    const lookupByPincode = async () => {
      if (!/^\d{6}$/.test(formData.pincode)) {
        setPincodeNote(null)
        return
      }

      setIsPincodeLoading(true)
      setPincodeNote(null)

      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        const data = await res.json()
        const first = data?.[0]

        if (!first || first.Status !== "Success" || !first.PostOffice?.length) {
          throw new Error("Could not find location for this pincode")
        }

        const office = first.PostOffice[0]
        const city = office.District || office.Block || ""
        const state = office.State || ""

        if (!ignore) {
          setFormData((prev) => ({
            ...prev,
            city,
            state,
          }))
          setPincodeNote("City and state auto-filled from pincode")
          setErrors((prev) => ({ ...prev, city: undefined, state: undefined, pincode: undefined }))
        }
      } catch {
        if (!ignore) {
          setPincodeNote("Unable to auto-fill. Please verify pincode or enter city/state manually.")
        }
      } finally {
        if (!ignore) {
          setIsPincodeLoading(false)
        }
      }
    }

    lookupByPincode()

    return () => {
      ignore = true
    }
  }, [formData.pincode])

  const inputClasses = (field: keyof ShippingAddress) =>
    `w-full rounded-md border bg-background px-3 py-3 body-md placeholder:text-muted-foreground focus:outline-none transition-colors ${
      errors[field] ? "border-destructive" : "border-input focus:border-foreground"
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-1 border-b border-border pb-4">
        <h2 className="headline-md text-foreground">Shipping Address</h2>
        <p className="body-md text-muted-foreground">Enter pincode first to auto-fill city and state.</p>
      </div>

      <div className="space-y-2">
        <label className="label-md text-foreground" htmlFor="pincode">Pincode</label>
        <input
          id="pincode"
          type="text"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          className={inputClasses("pincode")}
        />
        {isPincodeLoading && <p className="body-md text-muted-foreground">Fetching city and state...</p>}
        {!isPincodeLoading && pincodeNote && (
          <p className={`body-md ${pincodeNote.startsWith("City and state") ? "text-emerald-700" : "text-amber-700"}`}>
            {pincodeNote}
          </p>
        )}
        {errors.pincode && (
          <p className="body-md text-destructive">{errors.pincode}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-md text-foreground" htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={inputClasses("city")}
          />
          {errors.city && (
            <p className="mt-1 body-md text-destructive">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="label-md text-foreground" htmlFor="state">State</label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className={`${inputClasses("state")} cursor-pointer`}
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 body-md text-destructive">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={inputClasses("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1 body-md text-destructive">{errors.firstName}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={inputClasses("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1 body-md text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputClasses("email")}
          />
          {errors.email && (
            <p className="mt-1 body-md text-destructive">{errors.email}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={inputClasses("phone")}
          />
          {errors.phone && (
            <p className="mt-1 body-md text-destructive">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label-md text-foreground" htmlFor="address">Full Address</label>
        <textarea
          id="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={3}
          className={`${inputClasses("address")} resize-none`}
        />
        {errors.address && (
          <p className="mt-1 body-md text-destructive">{errors.address}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full py-6 label-md bg-primary text-primary-foreground hover:bg-primary-hover"
      >
        Continue to Payment
      </Button>
    </form>
  )
}
