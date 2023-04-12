const Blogpost = require("../models/blogpostModel");

// Get all blogs
const getBlogs = async (req, res) => {

try {
const filter = {};
const userId = req?.user.id;
    const sortOrder = req.query.sort && req.query.sort === 'desc' ? -1 : 1;
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    if(userId) filter.user_id = userId;
    if(keyword) filter.title = { $regex: keyword, $options: 'i' };

    const blogPosts = await Blogpost.find(filter)
                        .sort({ createdAt: sortOrder })
                        .limit(limit)
                        .skip(skipIndex)
                        .exec();

    res.status(200).json({status:'200',message:'Blog List', blogPosts})

} catch(err){
    res.status(500).json({ message:'Server Error'})

}  
}
// Create New blog post
const createBlog = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description ) {
    res.status(400).json({status:"400 error", message: "All fields are mandatory"});
    throw new Error ("All fields are mandatory");
  }
  const blogDetail = await Blogpost.create({
    title,
    description,
    user_id: req.user.id,
  });

  res.status(201).json({status:"201 success", message: "Blog created successfully", result: blogDetail});
};

// Get blog by id
const getBlog = async (req, res) => {
  const blog = await Blogpost.findById(req.params.postId);
  
  if (!blog) {
    res.status(404).json({status: "404 Error", message: "Blog Not Found"});
    throw new Error ("Blog not found");
  }
  res.status(200).json({status: "200 Success", message: "Blog List by Id", result: blog});
};

// Update blog by id
const updateBlog = async (req, res) => {
  const blog = await Blogpost.findById(req.params.postId);
  if (!blog) {
    res.status(404).json({status: "404 Error", message: "Blog Not Found"});
    throw new Error ("Blog not found");
  }

  if (blog.user_id.toString() !== req.user.id) {
    res.status(403).json({status: "error", message:"User don't have permission to update other user blogs"});
    throw new Error ("User don't have permission to update other user blogs");
  }

  const updatedBlog = await Blogpost.findByIdAndUpdate(
    req.params.postId,
    req.body,
    { new: true }
  );

  res.status(200).json({status: "200 Success", message: "Blog updated", result: updatedBlog});
};

// Delete blog by id
const deleteBlog = async (req, res) => {
  const blog = await Blogpost.findById(req.params.postId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  if (blog.user_id.toString() !== req.user.id) {
    res.status(403).json({status: "error", message:"User don't have permission to update other user blogs"});
    throw new Error("User don't have permission to update other user blogs");
  }
  await Blogpost.deleteOne({ _id: req.params.postId });
  res.status(200).json({status: "200 Success", message: "Blog deleted", result: blog});
};

module.exports = {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog
};
