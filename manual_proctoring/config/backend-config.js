// ============================================================================
// Manual Proctoring Client Configuration
// Single-backend setup for the Electron manual proctoring client
// ============================================================================

const BACKEND_CONFIG = {
  // Legacy field retained for compatibility with older notes/scripts.
  mode: 'main',

  // Unified main backend URL.
  main: {
    apiBaseUrl: 'http://localhost:5000'
  },

  // Kept only to avoid breaking older imports; runtime uses the main backend.
  dummy: {
    apiBaseUrl: 'http://localhost:5000'
  }
};

// Export the appropriate configuration
const APP_CONFIG = BACKEND_CONFIG.mode === 'main'
  ? BACKEND_CONFIG.main
  : BACKEND_CONFIG.dummy;

console.log(`Manual Proctoring Client using ${BACKEND_CONFIG.mode.toUpperCase()} backend:`, APP_CONFIG.apiBaseUrl);

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_CONFIG, BACKEND_CONFIG };
}
