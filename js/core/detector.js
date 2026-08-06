/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/detector.js
 *
 * Detects report structure and maps columns.
 * ============================================================================
 */

import {

    GDS,
    COLUMN_ALIASES,
    REPORT_SIGNATURES,
    PARSER

} from "./config.js";

import {

    normalizeText

} from "./utils/helpers.js";


/* ============================================================================
   HEADER SEARCH
============================================================================ */

/**
 * Finds the header row by scanning the first
 * configured number of rows.
 *
 * @param {Array<Array>} rows
 * @returns {number}
 */
export function detectHeaderRow(rows){

    const limit = Math.min(

        rows.length,

        PARSER.HEADER_SCAN_LIMIT

    );

    for(let rowIndex = 0; rowIndex < limit; rowIndex++){

        const row = rows[rowIndex];

        if(!Array.isArray(row)){

            continue;

        }

        const normalized = row.map(normalizeText);

        if(

            normalized.some(value =>

                COLUMN_ALIASES.ticket.includes(value)

            )

        ){

            return rowIndex;

        }

    }

    return -1;

}


/* ============================================================================
   COLUMN MAP
============================================================================ */

/**
 * Maps logical field names to
 * actual spreadsheet column indexes.
 *
 * @param {Array<string>} headers
 * @returns {Object}
 */
export function mapColumns(headers){

    const map = {};

    Object.entries(COLUMN_ALIASES).forEach(

        ([field, aliases]) => {

            const index = headers.findIndex(header =>

                aliases.includes(

                    normalizeText(header)

                )

            );

            map[field] = index;

        }

    );

    return map;

}


/* ============================================================================
   PROVIDER DETECTION
============================================================================ */

/**
 * Detects report provider.
 *
 * @param {Array<string>} headers
 * @returns {string}
 */
export function detectProvider(headers){

    const normalized = headers.map(normalizeText);

    for(const [provider, config] of Object.entries(REPORT_SIGNATURES)){

        const matched = config.required.every(required =>

            normalized.includes(required)

        );

        if(matched){

            return provider;

        }

    }

    return GDS.UNKNOWN;

}


/* ============================================================================
   VALIDATION
============================================================================ */

/**
 * Validates that mandatory columns exist.
 *
 * @param {Object} columnMap
 * @returns {{valid:boolean,message:string}}
 */
export function validateColumns(columnMap){

    if(columnMap.ticket < 0){

        return{

            valid:false,

            message:"Ticket column not found."

        };

    }

    return{

        valid:true,

        message:""

    };

}


/* ============================================================================
   REPORT DETECTION
============================================================================ */

/**
 * Detects report metadata.
 *
 * @param {Array<Array>} rows
 * @returns {Object}
 */
export function detectReport(rows){

    const headerRow = detectHeaderRow(rows);

    if(headerRow < 0){

        return{

            valid:false,

            message:"Unable to locate the report header row."

        };

    }

    const headers = rows[headerRow];

    const provider = detectProvider(headers);

    const columns = mapColumns(headers);

    const validation = validateColumns(columns);

    if(!validation.valid){

        return validation;

    }

    return{

        valid:true,

        provider,

        headerRow,

        headers,

        columns

    };

}
