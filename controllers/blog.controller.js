const Blog = require('../models/blog.model');
const { sendSuccess, sendError } = require('../utils/response');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const generateSlug = require('../utils/generateSlug');

const getBlogs = async (req, res) => {
  try {
    const list = await Blog.find().sort({ createdAt: -1 });
    return sendSuccess(res, 'Blogs retrieved successfully', list);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getBlogDetail = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return sendError(res, 'Blog not found', 404);
    }
    return sendSuccess(res, 'Blog details retrieved successfully', blog);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createBlog = async (req, res) => {
  try {
    let thumbnail = '';
    if (req.file) {
      thumbnail = await uploadToCloudinary(req.file.path, 'blog_photos');
    }
    const blogData = {
      ...req.body,
      thumbnail,
    };
    if (typeof blogData.title === 'string') blogData.title = JSON.parse(blogData.title);
    if (typeof blogData.content === 'string') blogData.content = JSON.parse(blogData.content);

    blogData.slug = generateSlug(blogData.title.en);

    const blog = new Blog(blogData);
    await blog.save();

    return sendSuccess(res, 'Blog post created successfully', blog, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.blogId);
    if (!blog) {
      return sendError(res, 'Blog post not found', 404);
    }
    return sendSuccess(res, 'Blog post deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getBlogs,
  getBlogDetail,
  createBlog,
  deleteBlog,
};
