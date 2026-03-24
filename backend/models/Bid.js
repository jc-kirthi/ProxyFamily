// models/Bid.js
// ============================================
const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema(
{
projectListingId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'ProjectListing',
required: true,
},
freelancerId: {
type: String,
required: true,
},
bidAmount: {
type: Number,
required: true,
},
proposalText: {
type: String,
default: ''
},
comprehensionScore: {
type: Number,
default: 0
},
bidStatus: {
type: String,
enum: ['pending', 'shortlisted', 'awarded', 'lost', 'rejected'],
default: 'pending',
},
createdAt: {
type: Date,
default: Date.now,
},
},
{ timestamps: true }
);
module.exports = mongoose.model('Bid', bidSchema);
