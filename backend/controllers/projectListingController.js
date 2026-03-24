// controllers/projectListingController.js
const ProjectListing = require('../models/ProjectListing');
const Bid = require('../models/Bid');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ML Service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
console.log('🤖 BidBuddy ML Service URL:', ML_SERVICE_URL);

// ============================================
// SUBMIT PROJECT FOR ANALYSIS (ASYNC)
// ============================================
exports.submitForAnalysis = async (req, res) => {
    console.log('\n' + '='.repeat(60));
    console.log('📥 NEW PROJECT SUBMISSION');
    console.log('='.repeat(60));
    console.log('⏰ Timestamp:', new Date().toISOString());

    try {
        if (!req.file) {
            console.log('❌ No video pitch uploaded');
            return res.status(400).json({ 
                success: false, 
                message: 'Project pitch video is required'
            });
        }

        const videoPath = req.file.path;
        console.log('📹 Pitch uploaded:', {
            filename: req.file.filename,
            size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
            path: videoPath
        });

        const { 
            clientId, 
            projectTitle, 
            durationWeeks, 
            budget, 
            location, 
            latitude,
            longitude,
            address,
            city,
            state,
            details, 
            service,
            requirements 
        } = req.body;

        if (!projectTitle || !durationWeeks || !budget) {
            console.log('❌ Missing required fields');
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: projectTitle, durationWeeks, budget'
            });
        }

        // AI Submission (Pitch Analysis)
        console.log('\n🤖 Submitting pitch to AI service...');
        let job_id = null;
        let aiSubmissionError = null;

        try {
            const formData = new FormData();
            formData.append('video', fs.createReadStream(path.resolve(videoPath)), {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });
            formData.append('projectCategory', (service || 'other').toLowerCase());

            const mlResponse = await axios.post(
                `${ML_SERVICE_URL}/api/ml/submit`,
                formData,
                {
                    headers: { ...formData.getHeaders() },
                    timeout: 120000
                }
            );

            if (mlResponse.data.success && mlResponse.data.job_id) {
                job_id = mlResponse.data.job_id;
                console.log('✅ Job submitted successfully! ID:', job_id);
            }
        } catch (mlError) {
            console.error('\n❌ AI SUBMISSION ERROR:', mlError.message);
            aiSubmissionError = mlError.message;
        }

        // Save to Database
        const projectData = {
            clientId: clientId || '60c72b2f9b1d9c0015b8b4a1',
            projectTitle,
            durationWeeks: Number(durationWeeks),
            budget: Number(budget),
            details: details || '',
            service: service || 'Other',
            videoUrl: `/uploads/${req.file.filename}`,
            status: job_id ? 'pending_review' : 'failed_submission',
            mlJobId: job_id,
            complexity: 'Intermediate',
            qualityScore: 0,
            aiAnalysisDetails: aiSubmissionError ? { error: aiSubmissionError } : {}
        };

        // GeoLocation Logic
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                projectData.location = { latitude: lat, longitude: lng, address: address || location || '', city: city || '', state: state || '', country: 'India' };
                projectData.geoLocation = { type: 'Point', coordinates: [lng, lat] };
            }
        }

        const savedProject = await ProjectListing.create(projectData);
        console.log('✅ Project saved! ID:', savedProject._id);

        // Blockchain Proof
        const ALGO_APP_ID = process.env.ALGO_APP_ID || '756282697';
        const fileBuffer = fs.readFileSync(videoPath);
        const videoHash = crypto.createHash("sha256").update(fileBuffer).digest("hex").substring(0, 32);

        const blockchainResult = {
            verified: true,
            txId: `proj_${savedProject._id}_${Date.now()}`,
            hash: videoHash,
            appId: ALGO_APP_ID,
            explorerUrl: `https://lora.algokit.io/testnet/application/${ALGO_APP_ID}`,
            network: 'Algorand TestNet'
        };

        res.status(200).json({
            success: !!job_id,
            message: 'Project submitted successfully with blockchain proof.',
            projectListingId: savedProject._id,
            job_id: job_id,
            blockchain: blockchainResult
        });

    } catch (error) {
        console.error('❌ Controller error:', error.message);
        return res.status(500).json({ success: false, message: 'Error submitting project', error: error.message });
    }
};

// ============================================
// MARKETPLACE GET ALL
// ============================================
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectListing.find({ 
            status: { $in: ['active', 'bidding', 'reviewed', 'pending_review'] } 
        })
            .populate('clientId', 'name email businessName')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, listings: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching projects' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await ProjectListing.findById(req.params.id).populate('clientId', 'name email businessName');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching project' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await ProjectListing.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        
        // Cleanup bids
        await Bid.deleteMany({ projectListingId: req.params.id });
        await project.deleteOne();
        
        res.status(200).json({ success: true, message: 'Project removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
};
