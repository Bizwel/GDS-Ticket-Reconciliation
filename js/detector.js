/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/detector.js
 * Description:
 * Detects report type, header row and column mappings.
 * ============================================================
 */

import { COLUMN_ALIASES, GDS_TYPES, REPORT } from "./config.js";
import { cleanText, normalizeText, findColumn } from "./utils.js";

/* ============================================================
   HEADER DETECTION
============================================================ */

/**
 * Detects the header row by scoring the first N rows.
 *
 * @param {Array[]} rows
 * @returns {number}
 */
export function detectHeaderRow(rows) {

    let bestRow = -1;
    let bestScore = 0;

    const scanLimit = Math.min(
        rows.length,
        REPORT.HEADER_SCAN_LIMIT
    );

    for (let rowIndex = 0; rowIndex < scanLimit; rowIndex++) {

        const row = rows[rowIndex];

        if (!Array.isArray(row)) {
            continue;
        }

        let score = 0;

        row.forEach(cell => {

            const value = normalizeText(cell);

            Object.values(COLUMN_ALIASES).forEach(aliasList => {

                if (aliasList.includes(value)) {
                    score++;
                }

            });

        });

        if (score > bestScore) {

            bestScore = score;
            bestRow = rowIndex;

        }

    }

    if (bestRow === -1) {

        throw new Error(
            "Unable to detect the report header row."
        );

    }

    return bestRow;

}

/* ============================================================
   REPORT TYPE DETECTION
============================================================ */

/**
 * Determines the report type.
 *
 * @param {string[]} headers
 * @returns {string}
 */
export function detectReportType(headers) {

    const normalized = headers.map(normalizeText);

    let sabreScore = 0;
    let galileoScore = 0;
    let amadeusScore = 0;

    normalized.forEach(header => {

        if (header === "ticket #") {
            sabreScore++;
        }

        if (header === "number") {
            galileoScore++;
        }

        if (header === "no") {
            amadeusScore++;
        }

    });

    if (
        sabreScore >= galileoScore &&
        sabreScore >= amadeusScore &&
        sabreScore > 0
    ) {
        return GDS_TYPES.SABRE;
    }

    if (
        galileoScore >= sabreScore &&
        galileoScore >= amadeusScore &&
        galileoScore > 0
    ) {
        return GDS_TYPES.GALILEO;
    }

    if (
        amadeusScore > 0
    ) {
        return GDS_TYPES.AMADEUS;
    }

    return GDS_TYPES.SYSTEM;

}

/* ============================================================
   COLUMN MAP
============================================================ */

/**
 * Builds a dynamic column map.
 *
 * @param {string[]} headers
 * @returns {Object}
 */
export function buildColumnMap(headers) {

    return {

        ticket:
            findColumn(
                headers,
                COLUMN_ALIASES.ticket
            ),

        status:
            findColumn(
                headers,
                COLUMN_ALIASES.status
            ),

        passenger:
            findColumn(
                headers,
                COLUMN_ALIASES.passenger
            ),

        issueDate:
            findColumn(
                headers,
                COLUMN_ALIASES.issueDate
            ),

        airline:
            findColumn(
                headers,
                COLUMN_ALIASES.airline
            ),

        consultant:
            findColumn(
                headers,
                COLUMN_ALIASES.consultant
            )

    };

}

/* ============================================================
   VALIDATION
============================================================ */

/**
 * Validates mandatory columns.
 *
 * @param {Object} columnMap
 */
export function validateColumnMap(columnMap) {

    if (columnMap.ticket === -1) {

        throw new Error(
            "Unable to locate the Ticket Number column."
        );

    }

}

/* ============================================================
   SCHEMA
============================================================ */

/**
 * Builds the report schema.
 *
 * @param {Array[]} rows
 * @returns {Object}
 */
export function buildSchema(rows) {

    const headerRow =
        detectHeaderRow(rows);

    const headers =
        rows[headerRow].map(cleanText);

    const reportType =
        detectReportType(headers);

    const columnMap =
        buildColumnMap(headers);

    validateColumnMap(columnMap);

    return {

        reportType,

        headerRow,

        headers,

        columnMap

    };

}

/* ============================================================
   LOG
============================================================ */

/**
 * Writes schema information to the console.
 *
 * @param {Object} schema
 */
export function logSchema(schema) {

    console.group("Detected Report");

    console.log(
        "Report Type:",
        schema.reportType
    );

    console.log(
        "Header Row:",
        schema.headerRow
    );

    console.table(schema.columnMap);

    console.groupEnd();

}
