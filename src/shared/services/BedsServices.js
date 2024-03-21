/**
 * BedsService module.
 * @module BedsService
 *
 * A bed document structure for reference:
 * @typedef {Object} Bed
 * @property {boolean} active
 * @property {Timestamp} created_at
 * @property {string} description
 * @property {string} id
 * @property {boolean} isBlocked
 * @property {boolean} isMaintenance
 * @property {string[]} location
 * @property {string} name
 * @property {string} section
 * @property {string} status
 * @property {string[]} type
 * @property {Timestamp} updated_at
 */

import {
  collection,
  query as firestoreQuery,
  getCountFromServer,
  where,
} from "firebase/firestore";
import db from "../../database/database";

/**
 * BedsService is a set of functions to interact with the 'beds' collection in Firestore.
 * @namespace BedsService
 */
const BedsService = {
  /**
   * Fetch a bed document by its ID.
   * @function getById
   * @memberof BedsService
   * @param {string} documentId - The ID of the bed document.
   * @returns {Promise<Object>} - A promise that resolves to the bed document data.
   *
   * @example
   * const documentId = 'bed123';
   */
  async getById(documentId) {
    const bedRef = db.collection("beds").doc(documentId);
    const bedDoc = await bedRef.get();
    const bed = bedDoc.data();
    return bed;
  },

  /**
   * Fetch bed documents that match the provided conditions.
   * @function getBedsByConditions
   * @memberof BedsService
   * @param {Object} conditions - An object where the keys are the field names and the values are the expected field values.
   * @returns {Promise<Array>} - A promise that resolves to an array of bed documents that match the conditions.
   *
   * @example
   * const conditions = {type: 'single', location: 'room1'};
   */
  async getBedsByConditions(conditions) {
    let query = db.collection("beds");

    for (const [key, value] of Object.entries(conditions)) {
      query = query.where(key, "==", value);
    }

    try {
      const querySnapshot = await query.get();
      let results =
        querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) || [];
      return results;
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      return [];
    }
  },

  /**
   * Update a bed document.
   * @function updateBed
   * @memberof BedsService
   * @param {Object} bed - The bed document data to update.
   * @returns {Promise<void>} - A promise that resolves when the bed document is successfully updated.
   *
   * @example
   * const bed = {id: 'bed123', type: 'double', location: 'room2'};
   */
  async updateBed(bed) {
    const { id } = bed;
    const bedRef = db.collection("beds").doc(id);
    await bedRef.update(bed);
  },

  /**
   * Get the count of bed documents that match the provided conditions.
   * @function getCountBy
   * @memberof BedsService
   * @param {Object} conditions - An object where the keys are the field names and the values are the expected field values.
   * @returns {Promise<number>} - A promise that resolves to the count of bed documents that match the conditions.
   *
   * @example
   * const conditions = {type: 'single'};
   */
  async getCountBy(conditions) {
    try {
      const queryConditions = Object.entries(conditions).map(([field, value]) =>
        where(field, "==", value)
      );
      const bedsRef = firestoreQuery(
        collection(db, "beds"),
        ...queryConditions
      );
      const snapshot = await getCountFromServer(bedsRef);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error getting count by conditions: ", error);
      throw error;
    }
  },

  /**
   * Fetch bed documents that match the provided filter data.
   * @function filterBeds
   * @memberof BedsService
   * @param {Object} filterData - An object where the keys are the field names and the values are the expected field values.
   * @returns {Promise<Array>} - A promise that resolves to an array of bed documents that match the filter data.
   *
   * @example
   * const filterData = {
   *  name: "bed name",
   * type: ["type1", "type2"],
   * location: ["location1", "location2"],
   * section: "section1",
   * };
   */
  async filterBeds(filterData) {
    let query = db.collection("beds");

    if (filterData.name) {
      query = query
        .orderBy("name")
        .startAt(filterData.name)
        .endAt(filterData.name + "\uf8ff");
    }

    if (filterData.type && filterData.type.length) {
      query = query.where("type", "array-contains", filterData.type);
    }

    if (filterData.location && filterData.location.length) {
      query = query.where("location", "array-contains", filterData.location);
    }

    if (filterData.section) {
      query = query.where("section", "==", filterData.section);
    }

    try {
      const querySnapshot = await query.get();
      let results = querySnapshot.docs.map((doc) => doc.data());
      return results;
    } catch (error) {
      console.error("Erro ao buscar documentos: ", error);
      return [];
    }
  },
};

export default BedsService;
