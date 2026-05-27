import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const createDocumentFromTemplate = async (auth: OAuth2Client, title: string, content: string) => {
  const docs = google.docs({ version: 'v1', auth });
  
  const doc = await docs.documents.create({
    requestBody: {
      title
    }
  });

  const documentId = doc.data.documentId;
  
  if (documentId) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1
              },
              text: content
            }
          }
        ]
      }
    });
  }

  return documentId;
};
