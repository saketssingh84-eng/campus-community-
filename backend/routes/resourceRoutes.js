const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    getAllResources,
    getResourceById,
    uploadResource,
    downloadResource,
    deleteResource
} = require('../controllers/resourceController');

const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// Create the upload directory if it does not exist
const uploadDirectory = path.join(process.cwd(), 'uploads', 'resources');

fs.mkdirSync(uploadDirectory, { recursive: true });

// Configure where uploaded files are saved
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const safeName = path.basename(file.originalname)
            .replace(/[^a-zA-Z0-9._-]/g, '_');

        callback(null, `${Date.now()}-${safeName}`);
    }
});

// Limit uploads to 10 MB and common document/image formats
const allowedExtensions = new Set([
    '.pdf', '.doc', '.docx', '.ppt', '.pptx',
    '.xls', '.xlsx', '.txt', '.png', '.jpg', '.jpeg'
]);

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.has(extension)) {
            return callback(
                new Error('File type not allowed. Upload a document, PDF, or image.')
            );
        }

        callback(null, true);
    }
});

// Public routes
router.get('/', getAllResources);
router.get('/:id/download', downloadResource);
router.get('/:id', getResourceById);

// Protected routes: login required
router.post('/', authenticateUser, upload.single('file'), uploadResource);
router.delete('/:id', authenticateUser, deleteResource);

module.exports = router;