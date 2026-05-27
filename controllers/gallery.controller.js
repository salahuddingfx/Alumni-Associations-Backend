const galleryService = require('../services/gallery.service');
const { sendSuccess, sendError } = require('../utils/response');

const getGallery = async (req, res) => {
  try {
    const { category, type } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;

    const items = await galleryService.listGallery(filter);
    return sendSuccess(res, 'Gallery retrieved successfully', items);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createGalleryItem = async (req, res) => {
  try {
    const url = req.file ? `/uploads/${req.file.filename}` : req.body.url;
    if (!url) {
      return sendError(res, 'File or URL is required', 400);
    }
    const galleryData = {
      ...req.body,
      url,
    };
    if (typeof galleryData.title === 'string') galleryData.title = JSON.parse(galleryData.title);
    if (typeof galleryData.album === 'string') galleryData.album = JSON.parse(galleryData.album);

    const item = await galleryService.createGallery(galleryData);
    return sendSuccess(res, 'Gallery item created successfully', item, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await galleryService.deleteGallery(req.params.galleryId);
    if (!item) {
      return sendError(res, 'Gallery item not found', 404);
    }
    return sendSuccess(res, 'Gallery item deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getGallery,
  createGalleryItem,
  deleteGalleryItem,
};
