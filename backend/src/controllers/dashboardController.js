const db = require('../config/db');

// @desc    Get dashboard stats
// @route   GET /dashboard/stats
const getStats = async (req, res) => {
    try {
        let taskQuery = {};
        let projectQuery = {};

        if (req.user.role !== 'admin') {
            taskQuery.assignedTo = req.user._id;
            projectQuery.members = req.user._id;
        }

        const tasks = await db.tasks.find(taskQuery);
        const projects = await db.projects.find(projectQuery);

        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            pendingTasks: tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length,
            totalProjects: projects.length,
            overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
            recentTasks: tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        };

        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getStats };
