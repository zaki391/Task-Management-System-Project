const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true,
        maxlength: [50, 'Project name cannot be more than 50 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'completed'],
        default: 'active'
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete tasks when a project is deleted
projectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`Tasks being removed from project ${this._id}`);
    await this.model('Task').deleteMany({ project: this._id });
    next();
});

// Reverse populate with virtuals
projectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'project',
    justOne: false
});

module.exports = mongoose.model('Project', projectSchema);
