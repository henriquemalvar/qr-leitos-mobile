import db from "../../database/database";

const LogService = {
  /**
   * Create a new log document.
   * @function createLog
   * @memberof LogsService
   * @param {Object} log - The log document data to create.
   * @returns {Promise<Object>} - A promise that resolves to the created log document data.
   *
   * @example
   * const log = {message: 'Log message', level: 'info'};
   */
  async createLog(log) {
    const documentRef = await db.collection("logs").add(log);
    const createdLog = await documentRef.get();
    return { id: documentRef.id, ...createdLog.data() };
  },

  /**
   * Fetch a log document by its ID.
   * @function getLogById
   * @memberof LogsService
   * @param {string} logId - The ID of the log document.
   * @returns {Promise<Object>} - A promise that resolves to the log document data.
   *
   * @example
   * const logId = 'log123';
   */
  async getLogById(logId) {
    const doc = await db.collection("logs").doc(logId).get();
    return { id: doc.id, ...doc.data() };
  },
};

export default LogService;
