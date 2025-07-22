/**
 * Purpose: Defines the data for available integrations.
 * Features: Categorized list of integrations with names, icons, and initial status.
 * Used in: app/integrations/page.tsx
 * Notes: Icons are a mix of Lucide icons and placeholder images for brand representation.
 */
import { Webhook, Share2 } from "lucide-react"
import type { ReactNode } from "react"

export interface Integration {
  name: string
  category: string
  icon: ReactNode
  description?: string
  status: "Connect" | "Connected" | "Configure"
}

export const integrationCategories = [
  "Spreadsheets & Files",
  "Cloud Storage",
  "Databases",
  "Data Warehouses",
  "Business Apps",
  "APIs & Automation",
] as const

export type IntegrationCategory = (typeof integrationCategories)[number]

export const integrations: Integration[] = [
  // Spreadsheets & Files
  {
    name: "Google Sheets",
    category: "Spreadsheets & Files",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=GS&bgColor=4285F4&textColor=ffffff"
        alt="Google Sheets"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect and sync data from Google Sheets.",
    status: "Connect",
  },
  {
    name: "Microsoft Excel (OneDrive)",
    category: "Spreadsheets & Files",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=XL&bgColor=217346&textColor=ffffff"
        alt="Microsoft Excel"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Link Excel files from your OneDrive.",
    status: "Connect",
  },
  {
    name: "Dropbox",
    category: "Spreadsheets & Files",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Db&bgColor=0061FF&textColor=ffffff"
        alt="Dropbox"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Access files stored in your Dropbox.",
    status: "Connect",
  },
  {
    name: "Box",
    category: "Spreadsheets & Files",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Bx&bgColor=005FED&textColor=ffffff"
        alt="Box"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Integrate with your Box cloud storage.",
    status: "Connect",
  },

  // Cloud Storage
  {
    name: "AWS S3",
    category: "Cloud Storage",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=S3&bgColor=FF9900&textColor=232F3E"
        alt="AWS S3"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect to your Amazon S3 buckets.",
    status: "Connect",
  },
  {
    name: "Google Cloud Storage (GCS)",
    category: "Cloud Storage",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=GCS&bgColor=4285F4&textColor=ffffff"
        alt="Google Cloud Storage"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Access data from Google Cloud Storage.",
    status: "Connect",
  },
  {
    name: "Azure Blob Storage",
    category: "Cloud Storage",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Az&bgColor=0078D4&textColor=ffffff"
        alt="Azure Blob Storage"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Integrate with Azure Blob Storage.",
    status: "Connect",
  },

  // Databases
  {
    name: "PostgreSQL",
    category: "Databases",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Pg&bgColor=336791&textColor=ffffff"
        alt="PostgreSQL"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect to your PostgreSQL databases.",
    status: "Connect",
  },
  {
    name: "MySQL",
    category: "Databases",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=My&bgColor=00758F&textColor=ffffff"
        alt="MySQL"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Link your MySQL databases.",
    status: "Connect",
  },
  {
    name: "MongoDB",
    category: "Databases",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Mg&bgColor=4DB33D&textColor=ffffff"
        alt="MongoDB"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect to MongoDB collections.",
    status: "Connect",
  },
  {
    name: "SQL Server",
    category: "Databases",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=SQL&bgColor=CC2927&textColor=ffffff"
        alt="SQL Server"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Integrate with Microsoft SQL Server.",
    status: "Connect",
  },

  // Data Warehouses
  {
    name: "Snowflake",
    category: "Data Warehouses",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Sf&bgColor=29B5E8&textColor=ffffff"
        alt="Snowflake"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect to your Snowflake data warehouse.",
    status: "Connect",
  },
  {
    name: "BigQuery",
    category: "Data Warehouses",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=BQ&bgColor=4285F4&textColor=ffffff"
        alt="BigQuery"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Integrate with Google BigQuery.",
    status: "Connect",
  },
  {
    name: "Databricks",
    category: "Data Warehouses",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Db&bgColor=FF3621&textColor=ffffff"
        alt="Databricks"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect to your Databricks lakehouse.",
    status: "Connect",
  },

  // Business Apps
  {
    name: "Salesforce",
    category: "Business Apps",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=SF&bgColor=00A1E0&textColor=ffffff"
        alt="Salesforce"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Sync data from your Salesforce org.",
    status: "Connect",
  },
  {
    name: "Stripe",
    category: "Business Apps",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=St&bgColor=6772E5&textColor=ffffff"
        alt="Stripe"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Connect to your Stripe account data.",
    status: "Connect",
  },
  {
    name: "QuickBooks",
    category: "Business Apps",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=QB&bgColor=2CA01C&textColor=ffffff"
        alt="QuickBooks"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Integrate with QuickBooks Online.",
    status: "Connect",
  },

  // APIs & Automation
  {
    name: "REST API",
    category: "APIs & Automation",
    icon: <Share2 className="w-8 h-8 text-sky-400" />,
    description: "Connect to any custom REST API.",
    status: "Connect",
  },
  {
    name: "Zapier",
    category: "APIs & Automation",
    icon: (
      <img
        src="/placeholder.svg?width=32&height=32&text=Zp&bgColor=FF4A00&textColor=ffffff"
        alt="Zapier"
        className="w-8 h-8 rounded"
      />
    ),
    description: "Automate workflows with Zapier.",
    status: "Connect",
  },
  {
    name: "Webhooks",
    category: "APIs & Automation",
    icon: <Webhook className="w-8 h-8 text-purple-400" />,
    description: "Receive data via webhooks.",
    status: "Connect",
  },
]
