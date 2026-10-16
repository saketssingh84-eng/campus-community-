const express = require('express');

const {
    getAllTags,
    createTag,
    attachTag,
    getItemTags,
    detachTag
} = require('../controllers/tagController');

const authenticateUser = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// List tags
router.get('/', getAllTags);

// Create a tag (admin only)
router.post('/', authenticateUser, requireAdmin, createTag);

// Attach a tag (admin only)
router.post('/attach', authenticateUser, requireAdmin, attachTag);

// Get tags attached to an item
router.get('/:itemType/:itemId', getItemTags);

// Remove a tag (admin only)
router.delete(
    '/:itemType/:itemId/:tagId',
    authenticateUser,
    requireAdmin,
    detachTag
);

module.exports = router;