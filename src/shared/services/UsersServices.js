import db from "../../database/database";

const UsersService = {
  async getById(documentId) {
    const userRef = db.collection("users").doc(documentId);
    const userDoc = await userRef.get();
    const user = userDoc.data();
    return user;
  },

  async getAll() {
    const usersRef = db.collection("users");
    const usersDoc = await usersRef.get();
    const users = usersDoc.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return users;
  },

  async getByStatus(status) {
    const usersRef = db.collection("users").where("status", "==", status);
    const usersDoc = await usersRef.get();
    const users = usersDoc.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return users;
  },

  async updateStatus(documentIds, statuses) {
    const batch = db.batch();
    documentIds.forEach((documentId, index) => {
      const userRef = db.collection("users").doc(documentId);
      batch.update(userRef, {
        status: statuses[index],
        updated_at: new Date(),
      });
    });
    await batch.commit();
  },
};

export default UsersService;