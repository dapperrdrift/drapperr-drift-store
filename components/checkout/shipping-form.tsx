"use client"

import { useState } from "react"
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

  const inputClasses = (field: keyof ShippingAddress) =>
    `w-full border-b bg-transparent px-0 py-3 body-md placeholder:text-muted-foreground focus:outline-none transition-colors ${
      errors[field] ? "border-destructive" : "border-input focus:border-foreground"
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="headline-md text-foreground">Shipping Address</h2>

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
        <textarea
          placeholder="Full Address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={3}
          className={`${inputClasses("address")} resize-none border rounded-none border-input p-3`}
        />
        {errors.address && (
          <p className="mt-1 body-md text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <input
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
          <select
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
        <div>
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            maxLength={6}
            className={inputClasses("pincode")}
          />
          {errors.pincode && (
            <p className="mt-1 body-md text-destructive">{errors.pincode}</p>
          )}
        </div>
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
