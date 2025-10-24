import { useSearchParams } from 'react-router-dom';
import { DEMO_CALLS, DEMO_CHATBOT_HISTORY, DEMO_STATS } from '../data/demoData';

/**
 * Hook to detect and provide demo mode functionality
 * Demo mode is activated by adding ?demo=true to the URL
 *
 * @returns {Object} Demo mode state and data
 * @property {boolean} isDemoMode - Whether demo mode is active
 * @property {Array} demoCalls - Demo call data
 * @property {Array} demoChatHistory - Pre-populated chat history
 * @property {Object} demoStats - Dashboard statistics
 * @property {Function} getDemoCall - Get a specific demo call by ID
 */
export function useDemoMode() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === 'true';

  /**
   * Get a specific demo call by ID
   * @param {string} callId - The call ID to retrieve
   * @returns {Object|null} The demo call data or null if not found
   */
  const getDemoCall = (callId) => {
    // Allow getting demo calls even without ?demo=true if the ID starts with 'demo-'
    const isDemoCallId = callId && callId.startsWith('demo-');
    if (!isDemoMode && !isDemoCallId) return null;
    return DEMO_CALLS.find(call => call.callId === callId) || null;
  };

  return {
    isDemoMode,
    demoCalls: isDemoMode ? DEMO_CALLS : [],
    demoChatHistory: isDemoMode ? DEMO_CHATBOT_HISTORY : [],
    demoStats: isDemoMode ? DEMO_STATS : null,
    getDemoCall
  };
}
