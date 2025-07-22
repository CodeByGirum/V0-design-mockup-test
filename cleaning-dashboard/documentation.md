# Cleaning Dashboard Documentation

## Overview

The Cleaning Dashboard is a comprehensive UI toolkit for data cleaning operations. It provides an interactive interface for identifying and resolving data quality issues, with integrated chat assistance. The dashboard is built with React, TypeScript, and Tailwind CSS, following a component-based architecture for maximum maintainability and reusability.

## Folder Structure

\`\`\`
cleaning-dashboard/
├── components/              # UI components
│   ├── chat-input.tsx       # Input field for chat messages
│   ├── chat-panel.tsx       # Chat interface component
│   ├── chat-panel-container.tsx # Container for positioning chat panel
│   ├── cleaning-actions.tsx # Action buttons for data cleaning
│   ├── context-input.tsx    # Input for adding context to chat
│   ├── dashboard-footer.tsx # Footer component
│   ├── dashboard-header.tsx # Header component
│   ├── dashboard-sidebar.tsx # Sidebar with datasets and legend
│   ├── data-table.tsx       # Table for displaying and interacting with data
│   └── dock-indicators.tsx  # Visual indicators for docking positions
├── data/                    # Data-related files
│   └── sample-data.ts       # Sample dataset for demonstration
├── documentation.md         # This documentation file
├── index.tsx                # Main entry point component
├── page.tsx                 # Example usage page
└── types.ts                 # Type definitions
\`\`\`

## Core Components

### 1. CleaningDashboard (`index.tsx`)

**Purpose:** Main entry point that orchestrates all dashboard components.

**Key Features:**
- Manages global state for the entire dashboard
- Handles chat panel positioning and resizing
- Coordinates interactions between components
- Manages cleaning actions and their effects

**State Management:**
- `showChat`: Controls chat panel visibility
- `selectedRows`: Tracks selected rows in the data table
- `entriesPerPage`: Controls pagination
- `sidebarCollapsed`: Tracks sidebar collapse state
- `chatWidth/chatHeight`: Manages chat panel dimensions
- `dockPosition`: Controls chat panel docking position
- `messages`: Stores chat conversation history

**Key Functions:**
- `handleCleaningAction`: Processes cleaning actions and updates chat
- `showDockIndicator`: Shows visual cues for docking positions

**Usage:**
\`\`\`tsx
import { CleaningDashboard } from './cleaning-dashboard'

export default function MyPage() {
  return <CleaningDashboard />
}
\`\`\`

### 2. DataTable (`components/data-table.tsx`)

**Purpose:** Displays and enables interaction with tabular data.

**Key Features:**
- Sortable columns
- Row selection
- Pagination
- Visual highlighting of data issues
- Toolbar with actions

**Props:**
\`\`\`typescript
interface DataTableProps {
  data: DataRow[]                           // Data to display
  selectedRows: number[]                    // Currently selected row IDs
  setSelectedRows: (rows: number[]) => void // Update selected rows
  entriesPerPage: number                    // Items per page
  setEntriesPerPage: (entries: number) => void // Update pagination
  showChat: boolean                         // Chat visibility state
  setShowChat: (show: boolean) => void      // Toggle chat visibility
  sidebarCollapsed: boolean                 // Sidebar collapse state
  setSidebarCollapsed: (collapsed: boolean) => void // Toggle sidebar
}
\`\`\`

**Key Functions:**
- `getCellClass`: Determines styling based on data issues
- `getRowClass`: Determines row styling based on issues

### 3. CleaningActions (`components/cleaning-actions.tsx`)

**Purpose:** Displays action buttons for data cleaning operations.

**Key Features:**
- Animated action buttons
- Handles click events for cleaning operations
- Scrollable container for many actions

**Props:**
\`\`\`typescript
interface CleaningActionsProps {
  onActionClick: (actionId: string, actionLabel: string) => void // Handle action clicks
}
\`\`\`

**Data Structure:**
\`\`\`typescript
type CleaningAction = {
  id: string        // Unique identifier
  label: string     // Display text
  icon: ReactNode   // Button icon
}
\`\`\`

### 4. DashboardSidebar (`components/dashboard-sidebar.tsx`)

**Purpose:** Provides navigation, dataset selection, and issue summary.

**Key Features:**
- Collapsible design
- Dataset selection
- Issue categorization and counts
- Legend for issue types

**Props:**
\`\`\`typescript
interface DashboardSidebarProps {
  sidebarCollapsed: boolean                      // Sidebar collapse state
  setSidebarCollapsed: (collapsed: boolean) => void // Toggle sidebar
  issueCount: IssueCount                         // Count of each issue type
}
\`\`\`

**Sub-components:**
- `DashboardSidebar.ToggleButton`: Button to expand collapsed sidebar

### 5. ChatPanel (`components/chat-panel.tsx`)

**Purpose:** Displays chat interface for AI assistance.

**Key Features:**
- Message display
- Input field
- Context addition
- Docking position controls
- Resize handle

**Props:**
\`\`\`typescript
interface ChatPanelProps {
  onClose: () => void                      // Close chat panel
  onDockChange: (position: DockPosition) => void // Change dock position
  dockPosition: DockPosition               // Current dock position
  chatRef: React.RefObject<HTMLDivElement> // Reference to chat container
  chatHeaderRef: React.RefObject<HTMLDivElement> // Reference to chat header
  resizeHandleRef: React.RefObject<HTMLDivElement> // Reference to resize handle
  messages: Message[]                      // Chat messages
  setMessages: React.Dispatch<React.SetStateAction<Message[]>> // Update messages
}
\`\`\`

**Key Functions:**
- `handleSendMessage`: Processes new user messages
- `handleAddContext`: Adds context to the conversation

### 6. ChatPanelContainer (`components/chat-panel-container.tsx`)

**Purpose:** Container for the chat panel with positioning and animation.

**Key Features:**
- Handles positioning based on dock position
- Manages animations for transitions
- Controls dimensions

**Props:**
\`\`\`typescript
interface ChatPanelContainerProps {
  show: boolean                            // Visibility state
  dockPosition: DockPosition               // Current dock position
  width?: number                           // Panel width
  height?: number                          // Panel height
  chatRef: React.RefObject<HTMLDivElement> // Reference to chat container
  chatHeaderRef: React.RefObject<HTMLDivElement> // Reference to chat header
  resizeHandleRef: React.RefObject<HTMLDivElement> // Reference to resize handle
  onClose: () => void                      // Close chat panel
  onDockChange: (position: DockPosition) => void // Change dock position
  messages: Message[]                      // Chat messages
  setMessages: React.Dispatch<React.SetStateAction<Message[]>> // Update messages
}
\`\`\`

### 7. ChatInput (`components/chat-input.tsx`)

**Purpose:** Input field for sending chat messages.

**Key Features:**
- Auto-resizing textarea
- File attachment button
- Send button
- Keyboard shortcuts

**Props:**
\`\`\`typescript
interface ChatInputProps {
  onSendMessage: (message: string) => void // Handle message submission
  className?: string                       // Optional CSS class
}
\`\`\`

**Key Functions:**
- `handleSendMessage`: Processes and sends messages
- `handleKeyDown`: Handles keyboard shortcuts (Enter to send)

### 8. ContextInput (`components/context-input.tsx`)

**Purpose:** Input field for adding context to the chat.

**Key Features:**
- Expandable input field
- Keyboard shortcuts
- Minimalist design

**Props:**
\`\`\`typescript
interface ContextInputProps {
  onAddContext: (context: string) => void  // Handle context addition
  className?: string                       // Optional CSS class
}
\`\`\`

**Key Functions:**
- `handleAddContext`: Processes and adds context

### 9. DockIndicators (`components/dock-indicators.tsx`)

**Purpose:** Visual indicators for docking positions during drag operations.

**Key Features:**
- Highlights potential docking areas
- Animated transitions
- Visual feedback during dragging

**Props:**
\`\`\`typescript
interface DockIndicatorsProps {
  isDragging: boolean                      // Whether dragging is active
  dockIndicator: DockPosition | null       // Current indicator to show
}
\`\`\`

### 10. DashboardHeader (`components/dashboard-header.tsx`)

**Purpose:** Main header for the cleaning dashboard.

**Key Features:**
- Logo display
- Navigation links
- User information

**Props:**
\`\`\`typescript
interface DashboardHeaderProps {
  sidebarCollapsed?: boolean               // Sidebar collapse state
}
\`\`\`

### 11. DashboardFooter (`components/dashboard-footer.tsx`)

**Purpose:** Footer for the cleaning dashboard.

**Key Features:**
- Copyright information
- Links to terms, privacy, help

## Type Definitions (`types.ts`)

The `types.ts` file contains centralized type definitions used throughout the dashboard:

\`\`\`typescript
// Possible docking positions for the chat panel
export type DockPosition = "right" | "left" | "bottom" | "none"

// Chat message structure
export type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

// Data row structure for the table
export type DataRow = {
  id: number
  name: string
  age: number | null
  salary: number | null
  email: string
  joinDate: string
  category: string | null
  score: number
  rating: number
  originalRowIndex: number
  issues: string[]
}

// Issue count structure for the sidebar
export type IssueCount = {
  null_value: number
  invalid_format: number
  invalid_date: number
  duplicate_value: number
  negative_rating: number
}

// Cleaning action structure
export type CleaningAction = {
  id: string
  label: string
  icon: React.ReactNode
}
\`\`\`

## Sample Data (`data/sample-data.ts`)

The `sample-data.ts` file provides a realistic dataset with various data quality issues for demonstration purposes. Each row includes:

- Basic information (name, age, salary, etc.)
- An `issues` array that identifies quality problems
- An `originalRowIndex` to track the original position

## Integration and Usage

### Basic Usage

\`\`\`tsx
import { CleaningDashboard } from './cleaning-dashboard'

export default function DataCleaningPage() {
  return <CleaningDashboard />
}
\`\`\`

### Custom Integration

The dashboard can be customized by modifying the individual components or by providing custom props to the main component.

## State Management

The dashboard uses React's useState hook for state management. Key state variables include:

- **UI State:**
  - `showChat`: Controls chat panel visibility
  - `sidebarCollapsed`: Controls sidebar visibility
  - `dockPosition`: Controls chat panel position
  - `chatWidth/chatHeight`: Controls chat panel dimensions

- **Data State:**
  - `selectedRows`: Tracks selected rows in the table
  - `entriesPerPage`: Controls pagination
  - `messages`: Stores chat conversation

## Interaction Flow

1. **Cleaning Action Flow:**
   - User clicks a cleaning action button
   - `handleCleaningAction` is called with action ID and label
   - A user message is added to the chat
   - After a delay, an assistant response is added
   - If chat is hidden, it becomes visible

2. **Chat Interaction Flow:**
   - User types a message in the chat input
   - Message is sent via `handleSendMessage`
   - Message appears in the chat panel
   - Assistant responds after a delay

3. **Docking Flow:**
   - User drags chat panel header
   - As panel approaches screen edges, dock indicators appear
   - On release near an edge, panel docks to that position

## Styling and Animations

The dashboard uses:
- Tailwind CSS for styling
- Framer Motion for animations
- Custom CSS classes for transitions

## Accessibility Features

- Keyboard navigation support
- Screen reader friendly structure
- Focus management
- Semantic HTML elements

## Performance Considerations

- Component memoization where appropriate
- Efficient state updates
- Optimized rendering cycles

## Future Enhancements

Potential areas for enhancement include:
- Data filtering and sorting
- Export functionality
- Undo/redo capabilities
- Data visualization components
- Advanced AI integration
- User preferences storage
