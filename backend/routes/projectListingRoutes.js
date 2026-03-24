// routes/projectListingRoutes.js
const express = require('express');
const projectListingController = require('../controllers/projectListingController');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

// Project Routes
router.post('/submit-pitch', upload.single('video'), projectListingController.submitForAnalysis);
router.get('/all', projectListingController.getAllProjects);
router.get('/marketplace', projectListingController.getAllProjects);
router.get('/:id', projectListingController.getProjectById);
router.delete('/:id', projectListingController.deleteProject);

module.exports = router;
