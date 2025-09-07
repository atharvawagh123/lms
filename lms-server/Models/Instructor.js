const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id:{
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Instructor', InstructorSchema);
    