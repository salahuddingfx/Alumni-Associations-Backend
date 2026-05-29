const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (localFilePath, folder = 'practon_alumni') => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file to Cloudinary with compression & optimization transformations
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto:good', // Optimize quality dynamically to reduce filesize
      fetch_format: 'auto', // Auto select best modern file format (webp/avif)
      transformation: [
        { width: 2000, height: 2000, crop: 'limit' } // Limits maximum dimension to maintain optimal size between 4-6MB
      ]
    });
    
    // Remove temporary local file from uploads
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed, falling back to local storage:', error.message);
    const path = require('path');
    const filename = path.basename(localFilePath);
    return `/uploads/${filename}`;
  }
};

module.exports = { uploadToCloudinary };
