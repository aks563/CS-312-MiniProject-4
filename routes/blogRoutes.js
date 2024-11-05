// Importing express and setting up router
const express = require('express');
const router = express.Router();

// Initialize an array to store posts
let posts = []; 

// Route to display the form for creating a new post
router.get('/posts/new', (req, res) => {
  res.render('posts/new'); // Rendering the new post
});

// Route to handle form submission and create a new post
router.post('/posts', (req, res) => {
  // Create a new post object with data from the form
  const post = {
    id: posts.length + 1, // assigning each post an ID
    name: req.body.name, // initializing
    title: req.body.title,
    content: req.body.content,
    postedOn: new Date() // Store the current date and time
  };
  posts.push(post); // append new post to the posts array
  res.redirect('/'); // Redirect user to the homepage
});

// Route to display all posts on the homepage
router.get('/', (req, res) => {
  res.render('index', { posts: posts }); // Rendering homepage with updtaed array of posts
});

// Route to display the form for editing an existing post
router.get('/posts/edit/:id', (req, res) => {
  // Find post using ID
  const post = posts.find(post => post.id === parseInt(req.params.id));
  res.render('posts/edit', { post }); // Rendering edit form with post content
});

// Route to handle the editing of a post
router.post('/posts/edit/:id', (req, res) => {
  // Find post using ID
  const post = posts.find(post => post.id === parseInt(req.params.id));
  // Update post with new content from form
  post.name = req.body.name;
  post.title = req.body.title;
  post.content = req.body.content;
  res.redirect('/'); // Redirect user to the homepage
});

// Route to handle post deletion
router.post('/posts/delete/:id', (req, res) => {
  // Find post using ID
  const postIndex = posts.findIndex(post => post.id === parseInt(req.params.id));
  if (postIndex > -1) {
    posts.splice(postIndex, 1); // Delete post from the array
  }
  res.redirect('/'); // Redirect user to the homepage
});

// Export the router to be used in the main application file
module.exports = router;
