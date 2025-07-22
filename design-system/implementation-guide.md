# Sweepo Design System Implementation Guide

## Quick Start for New Pages

### 1. Basic Page Structure
\`\`\`jsx
<div className="min-h-screen bg-[#121212] text-white">
  <header className="border-b border-[#2a2a2a] px-8 py-4">
    {/* Header content */}
  </header>
  
  <main className="flex-1">
    {/* Main content */}
  </main>
  
  <footer className="border-t border-[#2a2a2a] py-3 px-8">
    {/* Footer content */}
  </footer>
</div>
\`\`\`

### 2. Typography Hierarchy
\`\`\`jsx
{/* Page Title */}
<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
  Page Title
</h1>

{/* Section Heading */}
<h2 className="text-2xl font-semibold text-gray-100 mb-4">
  Section Title
</h2>

{/* Subsection */}
<h3 className="text-xl font-medium text-gray-400 mb-3">
  Subsection
</h3>

{/* Body Text */}
<p className="text-gray-300 text-sm leading-relaxed">
  Body content goes here
</p>

{/* Caption/Metadata */}
<span className="text-xs text-gray-500">
  Supporting information
</span>
\`\`\`

### 3. Card Components
\`\`\`jsx
{/* Basic Card */}
<div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 shadow-lg">
  <h3 className="text-base font-semibold text-gray-100 mb-2">Card Title</h3>
  <p className="text-xs text-gray-400">Card description</p>
</div>

{/* Interactive Card */}
<div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 shadow-lg hover:border-[#3a3a3a] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
  <h3 className="text-base font-semibold text-gray-100 mb-2">Interactive Card</h3>
  <p className="text-xs text-gray-400">Hover to see effect</p>
</div>
\`\`\`

### 4. Form Elements
\`\`\`jsx
{/* Input Field */}
<div className="space-y-1.5">
  <label className="text-xs font-medium text-gray-400">Field Label</label>
  <input 
    type="text"
    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-2.5 px-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder:text-gray-500"
    placeholder="Enter value..."
  />
</div>

{/* Button */}
<button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200 text-sm font-medium py-2 px-4 rounded-md transition-colors">
  Action Button
</button>
\`\`\`

### 5. Data Quality Indicators
\`\`\`jsx
{/* Null Value */}
<span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
  null
</span>

{/* Invalid Format */}
<span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
  invalid_email
</span>

{/* Error State */}
<span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
  error
</span>
\`\`\`

### 6. Status Indicators
\`\`\`jsx
{/* Success */}
<div className="flex items-center gap-2 text-green-400 text-xs">
  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
  Connected
</div>

{/* Error */}
<div className="flex items-center gap-2 text-red-400 text-xs">
  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
  Error
</div>

{/* Pending */}
<div className="flex items-center gap-2 text-yellow-400 text-xs">
  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
  Pending
</div>
\`\`\`

## Color Reference for Tailwind Classes

### Backgrounds
- `bg-[#121212]` - Page background
- `bg-[#1a1a1a]` - Elevated surfaces (cards, panels)
- `bg-[#1c1c1c]` - Modals, secondary surfaces
- `bg-[#2a2a2a]` - Interactive elements, borders
- `bg-[#3a3a3a]` - Hover states

### Text Colors
- `text-white` - Primary headings, critical info
- `text-gray-100` - Secondary headings
- `text-gray-300` - Body text
- `text-gray-400` - Supporting text, labels
- `text-gray-500` - Metadata, placeholders

### Borders
- `border-[#2a2a2a]` - Default borders
- `border-[#3a3a3a]` - Hover borders
- `border-[#4a4a4a]` - Active/focus borders

### Data Quality Colors
- `bg-blue-500/20 text-blue-300` - Null values
- `bg-purple-500/20 text-purple-300` - Invalid formats
- `bg-orange-500/20 text-orange-300` - Invalid dates
- `bg-green-500/20 text-green-300` - Duplicates
- `bg-red-500/20 text-red-300` - Critical errors

## Animation Classes

### Standard Transitions
\`\`\`css
transition-all duration-300 ease-in-out
transition-colors duration-300
transition-transform duration-300
\`\`\`

### Custom Animations (add to your CSS)
\`\`\`css
.slide-in-bottom { animation: slideInBottom 0.3s ease-in-out; }
.slide-in-right { animation: slideInRight 0.3s ease-in-out; }
.slide-in-left { animation: slideInLeft 0.3s ease-in-out; }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
\`\`\`

## Best Practices

1. **Consistency**: Always use the established color palette
2. **Hierarchy**: Follow the typography scale for proper information hierarchy
3. **Spacing**: Use Tailwind's spacing scale (p-3, p-4, gap-2, etc.)
4. **Interactions**: Include hover states for interactive elements
5. **Accessibility**: Maintain proper contrast ratios and focus states
6. **Performance**: Use CSS custom properties for frequently used values

This system ensures visual consistency across all Sweepo interfaces while maintaining the professional, data-focused aesthetic.
