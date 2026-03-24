// models/ProjectListing.js
const mongoose = require('mongoose');

const projectListingSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    projectTitle: {
        type: String,
        required: true
    },

    durationWeeks: {
        type: Number,
        required: true
    },

    budget: {
        type: Number,
        required: true
    },

    location: {
        latitude: Number,
        longitude: Number,
        address: String,
        city: String,
        state: String,
        country: {
            type: String,
            default: 'Remote'
        }
    },

    geoLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },

    details: {
        type: String
    },

    service: {
        type: String,
        enum: ['Web Development', 'Graphic Design', 'Project Management', 'Consulting', 'Other'],
        default: 'Other'
    },

    videoUrl: {
        type: String,
        required: true
    },

    complexity: {
        type: String,
        enum: ['Entry', 'Intermediate', 'Senior', 'Expert'],
        default: 'Intermediate'
    },

    qualityScore: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: [
            'pending_review',
            'reviewed',
            'active',
            'bidding',
            'awarded',
            'completed',
            'cancelled',
            'failed_submission'
        ],
        default: 'pending_review'
    },

    mlJobId: {
        type: String,
        default: null
    },

    aiAnalysisDetails: {
        type: Object,
        default: {}
    },

    requirements: {
        type: Object,
        default: {}
    }

}, { timestamps: true });

projectListingSchema.index({ geoLocation: '2dsphere' });

module.exports = mongoose.model('ProjectListing', projectListingSchema);
