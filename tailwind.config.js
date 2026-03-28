/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Professional Paint Factory Theme
        primaryClr: "#2C3E50",       // Deep blue-gray - professional, trustworthy
        primaryClrLight: "#34495E",  // Lighter blue-gray for hover states
        primaryClrDark: "#1A252F",   // Darker blue-gray for emphasis
        primaryClrText: '#FFFFFF',    // Crisp white text on primary
        place: "#7F8C8D",           // Muted gray for placeholder text

        // Background colors - Clean, professional
        backgroundClr: "#F8F9FA",    // Very light gray - clean canvas feel
        bgDark: "#2C3E50",          // Match primary for consistency
        bgDarkAll: "#1A252F",        // Match primary dark
        bgLight: "#FFFFFF",           // Pure white for cards
        
        // Secondary accent - Warm paint colors
        secondaryClr: "#E67E22",     // Warm orange - paint bucket color
        secondaryClrDark: "#D35400",  // Darker orange for hover/active

        // Success/confirmation - Professional green
        accentClr: "#27AE60",        // Professional green for success
        accentClrDark: "#229954",    // Darker green for hover
        
        // Danger/Error - Professional red
        dangerClr: "#E74C3C",        // Professional red for errors
        dangerClrDark: "#C0392B",    // Darker red for hover
        
        // Paint-themed accent colors
        logoGold: "#F39C12",         // Golden yellow - paint highlight
        logoBorder: "#F1C40F",       // Bright gold for borders/highlights

        // Status colors - Professional palette
        status: {
          pending: "#F39C12",        // Orange - work in progress
          progress: "#3498DB",       // Blue - actively working
          ready: "#27AE60",          // Green - completed
          paid: "#2ECC71",          // Lighter green - payment received
          danger: "#E74C3C"          // Red - issues/urgent
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 12px rgba(116, 40, 204, 0.08)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        'h1, h2, h3, h4, h5': {
          'letter-spacing': '0.25em',
          'textTransform': 'capitalize',
        },
      })
    })
  ]
}

