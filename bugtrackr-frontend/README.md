# BugTrackr Frontend

Modern React-based frontend for the BugTrackr application with beautiful UI and responsive design.

## Features

- ✨ **Modern UI**: Clean, responsive design with Tailwind CSS
- 🐛 **Bug Management**: Create, read, update, and delete bug reports
- 🎯 **Status Tracking**: Visual status indicators (Open, In Progress, Resolved)
- 🔍 **Filtering**: Filter bugs by status with real-time counts
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Real-time Updates**: Instant UI updates with optimistic rendering
- 🎨 **Visual Feedback**: Loading states, error handling, and animations

## Technology Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Heroicons** - Beautiful SVG icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- BugTrackr Backend running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Backend Connection

Make sure the Flask backend is running on http://localhost:5000 before using the frontend. The API base URL can be modified in `src/api.js`.

## Project Structure

```
src/
├── components/
│   ├── BugForm.jsx      # Create new bug reports
│   ├── BugList.jsx      # Display list of bugs with filtering
│   └── BugCard.jsx      # Individual bug display with actions
├── api.js               # API layer for backend communication
├── App.js               # Main application component
├── index.js             # React app entry point
└── index.css            # Global styles with Tailwind CSS
```

## Components

### BugForm
- Form to create new bug reports
- Real-time validation
- Severity selection with color coding
- Loading states during submission

### BugList  
- Displays all bug reports in a responsive grid
- Status-based filtering with counts
- Empty states and loading indicators
- Search and filter functionality

### BugCard
- Individual bug display
- Inline status updates
- Delete functionality with confirmation
- Responsive design with hover effects

## Styling

The application uses Tailwind CSS for styling with:
- Custom color schemes for different severity levels
- Responsive breakpoints for mobile/desktop layouts
- Smooth transitions and hover effects
- Accessible focus states

## API Integration

All API calls are handled through the `api.js` module:
- `fetchBugs()` - Get all bugs
- `createBug(data)` - Create a new bug
- `updateBug(id, data)` - Update bug status/details
- `deleteBug(id)` - Delete a bug

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Future Enhancements

- 🔐 User authentication and authorization
- 📄 Pagination for large datasets
- 🔍 Advanced search and filtering
- 📊 Dashboard with analytics
- 📁 File attachments for bug reports
- 🏷️ Tags and labels system
