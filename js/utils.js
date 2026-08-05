/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/utils.js
 * Description:
 * Common utility/helper functions used throughout the application.
 * ============================================================
 */

import { REPORT } from "./config.js";

/* ============================================================
   STRING UTILITIES
============================================================ */

/**
 * Cleans and normalizes text.
 * @param {*} value
 * @returns {string}
 */
export function cleanText(value) {

    if (value === null || value === undefined) {
        return REPORT.EMPTY_CELL;
    }

    return value
        .toString()
        .replace(/\u00A0/g, " ")
        .replace(/\r/g, "")
        .replace(/\n/g, "")
        .replace(/\t/g, " ")
        .trim();

}

/**
 * Converts text to lowercase safely.
 * @param {*} value
 * @returns {string}
 */
export function normalizeText(value) {

    return cleanText(value).toLowerCase();

}

/* ============================================================
   ARRAY UTILITIES
============================================================ */

/**
 * Removes completely empty rows.
 * @param {Array[]} rows
 * @returns {Array[]}
 */
export function removeEmptyRows(rows) {

    return rows.filter(row => {

        if (!Array.isArray(row)) {
            return false;
        }

        return row.some(cell => cleanText(cell) !== "");

    });

}

/**
 * Returns true if value is empty.
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value) {

    return cleanText(value) === "";

}

/* ============================================================
   CELL UTILITIES
============================================================ */

/**
 * Safely returns a cell value.
 * @param {Array} row
 * @param {number} index
 * @returns {string}
 */
export function getCell(row, index) {

    if (!row) {
        return REPORT.EMPTY_CELL;
    }

    if (index < 0) {
        return REPORT.EMPTY_CELL;
    }

    return cleanText(row[index]);

}

/* ============================================================
   COLUMN UTILITIES
============================================================ */

/**
 * Finds a column index using aliases.
 * @param {string[]} headers
 * @param {string[]} aliases
 * @returns {number}
 */
export function findColumn(headers, aliases) {

    const normalizedHeaders = headers.map(normalizeText);

    for (const alias of aliases) {

        const index = normalizedHeaders.indexOf(
            alias.toLowerCase()
        );

        if (index >= 0) {
            return index;
        }

    }

    return -1;

}

/* ============================================================
   DATE UTILITIES
============================================================ */

/**
 * Formats any supported date value.
 * @param {*} value
 * @returns {string}
 */
export function formatDate(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return cleanText(value);
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

/* ============================================================
   FILE UTILITIES
============================================================ */

/**
 * Returns file extension.
 * @param {string} filename
 * @returns {string}
 */
export function getFileExtension(filename) {

    return filename
        .split(".")
        .pop()
        .toLowerCase();

}

/**
 * Generates timestamp for exports.
 * @returns {string}
 */
export function generateTimestamp() {

    const now = new Date();

    const yyyy = now.getFullYear();

    const mm = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const dd = String(
        now.getDate()
    ).padStart(2, "0");

    const hh = String(
        now.getHours()
    ).padStart(2, "0");

    const min = String(
        now.getMinutes()
    ).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}_${hh}-${min}`;

}

/* ============================================================
   DOWNLOAD UTILITIES
============================================================ */

/**
 * Downloads a Blob.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}

/* ============================================================
   OBJECT UTILITIES
============================================================ */

/**
 * Deep clones an object.
 * @param {*} value
 * @returns {*}
 */
export function deepClone(value) {

    return structuredClone(value);

}

/* ============================================================
   LOGGING
============================================================ */

const DEBUG = true;

/**
 * Debug logger.
 * @param  {...any} args
 */
export function log(...args) {

    if (DEBUG) {

        console.log(...args);

    }

}

/**
 * Error logger.
 * @param {*} error
 */
export function logError(error) {

    console.error(error);

}

/* ============================================================
   ASYNC UTILITIES
============================================================ */

/**
 * Small delay.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}
