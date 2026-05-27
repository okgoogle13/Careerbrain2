import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const initializeCareerDatabaseSheet = async (auth: OAuth2Client, title: string) => {
  const sheets = google.sheets({ version: 'v4', auth });
  
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: 'Applications'
          }
        }
      ]
    }
  });

  const spreadsheetId = spreadsheet.data.spreadsheetId;
  
  if (spreadsheetId) {
    // Add headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Applications!A1:E1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['Company', 'Role', 'Status', 'Deadline', 'Link']]
      }
    });
  }

  return spreadsheetId;
};
