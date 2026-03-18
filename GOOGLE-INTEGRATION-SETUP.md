# 🔔 Google Meet & Classroom Integration Setup Guide

## 📋 Overview

AsarBoard now integrates with Google Meet and Google Classroom to provide:
- **Google Meet**: Create and share Meet links directly from the whiteboard
- **Google Classroom**: Import students, post assignments, share whiteboard

---

## 🔧 Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select existing project
3. Name it: `AsarBoard` (or your preferred name)
4. Click **"Create"**

---

## 🔧 Step 2: Enable Required APIs

1. In Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search and enable these APIs:
   - ✅ **Google Classroom API**
   - ✅ **Google Calendar API** (for Meet creation)
   - ✅ **Google People API** (for user info)

---

## 🔧 Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** user type (or "Internal" for G Suite)
3. Fill in required fields:
   - **App name**: AsarBoard
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **"Save and Continue"**
5. **Scopes**: Add these scopes:
   - `https://www.googleapis.com/auth/classroom.courses.readonly`
   - `https://www.googleapis.com/auth/classroom.rosters.readonly`
   - `https://www.googleapis.com/auth/classroom.announcements`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. Click **"Save and Continue"**
7. **Test users**: Add your Google email as a test user
8. Click **"Save and Continue"**

---

## 🔧 Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `AsarBoard Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:4173`
   - `http://localhost:5173` (if using different port)
6. **Authorized redirect URIs**:
   - `http://localhost:4173`
   - `http://localhost:4173/admin`
7. Click **"Create"**
8. **Copy the Client ID** - you'll need this!

---

## 🔧 Step 5: Get API Key

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** > **"API key"**
3. **Copy the API Key**
4. Click **"Edit API key"** to restrict it (recommended):
   - Restrict to: Classroom API, Calendar API, People API

---

## 🔧 Step 6: Update Code with Credentials

Open `src/components/GoogleIntegration.tsx` and update:

```typescript
// Line 27-28: Replace with your actual credentials
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.announcements';
```

Open `index.html` and the Google API will load automatically.

---

## 🔧 Step 7: Update Server (Optional - for advanced features)

For full Meet creation (requires Google Calendar API), update `server/index.ts`:

```typescript
// Add Calendar API initialization
const { google } = require('googleapis');

// Create Meet link via Calendar API
async function createMeetLink() {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  const conferenceData = {
    createRequest: {
      requestId: `${Date.now()}@asarboard`,
      conferenceSolutionKey: { type: 'hangoutsMeet' }
    }
  };
  
  // Create calendar event with Meet
  const event = await calendar.events.insert({
    calendarId: 'primary',
    conferenceData,
    resource: {
      summary: 'AsarBoard Session',
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000).toISOString() }
    }
  });
  
  return event.data.hangoutLink;
}
```

---

## ✅ Testing

### Test Google Meet:
1. Start dev server: `npm run dev`
2. Open whiteboard as teacher
3. Click **Google Integration** button (Book icon)
4. Click **"Sign in with Google"**
5. Authorize the app
6. Go to **Google Meet** tab
7. Click **"Create Google Meet"**
8. Meet link should be generated!

### Test Google Classroom:
1. In Google Integration modal, go to **Google Classroom** tab
2. Click **"Load My Classrooms"**
3. Select a classroom from dropdown
4. Click **"Import Students from Classroom"**
5. Students should be imported!

---

## 🎯 Features

### Google Meet Integration:
- ✅ Create Meet links directly from whiteboard
- ✅ Share Meet link with all students automatically
- ✅ Open Meet in new tab
- ✅ Copy Meet link to clipboard

### Google Classroom Integration:
- ✅ Import student roster from your classrooms
- ✅ Post whiteboard link as assignment/material
- ✅ Share announcements with students
- ✅ Multiple classroom support

---

## 🐛 Troubleshooting

### "Access Blocked" Error:
- Make sure your Google account is added as a **test user**
- Check that OAuth consent screen is configured
- Verify all required scopes are added

### "API not enabled" Error:
- Go to Google Cloud Console
- Enable the required API (Classroom/Calendar)
- Wait a few minutes for changes to propagate

### "Invalid Client ID" Error:
- Double-check Client ID in `GoogleIntegration.tsx`
- Ensure authorized origins include your dev URL
- Verify redirect URIs are correct

### No Classrooms Showing:
- Make sure you're signed in as a **teacher** account
- Check Classroom API is enabled
- Verify classroom roster scopes are authorized

---

## 🔒 Security Notes

1. **Never commit credentials** to version control
2. Use environment variables for production:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_API_KEY=your_api_key
   ```
3. Restrict API key to specific domains in production
4. Use HTTPS in production (required for OAuth)

---

## 📚 Resources

- [Google Classroom API Docs](https://developers.google.com/classroom)
- [Google Identity Services](https://developers.google.com/identity)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

## 🎉 You're Done!

Your AsarBoard now integrates with Google Meet and Classroom! 🚀

**Need help?** Check the troubleshooting section or contact support.

Made with ❤️ by **AL ASAR JADEED**
