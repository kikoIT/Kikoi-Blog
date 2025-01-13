const Blog = require('../models/blogs');


const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('blogs/index', {blogs: result, title: 'All Blogs'})
        })
        .catch((err) => {
            console.log(err);
        })
}

const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('blogs/details', { blog: result, title: 'Blog Details' })
        })
        .catch((err) => {
            res.status(404).render('404', { title: 'Blog not found'})
        })
}

const blog_create_get = (req, res) => {
    res.render('blogs/create', { title: 'Create a new blog' });
}

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err)});
}

const blog_delete = (req, res) => {
    const id = req.params.id;

  Blog.findByIdAndDelete(id)
      .then((result) => {
        if (result) {
            // Document was found and deleted
            res.status(200).json({ message: 'Blog deleted successfully', redirect: '/blogs' });
        } else {
            // Document not found
            res.status(404).json({ message: 'Blog not found' });
        }
    })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Server error' });
    });
}

module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete
}

