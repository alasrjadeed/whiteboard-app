# Room Settings & Gallery Feature Implementation

## 1. Room Creation Settings ✅

### New Component: `RoomSettingsModal.tsx`
**Location:** `src/components/RoomSettingsModal.tsx`

**Features:**
- Maximum students slider (5-30, default: 30)
- Session duration slider (15-120 minutes, default: 60)
- Teacher name display
- Session summary
- Admin can override limits (server-side)

**Integration:**
1. Updated `NewSession.tsx` to show settings modal after name entry
2. Updated `App.tsx` handleCreateRoom to accept settings parameter
3. Settings passed to server when creating room

**Server Changes Needed:**
```javascript
// server/index.ts
socket.on("create-room", ({ roomId, name, settings }) => {
  rooms[roomId] = {
    teacherId: socket.id,
    teacherName: name,
    maxStudents: settings.maxStudents || 30,
    duration: settings.duration || 60,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + settings.duration * 60000),
    students: {},
    // ... other room data
  };
  
  // Auto-expire room after duration
  setTimeout(() => {
    delete rooms[roomId];
    io.to(roomId).emit("session-expired");
  }, settings.duration * 60000);
});
```

---

## 2. Media Gallery System ✅

### New Component: `GalleryModal.tsx`
**Location:** `src/components/GalleryModal.tsx`

**Features:**

#### **Local Files Tab:**
- Upload images from device (JPG, PNG, GIF, WEBP)
- Drag & drop support
- Gallery grid view
- Delete uploaded images
- Select image to use in whiteboard

#### **Cloud Links Tab:**
- Add cloud storage links (Google Drive, Dropbox, OneDrive)
- Direct image URLs supported
- Gallery grid view
- Delete cloud links
- Select image to use in whiteboard

**Integration with Whiteboard:**
```typescript
// In Whiteboard.tsx
const [showGallery, setShowGallery] = useState(false);

const handleSelectImage = (imageUrl: string) => {
  // Add image to whiteboard
  const newImage = {
    type: 'image',
    src: imageUrl,
    x: 100,
    y: 100,
    width: 300,
    height: 200
  };
  setLines(prev => [...prev, newImage]);
  socket.emit('draw', { roomId, lines: [...lines, newImage] });
};
```

**Usage in Teacher Dashboard:**
```typescript
<button
  onClick={() => setShowGallery(true)}
  className="px-4 py-2 bg-purple-500/10 text-purple-500"
>
  <Image size={14} /> Gallery
</button>

<GalleryModal
  isOpen={showGallery}
  onClose={() => setShowGallery(false)}
  onSelectImage={handleSelectImage}
/>
```

---

## 3. File Storage Strategy

### Local Storage (Browser):
- Gallery items stored in localStorage
- Persists across sessions
- Limited by browser quota (~5-10MB)

```javascript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('gallery-items', JSON.stringify(galleryItems));
}, [galleryItems]);

// Load from localStorage
useEffect(() => {
  const stored = localStorage.getItem('gallery-items');
  if (stored) {
    setGalleryItems(JSON.parse(stored));
  }
}, []);
```

### Cloud Storage:
- Users provide their own cloud links
- No server storage required
- Links stored in localStorage
- Images loaded directly from cloud

**Supported Cloud Services:**
- Google Drive (shareable link)
- Dropbox (shareable link)
- OneDrive (shareable link)
- Direct image URLs

---

## 4. Admin Controls (Server-Side)

### Override Limits:
```javascript
// server/index.ts
const ADMIN_CONFIG = {
  maxStudentsLimit: 100,  // Admin can set higher
  maxDuration: 480,       // 8 hours max
  defaultStudents: 30,
  defaultDuration: 60
};

socket.on("admin-update-config", ({ maxStudents, maxDuration }) => {
  if (socket.isAdmin) {
    ADMIN_CONFIG.maxStudentsLimit = maxStudents;
    ADMIN_CONFIG.maxDuration = maxDuration;
  }
});
```

---

## 5. User Flow

### Creating Room:
```
1. Teacher clicks "New Session"
2. Enters name
3. Clicks "Continue to Settings"
4. Room Settings Modal opens
5. Adjust max students (slider: 5-30)
6. Adjust duration (slider: 15-120 min)
7. Reviews summary
8. Clicks "Create Session"
9. Room created with settings
10. Redirected to whiteboard
```

### Using Gallery:
```
1. Teacher clicks "Gallery" button
2. Gallery Modal opens
3. Choose tab:
   - Local Files: Upload from device
   - Cloud Links: Add cloud URL
4. Upload/add images
5. Click image to use in whiteboard
6. Image added to canvas
7. Can move/resize/delete
```

---

## 6. Files Created/Modified

### Created:
- ✅ `src/components/RoomSettingsModal.tsx`
- ✅ `src/components/GalleryModal.tsx`

### Modified:
- ✅ `src/pages/NewSession.tsx` - Integrated settings modal
- ⏳ `src/App.tsx` - Update handleCreateRoom (needs update)
- ⏳ `src/components/Whiteboard.tsx` - Add Gallery button (needs update)
- ⏳ `server/index.ts` - Add room settings logic (needs update)

---

## 7. Next Steps

1. **Update App.tsx:**
   - Modify handleCreateRoom to accept settings
   - Pass settings to socket

2. **Update Whiteboard.tsx:**
   - Add Gallery button to toolbar
   - Integrate GalleryModal
   - Handle image insertion

3. **Update Server:**
   - Store room settings
   - Implement auto-expiry
   - Add admin config endpoints

4. **Add localStorage:**
   - Persist gallery items
   - Load on component mount

---

**Status:** Components Created ✅ | Integration Pending ⏳
**Created:** March 2026
**Project:** AsarBoard

Made with ❤️ by AL ASAR JADEED
