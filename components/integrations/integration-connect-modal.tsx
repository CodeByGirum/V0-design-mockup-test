/**
 * Purpose: Modal for connecting or editing an integration instance. Monochromatic design.
 * Features: Dynamically renders form fields based on integration type.
 * Used in: app/integrations/page.tsx
 */
"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle } from "lucide-react"
import type { IntegrationTemplate, ConnectedIntegrationInstance } from "@/app/integrations/page"

interface IntegrationConnectModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  template: IntegrationTemplate | null
  instanceToEdit?: ConnectedIntegrationInstance | null
  onConnect: (
    details: Omit<ConnectedIntegrationInstance, "instanceId" | "status" | "lastSync"> & { instanceId?: string },
  ) => Promise<void>
}

export function IntegrationConnectModal({
  isOpen,
  onOpenChange,
  template,
  instanceToEdit,
  onConnect,
}: IntegrationConnectModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (instanceToEdit && template) {
        setFormData({
          displayName: instanceToEdit.displayName,
          ...(instanceToEdit.config || {}),
        })
      } else if (template) {
        setFormData({ displayName: template.name })
      } else {
        setFormData({})
      }
      setError(null)
      setIsLoading(false)
    }
  }, [instanceToEdit, template, isOpen])

  if (!template) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.displayName || formData.displayName.trim() === "") {
      setError("Display Name is required.")
      setIsLoading(false)
      return
    }

    try {
      const submissionData: Omit<ConnectedIntegrationInstance, "instanceId" | "status" | "lastSync"> & {
        instanceId?: string
      } = {
        templateId: template.id,
        displayName: formData.displayName,
        config: { ...formData },
      }
      delete submissionData.config?.displayName

      if (instanceToEdit) {
        submissionData.instanceId = instanceToEdit.instanceId
      }

      await onConnect(submissionData)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to connect. Please check your details and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClassName =
    "bg-[#252525] border-[#383838] focus:border-gray-500 focus:ring-gray-500/50 rounded-md text-sm text-gray-200 placeholder:text-gray-500"
  const labelClassName = "text-xs font-medium text-gray-400"

  const renderFormFields = () => {
    // Form field rendering logic remains largely the same, but styling is applied via inputClassName/labelClassName
    // For brevity, I'll show one example and assume others follow suit.
    switch (template.connectionType) {
      case "oauth":
        return (
          <div className="text-center p-6 bg-[#222222] rounded-lg border border-[#333333]">
            <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-700/50 text-gray-400">
              {template.icon}
            </div>
            <p className="text-sm text-gray-300 mb-4">
              To connect with {template.name}, you'll be redirected to their platform to authorize access.
            </p>
            <Button
              onClick={() => alert(`Simulating OAuth for ${template.name}...`)}
              className="w-full bg-gray-600 hover:bg-gray-500 text-gray-100 text-sm py-2"
            >
              Authorize with {template.name}
            </Button>
          </div>
        )
      case "credentials":
        return (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="host" className={labelClassName}>
                Host URL
              </Label>
              <Input
                id="host"
                name="host"
                value={formData.host || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="e.g., mydb.example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="port" className={labelClassName}>
                  Port
                </Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  value={formData.port || ""}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="5432"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dbName" className={labelClassName}>
                  Database Name
                </Label>
                <Input
                  id="dbName"
                  name="dbName"
                  value={formData.dbName || ""}
                  onChange={handleInputChange}
                  className={inputClassName}
                  placeholder="production_db"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className={labelClassName}>
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="db_user"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className={labelClassName}>
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="••••••••"
              />
            </div>
          </>
        )
      case "s3":
        return (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="bucketName" className={labelClassName}>
                Bucket Name
              </Label>
              <Input
                id="bucketName"
                name="bucketName"
                value={formData.bucketName || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="my-s3-bucket-name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accessKeyId" className={labelClassName}>
                Access Key ID
              </Label>
              <Input
                id="accessKeyId"
                name="accessKeyId"
                value={formData.accessKeyId || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="AKIAIOSFODNN7EXAMPLE"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="secretAccessKey" className={labelClassName}>
                Secret Access Key
              </Label>
              <Input
                id="secretAccessKey"
                name="secretAccessKey"
                type="password"
                value={formData.secretAccessKey || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="••••••••••••••••••••••••••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="region" className={labelClassName}>
                Region
              </Label>
              <Input
                id="region"
                name="region"
                value={formData.region || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="e.g., us-east-1"
              />
            </div>
          </>
        )
      case "apikey":
        return (
          <div className="space-y-1.5">
            <Label htmlFor="apiKey" className={labelClassName}>
              API Key
            </Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              value={formData.apiKey || ""}
              onChange={handleInputChange}
              className={inputClassName}
              placeholder="sk_live_••••••••••••••••••••••••"
            />
          </div>
        )
      case "custom_api":
        return (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="baseUrl" className={labelClassName}>
                Base URL
              </Label>
              <Input
                id="baseUrl"
                name="baseUrl"
                value={formData.baseUrl || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="https://api.example.com/v1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headers" className={labelClassName}>
                Headers (JSON format)
              </Label>
              <Textarea
                id="headers"
                name="headers"
                value={formData.headers || ""}
                onChange={handleInputChange}
                placeholder={`{\n  "Authorization": "Bearer YOUR_TOKEN",\n  "X-Custom-Header": "value"\n}`}
                className={`${inputClassName} min-h-[100px]`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="authMethod" className={labelClassName}>
                Authentication Method (Optional)
              </Label>
              <Input
                id="authMethod"
                name="authMethod"
                value={formData.authMethod || ""}
                onChange={handleInputChange}
                className={inputClassName}
                placeholder="e.g., Bearer Token, API Key in Header"
              />
            </div>
          </>
        )
      default:
        return <p className="text-sm text-gray-400 py-4">Configuration form not available for this integration type.</p>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1c1c1c] border-[#2f2f2f] text-gray-300 sm:max-w-md shadow-xl rounded-lg">
        <DialogHeader className="pt-3 pb-4 border-b border-[#2f2f2f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md bg-[#2a2a2a]">
              {template.icon}
            </div>
            <div>
              <DialogTitle className="text-md font-medium text-gray-100">
                {instanceToEdit ? "Edit Connection" : "Connect to"} {template.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                {instanceToEdit
                  ? `Update settings for '${formData.displayName || instanceToEdit.displayName}'.`
                  : `Configure your new ${template.name} connection.`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className={labelClassName}>
              Display Name <span className="text-red-500/70">*</span>
            </Label>
            <Input
              id="displayName"
              name="displayName"
              value={formData.displayName || ""}
              onChange={handleInputChange}
              className={inputClassName}
              placeholder={`e.g., My ${template.name} Prod`}
              required
            />
          </div>

          {renderFormFields()}

          {error && (
            <div className="mt-2 p-2.5 bg-red-900/20 border border-red-700/30 rounded-md text-red-500/90 text-xs flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-px" />
              {error}
            </div>
          )}
        </form>
        <DialogFooter className="pt-4 border-t border-[#2f2f2f]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-400 hover:bg-[#2a2a2a] hover:border-gray-500 text-xs py-1.5 px-3"
            disabled={isLoading}
          >
            Cancel
          </Button>
          {template.connectionType !== "oauth" && (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs py-1.5 px-3"
            >
              {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              {instanceToEdit ? (isLoading ? "Saving..." : "Save Changes") : isLoading ? "Connecting..." : "Connect"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
