import db from "../../database/database";

const LogsService = {
    async create(log) {
        const logRef = db.collection("logs");
        await logRef.add(log);
    },

    async createMany(logs) {
        const batch = db.batch();
        logs.forEach((log) => {
            const logRef = db.collection("logs").doc();
            batch.set(logRef, log);
        });
        await batch.commit();
    }
};

export default LogsService;