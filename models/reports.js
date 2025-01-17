const { reportsCollection } = require('../mongodb');


async function addReport(userId, reporterId, reason) {
    const report = {
        userId,
        reports: {
            reporterId,
            reason,
            timestamp: new Date(),
        }
    };
    
    await reportsCollection.updateOne(
        { userId: userId },
        { $push: { reports: report.reports } },
        { upsert: true }
    );
}


async function getReports(userId) {
    return await reportsCollection.findOne({ userId });
}


async function clearReports(userId) {
    await reportsCollection.deleteOne({ userId });
}

module.exports = {
    addReport,
    getReports,
    clearReports,
};
