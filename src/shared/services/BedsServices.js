import {
  collection,
  query as firestoreQuery,
  getCountFromServer,
  where
} from "firebase/firestore";
import db from "../../database/database";
const Collection = collection(db, "beds");
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
    const beds =
      bedsDoc.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }) || [];
    return beds;
  },

  async getByStatus(status) {
    const bedsRef = db.collection("beds").where("status", "==", status);
    const bedsDoc = await bedsRef.get();
    const beds =
      bedsDoc.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }) || [];
    return beds;
  },

  async getByStatusAndSection(status, section) {
    const bedsRef = db
      .collection("beds")
      .where("status", "==", status)
      .where("section", "==", section);
    const bedsDoc = await bedsRef.get();
    const beds =
      bedsDoc.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }) || [];
    return beds;
  },

  async getByManyStatus(status) {
    const bedsRef = db.collection("beds").where("status", "in", status);
    const bedsDoc = await bedsRef.get();
    const beds =
      bedsDoc.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }) || [];
    return beds;
  },

  async updateStatus(documentId, status) {
    const bedRef = db.collection("beds").doc(documentId);
    await bedRef.update({
      status: status,
      updated_at: new Date(),
    });
  },

  async updateBed(bed) {
    const { id } = bed;
    const bedRef = db.collection("beds").doc(id);
    await bedRef.update(bed);
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
    const logRef = db.collection("logs");
    const documentRef = await logRef.add(log);
    const createdLog = await documentRef.get();
    return { id: documentRef.id, ...createdLog.data() };
  },

  listenToBedChanges(documentId, callback) {
    const bedRef = db.collection("beds").doc(documentId);
    return bedRef.onSnapshot((doc) => {
      const bed = { id: doc.id, ...doc.data() };
      callback(bed);
    });
  },

  listenToAllBedsChanges(callback) {
    const bedsRef = db.collection("beds");
    return bedsRef.onSnapshot((querySnapshot) => {
      const beds =
        querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }) || [];
      callback(beds);
    });
  },

  listenToBedsByStatusChanges(status, callback) {
    const bedsRef = db.collection("beds").where("status", "==", status);
    return bedsRef.onSnapshot((querySnapshot) => {
      const beds =
        querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        }) || [];
      callback(beds);
    });
  },

  getLastLog(lastLogId) {
    const logRef = db.collection("logs").doc(lastLogId);
    return logRef.get().then((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  },

  async getCountByStatus(status, sector) {
    let bedsRef;

    if (sector) {
      bedsRef = firestoreQuery(
        Collection,
        where("status", "==", status),
        where("section", "==", sector)
      );
    } else {
      bedsRef = firestoreQuery(Collection, where("status", "==", status));
    }

    const snapshot = await getCountFromServer(bedsRef);

    return snapshot.data().count;
  },

  async getCountBySector(sector) {
    const bedsRef = firestoreQuery(Collection, where("section", "==", sector));
    const snapshot = await getCountFromServer(bedsRef);
    return snapshot.data().count;
  },
};

export default BedsService;
