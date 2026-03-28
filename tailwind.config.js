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
        // Rainbow-themed primary colors - Based on Rehamer Paint Logo
        primaryClr: "#7E14FF",         // Purple from logo - vibrant and modern
        primaryClrLight: "#9333EA",    // Lighter purple for hover states
        primaryClrDark: "#6B21A8",     // Darker purple for emphasis
        primaryClrText: '#FFFFFF',        // Crisp white text on primary
        place: "#94A3B8",              // Soft gray for placeholder text

        // Background colors - Clean and modern
        backgroundClr: "#FEFEFE",       // Pure white background
        bgDark: "#1A1A2E",            // Deep purple-dark for contrast
        bgDarkAll: "#0F0F23",          // Very dark purple for emphasis
        bgLight: "#FFFFFF",             // Pure white for cards
        
        // Rainbow gradient colors - From logo spectrum
        rainbowRed: "#FF0000",          // Bright red
        rainbowOrange: "#FF7F00",       // Vibrant orange
        rainbowYellow: "#FFFF00",        // Bright yellow
        rainbowGreen: "#00FF00",        // Fresh green
        rainbowBlue: "#0000FF",         // Pure blue
        rainbowIndigo: "#4B0082",       // Deep indigo
        rainbowViolet: "#9400D3",       // Rich violet

        // Paint-themed gradient colors
        paintGradient: {
          start: "#FF6B6B",          // Coral red
          middle: "#4ECDC4",          // Mint green
          end: "#45B7D1"              // Sky blue
        },

        // Secondary accent - Complementary colors
        secondaryClr: "#FF6B6B",        // Coral red - warm and inviting
        secondaryClrDark: "#E55555",    // Darker coral for hover/active

        // Success/confirmation - Fresh colors
        accentClr: "#4ECDC4",          // Mint green - fresh success
        accentClrDark: "#3BA99C",      // Darker mint for hover
        
        // Danger/Error - Clear warning colors
        dangerClr: "#FF6B6B",          // Coral red for attention
        dangerClrDark: "#E55555",      // Darker coral for hover
        
        // Logo-inspired accent colors
        logoGold: "#FFD700",           // Bright gold
        logoBorder: "#FFA500",          // Orange border for highlights

        // Status colors - Rainbow-themed palette
        status: {
          pending: "#FFD700",          // Gold - waiting
          progress: "#00BFFF",          // Deep sky blue - working
          ready: "#32CD32",            // Lime green - completed
          paid: "#FF69B4",             // Hot pink - payment received
          danger: "#FF4500"             // Orange red - urgent
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

