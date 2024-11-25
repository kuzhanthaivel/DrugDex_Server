const mongoose = require('mongoose');
// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookmarks: [
        {
            drugName: { type: String }
        }
    ]
});
// Admin Schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralId: { type: String, required: true },
    referredId: { type: String },
    myReferrals: { type: String },
    phoneNumber: { type: Number, required: true },
    bookmarks: { type: [String] }
});
// Drug Data Schema
const drugDataSchema = new mongoose.Schema({
    drugName: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    uses: { type: [String] },
    indications: { type: [String] },
    sideEffects: { type: [String] },
    warnings: { type: [String] }
});
// Export all models
module.exports = {
    User: mongoose.model('User', userSchema),
    Admin: mongoose.model('Admin', adminSchema),
    DrugData: mongoose.model('DrugData', drugDataSchema)
};
