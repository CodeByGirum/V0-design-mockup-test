/**
 * Purpose: Renders a section for a specific category of integrations.
 * Features: Displays a category title and a grid of IntegrationCards.
 * Used in: app/integrations/page.tsx
 * Notes: Uses a responsive grid layout for the cards.
 */
import type { Integration } from "@/lib/integrations-data"
import { IntegrationCard } from "./integration-card"

interface IntegrationCategorySectionProps {
  title: string
  integrations: Integration[]
}

export function IntegrationCategorySection({ title, integrations }: IntegrationCategorySectionProps) {
  // Function: handleConnect
  // Purpose: Placeholder function for when a connect button is clicked.
  // Inputs: integrationName (string) - the name of the integration being connected.
  // Outputs: None (logs to console for now).
  const handleConnect = (integrationName: string) => {
    console.log(`Attempting to connect to ${integrationName}`)
    // Actual connection logic would go here or be passed down
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-[#2a2a2a]">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.name}
            name={integration.name}
            icon={integration.icon}
            description={integration.description}
            initialStatus={integration.status}
            onConnect={() => handleConnect(integration.name)}
          />
        ))}
      </div>
    </section>
  )
}
