"use client"

import { useState, useEffect } from "react"
import { MapPin, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { updateUserAddress, type RegisterAddressModel } from "@/lib/api/user"
import { cn } from "@/lib/utils"

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Switzerland" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "KR", name: "South Korea" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "ZA", name: "South Africa" },
]

export default function AddressSection() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<RegisterAddressModel>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "US",
  })
  const [originalData, setOriginalData] = useState<RegisterAddressModel>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "US",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user?.address) {
      const addr: RegisterAddressModel = {
        addressLine1: (user.address as any)?.addressLine1 || "",
        addressLine2: (user.address as any)?.addressLine2 || "",
        city: (user.address as any)?.city || "",
        state: (user.address as any)?.state || "",
        zipcode: (user.address as any)?.zipcode || "",
        country: (user.address as any)?.country || "US",
      }
      setFormData(addr)
      setOriginalData(addr)
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const hasChanges = () => {
    return Object.keys(formData).some(
      key => formData[key as keyof RegisterAddressModel] !== originalData[key as keyof RegisterAddressModel]
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.addressLine1 || formData.addressLine1.length < 6) {
      newErrors.addressLine1 = "Address line 1 is required (min 6 characters)"
    }
    if (!formData.country || formData.country.length !== 2) {
      newErrors.country = "Country is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      const response = await updateUserAddress(formData)
      if (response.status === 200) {
        setIsEditing(false)
        setOriginalData(formData)
        toast.success("Address updated successfully!")
        await refreshUser()
      } else {
        toast.error(response.message || "Failed to update address")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update address")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
    setErrors({})
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Address</h2>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="w-full sm:w-auto text-sm font-medium"
          >
            {formData.addressLine1 ? "Edit Address" : "Add Address"}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Address Line 1 */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Address Line 1 *
          </label>
          <Input
            type="text"
            placeholder="Street address, P.O. box"
            value={formData.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
            disabled={!isEditing || isSaving}
            className={cn(
              "h-11 text-sm bg-background",
              errors.addressLine1 && "border-red-500",
              !isEditing && "cursor-not-allowed opacity-75"
            )}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.addressLine1}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Address Line 2
          </label>
          <Input
            type="text"
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={formData.addressLine2 || ""}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
            disabled={!isEditing || isSaving}
            className={cn("h-11 text-sm bg-background", !isEditing && "cursor-not-allowed opacity-75")}
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              City
            </label>
            <Input
              type="text"
              placeholder="City"
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              disabled={!isEditing || isSaving}
              className={cn("h-11 text-sm bg-background", !isEditing && "cursor-not-allowed opacity-75")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              State / Province
            </label>
            <Input
              type="text"
              placeholder="State or Province"
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              disabled={!isEditing || isSaving}
              className={cn("h-11 text-sm bg-background", !isEditing && "cursor-not-allowed opacity-75")}
            />
          </div>
        </div>

        {/* Zipcode and Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Zip / Postal Code
            </label>
            <Input
              type="text"
              placeholder="Zip or Postal Code"
              value={formData.zipcode || ""}
              onChange={(e) => handleChange("zipcode", e.target.value)}
              disabled={!isEditing || isSaving}
              className={cn("h-11 text-sm bg-background", !isEditing && "cursor-not-allowed opacity-75")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              disabled={!isEditing || isSaving}
              className={cn(
                "w-full h-11 px-3 text-sm rounded-md border bg-background",
                errors.country && "border-red-500",
                !isEditing && "cursor-not-allowed opacity-75"
              )}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            {errors.country && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges()}
            className="flex-1 sm:flex-none h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Address"
            )}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSaving}
            className="flex-1 sm:flex-none h-11 px-6"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
