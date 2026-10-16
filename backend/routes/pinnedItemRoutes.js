const express = require('express');

const {
    getPinnedItems,
    pinItem,
    unpinItem
} = require('../controllers/pinnedItemController');

const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// All pinned-item operations require login
router.use(authenticateUser);

router.get('/', getPinnedItems);
router.post('/', pinItem);
router.delete('/:id', unpinItem);

module.exports = router;