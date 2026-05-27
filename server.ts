import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import cookieSession from "cookie-session";
import path from "path";
import { initializeCareerDatabaseSheet } from "./services/sheetsService";
import { createDocumentFromTemplate } from "./services/docsService";
import { searchDriveForResumes, getDriveFileContent } from "./services/driveService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'career-copilot-secret'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    sameSite: 'none'
  }));

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.APP_URL}/api/auth/google/callback`
  );

    // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/sheets/init", async (req, res) => {
    const { tokens, title } = req.body;
    const authTokens = tokens || (req as any).session.tokens;
    
    if (!authTokens) return res.status(401).json({ error: "Not authenticated" });
    oauth2Client.setCredentials(authTokens);
    
    try {
      const spreadsheetId = await initializeCareerDatabaseSheet(oauth2Client, title);
      res.json({ spreadsheetId });
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize sheet" });
    }
  });

  app.post("/api/docs/create", async (req, res) => {
    const { tokens, title, content } = req.body;
    const authTokens = tokens || (req as any).session.tokens;
    
    if (!authTokens) return res.status(401).json({ error: "Not authenticated" });
    oauth2Client.setCredentials(authTokens);
    
    try {
      const documentId = await createDocumentFromTemplate(oauth2Client, title, content);
      res.json({ documentId });
    } catch (error) {
      res.status(500).json({ error: "Failed to create doc" });
    }
  });

  app.get("/api/drive/resumes", async (req, res) => {
    const authTokens = (req as any).session.tokens;
    if (!authTokens) return res.status(401).json({ error: "Not authenticated" });
    
    oauth2Client.setCredentials(authTokens);
    try {
      const files = await searchDriveForResumes(oauth2Client);
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: "Failed to list resumes" });
    }
  });

  app.post("/api/drive/file", async (req, res) => {
    const { fileId, mimeType } = req.body;
    const authTokens = (req as any).session.tokens;
    if (!authTokens) return res.status(401).json({ error: "Not authenticated" });
    
    oauth2Client.setCredentials(authTokens);
    try {
      const content = await getDriveFileContent(oauth2Client, fileId, mimeType);
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Failed to get file content" });
    }
  });

  app.get("/api/auth/google/url", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive.readonly'
      ],
      prompt: 'consent'
    });
    res.json({ url });
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // In a real app, we'd store these tokens in Firestore associated with the user
      // For this prototype, we'll store them in the session for simplicity, 
      // but we'll also provide a way to pass them back if needed.
      (req as any).session.tokens = tokens;

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.post("/api/calendar/sync", async (req, res) => {
    const { tokens, event } = req.body;
    const authTokens = tokens || (req as any).session.tokens;

    if (!authTokens) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    try {
      oauth2Client.setCredentials(authTokens);
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const { title, company, deadline, description } = event;
      
      // Proactive reminders: 3 days before, 1 day before, and on the day
      const reminders = [
        { method: 'popup', minutes: 24 * 60 * 3 }, // 3 days
        { method: 'popup', minutes: 24 * 60 },     // 1 day
        { method: 'email', minutes: 60 * 2 }       // 2 hours
      ];

      const calendarEvent = {
        summary: `Apply: ${title} at ${company}`,
        location: company,
        description: description || `Don't forget to apply for the ${title} position at ${company}. Deadline: ${deadline}`,
        start: {
          dateTime: new Date(deadline).toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(new Date(deadline).getTime() + 60 * 60 * 1000).toISOString(),
          timeZone: 'UTC',
        },
        reminders: {
          useDefault: false,
          overrides: reminders,
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: calendarEvent,
      });

      res.json({ success: true, eventId: response.data.id });
    } catch (error) {
      console.error("Error syncing to calendar:", error);
      res.status(500).json({ error: "Failed to sync to calendar" });
    }
  });

  app.post("/api/fetch-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();
      res.json({ html });
    } catch (error) {
      console.error("Error fetching URL:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
