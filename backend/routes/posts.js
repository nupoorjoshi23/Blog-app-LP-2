const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, coverImage } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const post = await Post.create({ title, content, tags, coverImage, author: req.user.id });
    await post.populate('author', 'username');
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const { title, content, tags, coverImage } = req.body;
    Object.assign(post, { title, content, tags, coverImage });
    await post.save();
    await post.populate('author', 'username');
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
