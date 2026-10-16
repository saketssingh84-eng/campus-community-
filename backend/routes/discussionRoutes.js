const express = require('express');

const {
    getAllCategories,
    createCategory,
    getAllThreads,
    getThreadById,
    createThread,
    createPost,
    deletePost
} = require('../controllers/discussionController');

const authenticateUser = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// Discussion categories
router.get('/categories', getAllCategories);
router.post('/categories', authenticateUser, requireAdmin, createCategory);

// Discussion threads
router.get('/threads', getAllThreads);
router.get('/threads/:id', getThreadById);
router.post('/threads', authenticateUser, createThread);

// Replies to discussion threads
router.post('/threads/:id/posts', authenticateUser, createPost);
router.delete('/posts/:postId', authenticateUser, deletePost);

module.exports = router;