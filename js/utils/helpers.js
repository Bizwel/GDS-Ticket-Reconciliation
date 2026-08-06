/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/utils/helpers.js
 *
 * Generic helper functions.
 * ============================================================================
 */

/* ============================================================================
   STRINGS
============================================================================ */

/**
 * Safely converts any value to string.
 *
 * @param {*} value
 * @returns {string}
 */
export function toString(value){

    if(value === null || value === undefined){

        return "";

    }

    return String(value);

}


/**
 * Trims text safely.
 *
 * @param {*} value
 * @returns {string}
 */
export function cleanText(value){

    return toString(value)

        .replace(/\u00A0/g," ")

        .replace(/\r/g,"")

        .replace(/\n/g," ")

        .replace(/\t/g," ")

        .replace(/\s+/g," ")

        .trim();

}


/**
 * Lowercase safely.
 *
 * @param {*} value
 * @returns {string}
 */
export function normalizeText(value){

    return cleanText(value)

        .toLowerCase();

}


/**
 * Uppercase safely.
 *
 * @param {*} value
 * @returns {string}
 */
export function upper(value){

    return cleanText(value)

        .toUpperCase();

}


/* ============================================================================
   ARRAYS
============================================================================ */

/**
 * Removes empty worksheet rows.
 *
 * @param {Array[]} rows
 * @returns {Array[]}
 */
export function removeEmptyRows(rows){

    return rows.filter(row=>{

        if(!Array.isArray(row)){

            return false;

        }

        return row.some(cell=>

            cleanText(cell)!==""

        );

    });

}


/**
 * Removes duplicate values.
 *
 * @param {Array} array
 * @returns {Array}
 */
export function unique(array){

    return [...new Set(array)];

}


/* ============================================================================
   OBJECTS
============================================================================ */

/**
 * Deep clone.
 *
 * @param {*} value
 * @returns {*}
 */
export function clone(value){

    return structuredClone(value);

}


/**
 * Freeze object.
 *
 * @param {*} object
 * @returns {*}
 */
export function freeze(object){

    return Object.freeze(object);

}


/* ============================================================================
   NUMBERS
============================================================================ */

/**
 * Safe integer.
 *
 * @param {*} value
 * @returns {number}
 */
export function toInteger(value){

    const number =

        parseInt(value,10);

    return Number.isNaN(number)

        ? 0

        : number;

}


/**
 * Safe decimal.
 *
 * @param {*} value
 * @returns {number}
 */
export function toFloat(value){

    const number =

        parseFloat(value);

    return Number.isNaN(number)

        ? 0

        : number;

}


/* ============================================================================
   DATES
============================================================================ */

/**
 * Formats Date.
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date){

    if(!(date instanceof Date)){

        return "";

    }

    return date

        .toISOString()

        .split("T")[0];

}


/**
 * Timestamp.
 *
 * @returns {string}
 */
export function timestamp(){

    const now = new Date();

    return now

        .toISOString()

        .replace(/:/g,"-");

}


/* ============================================================================
   VALUES
============================================================================ */

/**
 * Empty?
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value){

    return cleanText(value)==="";

}


/**
 * Null?
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isNull(value){

    return value===null ||

           value===undefined;

}
