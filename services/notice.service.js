const Notice = require('../models/notice.model');
const { getNoticesCache, setNoticesCache, clearNoticesCache } = require('../cache/notice.cache');

const listNotices = async () => {
  let cached = getNoticesCache();
  if (cached) return cached;

  const notices = await Notice.find().sort({ isSticky: -1, publishDate: -1 }).lean();
  setNoticesCache(notices);
  return notices;
};

const createNotice = async (noticeData) => {
  const notice = new Notice(noticeData);
  await notice.save();
  clearNoticesCache();
  return notice;
};

const getNoticeById = async (id) => {
  return await Notice.findById(id);
};

const updateNotice = async (id, updateData) => {
  const notice = await Notice.findByIdAndUpdate(id, updateData, { new: true });
  clearNoticesCache();
  return notice;
};

const deleteNotice = async (id) => {
  const notice = await Notice.findByIdAndDelete(id);
  clearNoticesCache();
  return notice;
};

module.exports = {
  listNotices,
  createNotice,
  getNoticeById,
  updateNotice,
  deleteNotice,
};
