const Gallery = require('../models/gallery.model');

const listGallery = async (filter = {}) => {
  return await Gallery.find(filter).sort({ uploadDate: -1 });
};

const createGallery = async (galleryData) => {
  const gallery = new Gallery(galleryData);
  return await gallery.save();
};

const deleteGallery = async (id) => {
  return await Gallery.findByIdAndDelete(id);
};

module.exports = {
  listGallery,
  createGallery,
  deleteGallery,
};
