/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Dark Theme Color System
        modern: {
          // Background colors
          bg: '#16171B',        // Very dark gray/black for app shell
          surface: '#282C2F',   // Medium-dark neutral gray for cards/sidebar
          border: '#33363A',    // Subtle dark lines for separation
          
          // Text colors
          text: {
            primary: '#FFFFFF',   // White for primary text
            secondary: '#B0B3B8', // Muted gray for secondary text/labels
            muted: '#6B7280',     // Even more muted for metadata
          },
          
          // Accent colors
          accent: '#F7CE45',      // Bold yellow for highlights/CTAs
          
          // Chart/Data visualization colors
          chart: {
            primary: '#F7CE45',   // Yellow for primary metrics
            positive: '#5EDC9A',  // Green for positive/growth indicators
            negative: '#E6506E',  // Red/Pink for negative/trend-down
          },
          
          // Modal/popup colors
          modal: '#2F3336',       // Slightly lighter gray for modals
        },
        
        // Status colors for reading list items
        status: {
          unread: '#B0B3B8',     // Muted gray
          reading: '#F7CE45',    // Yellow accent
          completed: '#5EDC9A',  // Green
          archived: '#8B5CF6',   // Purple
        },
        
        // Priority colors
        priority: {
          low: '#5EDC9A',        // Green
          medium: '#F7CE45',     // Yellow
          high: '#F97316',       // Orange
          urgent: '#E6506E',     // Red/Pink
        },
        
        // Legacy colors for backward compatibility
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Space Cadet theme colors
        'space-cadet': {
          primary: '#16274B',    // Space Cadet - deep navy blue
          secondary: '#305459',  // Dark Slate Gray - teal
          accent: '#EB7200',     // Safety Orange
          surface: '#F2E1B8',    // Dutch White - warm cream
          border: '#643743',     // Eggplant - muted purple
          text: {
            primary: '#16274B',
            secondary: '#305459',
            muted: '#643743',
          }
        },
        'onyx-theme': {
          primary: '#32373B',        // Onyx - dark gray
          secondary: '#4A5859',      // Outer Space - muted teal gray
          accent: '#C83E4D',         // Bittersweet Shimmer - strong red-pink
          surface: '#F4D6CC',        // Pale Dogwood - soft pink beige
          border: '#F4B860',         // Hunyadi Yellow - warm golden
          text: {
            primary: '#32373B',      // Onyx
            secondary: '#4A5859',    // Outer Space
            muted: '#C83E4D',        // Bittersweet Shimmer
          }
        },
        // UI colors for light mode - matching reference
        ui: {
          bg: '#f1f5f9',      // Light blue-gray background
          surface: '#ffffff',  // White cards
          border: '#e2e8f0',   // Light border
          sidebar: '#64748b',  // Blue-gray sidebar from reference
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            muted: '#64748b',
          }
        },
        // UI colors for dark mode
        'ui-dark': {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          sidebar: '#1e293b',
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.4), 0 2px 6px 0 rgba(0, 0, 0, 0.3)',
        'sidebar': '0 0 20px 0 rgba(0, 0, 0, 0.4)',
        'modal': '0 10px 25px 0 rgba(0, 0, 0, 0.5), 0 4px 10px 0 rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};
