import CryptoJS from 'crypto-js';

const STORAGE_ZONE = import.meta.env.VITE_BUNNY_STORAGE_ZONE;
const STORAGE_PASSWORD = import.meta.env.VITE_BUNNY_STORAGE_PASSWORD;
const STORAGE_REGION = import.meta.env.VITE_BUNNY_STORAGE_REGION;
const STORAGE_HOSTNAME = import.meta.env.VITE_BUNNY_STORAGE_HOSTNAME;
const CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;
const TOKEN_KEY = import.meta.env.VITE_BUNNY_TOKEN_KEY;

// Upload file to Bunny Storage
export const uploadFile = async (file, path) => {
  const url = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${path}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'AccessKey': STORAGE_PASSWORD,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload error:', errorText);
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return {
    success: true,
    url: `${CDN_URL}/${path}`,
    path: path,
  };
};

// Delete file from Bunny Storage
export const deleteFile = async (path) => {
  const url = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${path}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'AccessKey': STORAGE_PASSWORD,
    },
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.statusText}`);
  }

  return { success: true };
};

// Generate secure URL with token authentication
export const generateSecureURL = (path, expiresIn = 3600) => {
  // For now, return public URL without token
  // Token authentication can be enabled later from Bunny dashboard
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_URL}${cleanPath}`;
  
  /* Uncomment when token auth is properly configured:
  const expires = Math.floor(Date.now() / 1000) + expiresIn;
  const hashableBase = `${TOKEN_KEY}${cleanPath}${expires}`;
  const token = CryptoJS.MD5(hashableBase).toString();
  return `${CDN_URL}${cleanPath}?token=${token}&expires=${expires}`;
  */
};

// List files in a directory
export const listFiles = async (path = '') => {
  const url = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${path}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'AccessKey': STORAGE_PASSWORD,
    },
  });

  if (!response.ok) {
    throw new Error(`List failed: ${response.statusText}`);
  }

  return await response.json();
};

// Get public CDN URL (without token - for images)
export const getPublicURL = (path) => {
  return `${CDN_URL}/${path}`;
};

// Helper: Upload E-Book PDF
export const uploadEBook = async (file, bookId) => {
  const path = `ebooks/pdfs/book-${bookId}.pdf`;
  return await uploadFile(file, path);
};

// Helper: Upload E-Book Cover
export const uploadEBookCover = async (file, bookId) => {
  const ext = file.name.split('.').pop();
  const path = `ebooks/covers/book-${bookId}.${ext}`;
  return await uploadFile(file, path);
};

// Helper: Upload Course Video
export const uploadCourseVideo = async (file, courseId, videoId) => {
  const path = `courses/videos/course-${courseId}-video-${videoId}.mp4`;
  return await uploadFile(file, path);
};

// Helper: Upload Certificate
export const uploadCertificate = async (file, userId, courseId) => {
  const path = `certificates/user-${userId}-course-${courseId}.pdf`;
  return await uploadFile(file, path);
};
