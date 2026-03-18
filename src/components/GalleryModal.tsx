import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image, Upload, Link as LinkIcon, FolderOpen, Cloud, HardDrive, Globe, Plus, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

interface GalleryItem {
  id: number;
  url: string;
  name: string;
  type: 'local' | 'cloud' | 'link';
  source?: string;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'cloud'>('local');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [cloudLink, setCloudLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem: GalleryItem = {
          id: Date.now() + Math.random(),
          url: event.target?.result as string,
          name: file.name,
          type: 'local'
        };
        setGalleryItems(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCloudLink = () => {
    if (!cloudLink.trim()) return;

    const newItem: GalleryItem = {
      id: Date.now(),
      url: cloudLink,
      name: `Cloud Image ${galleryItems.length + 1}`,
      type: 'cloud',
      source: cloudLink
    };
    setGalleryItems(prev => [...prev, newItem]);
    setCloudLink('');
  };

  const handleDeleteItem = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectImage = (item: GalleryItem) => {
    onSelectImage(item.url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "w-full max-w-4xl p-8 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col",
          "bg-white text-black"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Image size={28} className="text-purple-500" />
            Media Gallery
          </h3>
          <p className="text-gray-500">Upload images from your device or add cloud links</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('local')}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors",
              activeTab === 'local'
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <HardDrive size={18} />
            Local Files
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors",
              activeTab === 'cloud'
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <Cloud size={18} />
            Cloud Links
          </button>
        </div>

        {/* Local Tab */}
        {activeTab === 'local' && (
          <div className="flex-1 overflow-y-auto">
            {/* Upload Area */}
            <div className={cn(
              "border-2 border-dashed rounded-2xl p-8 text-center mb-6 cursor-pointer transition-colors",
              "hover:border-purple-500 hover:bg-purple-50"
            )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="font-bold mb-2">Upload from Device</p>
              <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, GIF, WEBP</p>
            </div>

            {/* Gallery Grid */}
            {galleryItems.filter(item => item.type === 'local').length > 0 && (
              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <FolderOpen size={18} />
                  Your Uploads ({galleryItems.filter(item => item.type === 'local').length})
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryItems.filter(item => item.type === 'local').map(item => (
                    <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSelectImage(item)}
                          className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                          title="Use in whiteboard"
                        >
                          <Plus size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {galleryItems.filter(item => item.type === 'local').length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Image size={48} className="mx-auto mb-4 opacity-50" />
                <p>No images uploaded yet</p>
                <p className="text-sm">Upload images from your device to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Cloud Tab */}
        {activeTab === 'cloud' && (
          <div className="flex-1 overflow-y-auto">
            {/* Add Cloud Link */}
            <div className={cn(
              "border-2 rounded-2xl p-6 mb-6",
              "bg-gray-50"
            )}>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Globe size={18} />
                Add Cloud Storage Link
              </h4>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  placeholder="Paste cloud link (Google Drive, Dropbox, OneDrive, etc.)"
                  value={cloudLink}
                  onChange={(e) => setCloudLink(e.target.value)}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl border outline-none transition-colors",
                    "focus:border-purple-500"
                  )}
                />
                <button
                  onClick={handleAddCloudLink}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <LinkIcon size={18} />
                  Add Link
                </button>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <ExternalLink size={12} /> Google Drive
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink size={12} /> Dropbox
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink size={12} /> OneDrive
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink size={12} /> Direct Image URL
                </span>
              </div>
            </div>

            {/* Cloud Links Gallery */}
            {galleryItems.filter(item => item.type === 'cloud').length > 0 && (
              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Cloud size={18} />
                  Cloud Links ({galleryItems.filter(item => item.type === 'cloud').length})
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryItems.filter(item => item.type === 'cloud').map(item => (
                    <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSelectImage(item)}
                          className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                          title="Use in whiteboard"
                        >
                          <Plus size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {galleryItems.filter(item => item.type === 'cloud').length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Cloud size={48} className="mx-auto mb-4 opacity-50" />
                <p>No cloud links added yet</p>
                <p className="text-sm">Add links from Google Drive, Dropbox, or other cloud services</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
