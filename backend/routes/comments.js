const router = require('express').Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });
    const comment = await Comment.create({ content, author: req.user.id, post: req.params.postId });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
