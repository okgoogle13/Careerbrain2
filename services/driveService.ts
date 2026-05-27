import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const searchDriveForResumes = async (auth: OAuth2Client) => {
  const drive = google.drive({ version: 'v3', auth });
  
  // Search for PDFs or Google Docs, possibly matching 'resume' or 'CV' in name
  const query = `(mimeType="application/pdf" or mimeType="application/vnd.google-apps.document") and trashed=false`;
  
  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name, mimeType, modifiedTime, iconLink)',
    orderBy: 'modifiedTime desc',
    pageSize: 50
  });

  return response.data.files || [];
};

export const getDriveFileContent = async (auth: OAuth2Client, fileId: string, mimeType: string) => {
  const drive = google.drive({ version: 'v3', auth });
  
  if (mimeType === 'application/vnd.google-apps.document') {
    // Export Google Docs to plain text
    const response = await drive.files.export({
      fileId: fileId,
      mimeType: 'text/plain'
    });
    return response.data;
  } else {
    // For PDFs, we might need a parser in the backend or we can just download the binary and process via Gemini.
    // We'll return the binary or we'll pass the file directly to Gemini if possible.
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'arraybuffer' });
    
    return Buffer.from(response.data as ArrayBuffer).toString('base64');
  }
};
