import db from "../../database/database";

const BedsService = {
  async getById(documentId) {
    const bedRef = db.collection("beds").doc(documentId);
    const bedDoc = await bedRef.get();
    const bed = bedDoc.data();
    return bed;
  },

  async getAll() {
    const bedsRef = db.collection("beds");
    const bedsDoc = await bedsRef.get();
    const beds = bedsDoc.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return beds;
  },

  async getByStatus(status) {
    const bedsRef = db.collection("beds").where("status", "==", status);
    const bedsDoc = await bedsRef.get();
    const beds = bedsDoc.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return beds;
  },

  async update(documentId, status) {
    ("update called");
    const bedRef = db.collection("beds").doc(documentId);
    await bedRef.update({
      status: status,
      updated_at: new Date(),
    });
  },

  async updateMany(beds) {
    const batch = db.batch();
    beds.forEach((bed) => {
      const bedRef = db.collection("beds").doc(bed.id);
      batch.update(bedRef, {
        status: bed.status,
        updated_at: new Date(),
      });
    });
    await batch.commit();
  },

  async createLog(log) {
    ("createLog called");
    const logRef = db.collection("logs");
    await logRef.add(log);
  },
};

export default BedsService;
