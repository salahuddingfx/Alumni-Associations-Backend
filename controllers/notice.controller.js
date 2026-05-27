const noticeService = require('../services/notice.service');
const { sendSuccess, sendError } = require('../utils/response');
const { emitRealtimeNotice } = require('../sockets/notification.socket');

const getNotices = async (req, res) => {
  try {
    const notices = await noticeService.listNotices();
    return sendSuccess(res, 'Notices retrieved successfully', notices);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getNoticeDetail = async (req, res) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.noticeId);
    if (!notice) {
      return sendError(res, 'Notice not found', 404);
    }
    return sendSuccess(res, 'Notice detail retrieved successfully', notice);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createNotice = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const noticeData = {
      ...req.body,
      fileUrl,
    };
    if (typeof noticeData.title === 'string') noticeData.title = JSON.parse(noticeData.title);
    if (typeof noticeData.content === 'string') noticeData.content = JSON.parse(noticeData.content);

    const notice = await noticeService.createNotice(noticeData);

    // Emit live update
    emitRealtimeNotice(notice);

    return sendSuccess(res, 'Notice created successfully', notice, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const updateNotice = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.fileUrl = `/uploads/${req.file.filename}`;
    }
    if (typeof updateData.title === 'string') updateData.title = JSON.parse(updateData.title);
    if (typeof updateData.content === 'string') updateData.content = JSON.parse(updateData.content);

    const notice = await noticeService.updateNotice(req.params.noticeId, updateData);
    if (!notice) {
      return sendError(res, 'Notice not found', 404);
    }
    return sendSuccess(res, 'Notice updated successfully', notice);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await noticeService.deleteNotice(req.params.noticeId);
    if (!notice) {
      return sendError(res, 'Notice not found', 404);
    }
    return sendSuccess(res, 'Notice deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getNotices,
  getNoticeDetail,
  createNotice,
  updateNotice,
  deleteNotice,
};
