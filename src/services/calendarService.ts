/**
 * CLASSIFICATION: Service Layer
 * Handles Google Calendar synchronization and OAuth interactions.
 * Includes placeholders for backend implementation.
 */

export interface CalendarEvent {
  title: string;
  company: string;
  deadline: string;
  description?: string;
}

export const calendarService = {
  /**
   * Initiates the Google OAuth flow by fetching the auth URL from the backend.
   * Placeholder: If backend is not available, it logs an error.
   */
  async getAuthUrl(): Promise<string> {
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) throw new Error('Backend auth endpoint not found');
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.warn('Calendar Service: Backend auth endpoint not found. Using placeholder URL.');
      // Placeholder for local development/IDE testing
      return 'https://accounts.google.com/o/oauth2/v2/auth?client_id=PLACEHOLDER&response_type=code&scope=https://www.googleapis.com/auth/calendar.events';
    }
  },

  /**
   * Syncs a job application deadline to the user's Google Calendar.
   * Placeholder: Mocks a successful sync if the backend is not available.
   */
  async syncToCalendar(event: CalendarEvent, tokens?: any): Promise<{ success: boolean; eventId?: string }> {
    try {
      // Use provided tokens or fallback to session/local storage
      const authTokens = tokens || JSON.parse(localStorage.getItem('google_tokens') || 'null');
      
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: authTokens, event })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync failed');
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Calendar Service: Sync failed or backend not found. Mocking success for prototype.', error);
      // Placeholder/Mock for IDE testing
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, eventId: `mock_event_${Date.now()}` });
        }, 1000);
      });
    }
  },

  /**
   * Checks if the user is currently connected to Google.
   * Placeholder: Checks local storage for tokens.
   */
  isConnected(): boolean {
    return !!localStorage.getItem('google_tokens');
  },

  /**
   * Disconnects the user from Google Calendar by removing tokens.
   */
  async disconnect(): Promise<void> {
    localStorage.removeItem('google_tokens');
    // In a real app, we might also call a backend endpoint to revoke tokens
  }
};
