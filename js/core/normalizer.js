/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/normalizer.js
 * Description:
 * Ticket, passenger, status and date normalization.
 * ============================================================
 */

import { STATUS } from "./config.js";
import { cleanText, formatDate } from "./utils.js";

/* ============================================================
   TICKET NORMALIZATION
============================================================ */

/**
 * Normalizes ticket numbers across all supported GDS reports.
 *
 * Supported formats:
 *
 * 157-4854655725
 * 071 2617231413
 * 0712617231413
 * 071-2617231413
 * 071 2617231450-451
 * 4870106265
 *
 * Returns:
 * 4854655725
 * 2617231413
 * 2617231413
 * 2617231413
 * 2617231450
 * 4870106265
 *
 * @param {*} ticket
 * @returns {string}
 */
export function normalizeTicket(ticket) {

    let value = cleanText(ticket);

    if (!value) {
        return "";
    }

    // Remove spaces
    value = value.replace(/\s+/g, "");

    // Remove invisible characters
    value = value.replace(/[^\d-]/g, "");

    // Remove exchange suffix
    // Example:
    // 0712617231450-451
    value = value.replace(/-\d+$/, "");

    // Remove airline prefix with dash
    // Example:
    // 157-4854655725
    value = value.replace(/^\d{3}-/, "");

    // Remove airline prefix without dash
    // Example:
    // 0712617231413
    if (/^\d{13}$/.test(value)) {

        value = value.substring(3);

    }

    return value;

}

/* ============================================================
   ORIGINAL TICKET
============================================================ */

/**
 * Preserves the ticket exactly as supplied.
 *
 * @param {*} ticket
 * @returns {string}
 */
export function originalTicket(ticket) {

    return cleanText(ticket);

}

/* ============================================================
   PASSENGER
============================================================ */

/**
 * Standardizes passenger names.
 *
 * @param {*} passenger
 * @returns {string}
 */
export function normalizePassenger(passenger) {

    return cleanText(passenger)
        .replace(/\s+/g, " ")
        .toUpperCase();

}

/* ============================================================
   STATUS
============================================================ */

/**
 * Normalizes status.
 *
 * @param {*} status
 * @returns {string}
 */
export function normalizeStatus(status) {

    return cleanText(status)
        .toUpperCase();

}

/**
 * Returns true if record is VOID.
 *
 * @param {*} status
 * @returns {boolean}
 */
export function isVoid(status) {

    return normalizeStatus(status) === STATUS.VOID;

}

/* ============================================================
   AIRLINE
============================================================ */

/**
 * Normalizes airline code.
 *
 * @param {*} airline
 * @returns {string}
 */
export function normalizeAirline(airline) {

    return cleanText(airline)
        .toUpperCase();

}

/* ============================================================
   CONSULTANT
============================================================ */

/**
 * Normalizes consultant name.
 *
 * @param {*} consultant
 * @returns {string}
 */
export function normalizeConsultant(consultant) {

    return cleanText(consultant)
        .replace(/\s+/g, " ");

}

/* ============================================================
   DATE
============================================================ */

/**
 * Normalizes issue date.
 *
 * @param {*} value
 * @returns {string}
 */
export function normalizeIssueDate(value) {

    return formatDate(value);

}

/* ============================================================
   RECORD
============================================================ */

/**
 * Returns a normalized reconciliation record.
 *
 * @param {Object} record
 * @returns {Object}
 */
export function normalizeRecord(record) {

    return {

        originalTicket:
            originalTicket(record.ticket),

        ticket:
            normalizeTicket(record.ticket),

        passenger:
            normalizePassenger(record.passenger),

        airline:
            normalizeAirline(record.airline),

        consultant:
            normalizeConsultant(record.consultant),

        issueDate:
            normalizeIssueDate(record.issueDate),

        status:
            normalizeStatus(record.status),

        source:
            cleanText(record.source),

        originalRow:
            record.originalRow

    };

}
