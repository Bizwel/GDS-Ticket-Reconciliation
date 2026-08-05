/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/parser.js
 * Description:
 * Reads Excel/CSV files and converts them into
 * normalized reconciliation records.
 * ============================================================
 */

import { GDS_TYPES } from "./config.js";

import {
    getFileExtension,
    removeEmptyRows,
    cleanText
} from "./utils.js";

import {
    buildSchema,
    logSchema
} from "./detector.js";

import {
    normalizeRecord,
    isVoid
} from "./normalizer.js";


/* ============================================================
   PUBLIC API
============================================================ */

/**
 * Parses any supported report.
 *
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function parseReport(file){

    if(!file){

        throw new Error(
            "No report selected."
        );

    }

    const rows =
        await readReport(file);

    const cleanedRows =
        removeEmptyRows(rows);

    const schema =
        buildSchema(cleanedRows);

    logSchema(schema);

    return parseRows(
        cleanedRows,
        schema
    );

}


/* ============================================================
   FILE READER
============================================================ */

/**
 * Reads Excel or CSV.
 *
 * @param {File} file
 * @returns {Promise<Array[]>}
 */
async function readReport(file){

    const extension =
        getFileExtension(file.name);

    switch(extension){

        case "csv":

            return await readCSV(file);

        case "xls":

        case "xlsx":

            return await readExcel(file);

        default:

            throw new Error(

                "Unsupported file format."

            );

    }

}


/* ============================================================
   EXCEL
============================================================ */

function readExcel(file){

    return new Promise(

        (resolve,reject)=>{

            const reader =
                new FileReader();

            reader.onload=e=>{

                try{

                    const workbook=
                        XLSX.read(

                            e.target.result,

                            {
                                type:"array"
                            }

                        );

                    const firstSheet=

                        workbook.SheetNames[0];

                    const worksheet=

                        workbook.Sheets[firstSheet];

                    const rows=

                        XLSX.utils.sheet_to_json(

                            worksheet,

                            {

                                header:1,

                                raw:false,

                                defval:""

                            }

                        );

                    resolve(rows);

                }

                catch(error){

                    reject(error);

                }

            };

            reader.onerror=reject;

            reader.readAsArrayBuffer(file);

        }

    );

}


/* ============================================================
   CSV
============================================================ */

function readCSV(file){

    return new Promise(

        (resolve,reject)=>{

            Papa.parse(

                file,

                {

                    skipEmptyLines:true,

                    complete:results=>{

                        resolve(results.data);

                    },

                    error:error=>{

                        reject(error);

                    }

                }

            );

        }

    );

}


/* ============================================================
   ROW PARSER
============================================================ */

/**
 * Converts worksheet rows into reconciliation records.
 *
 * Remaining implementation
 * continues in Part 2.
 *
 * @param {Array[]} rows
 * @param {Object} schema
 */
function parseRows(rows,schema){

    const {

        reportType,

        headerRow,

        columnMap

    } = schema;

    return {

        reportType,

        records:[],

        duplicates:[],

        voidRecords:[],

        headerRow,

        columnMap,

        rows

    };

}

/* ============================================================
   RAW ROW BUILDER
============================================================ */

/**
 * Converts a worksheet row into an object using
 * the detected headers.
 *
 * @param {Array} row
 * @param {Array} headers
 * @returns {Object}
 */
function buildRawRow(row, headers) {

    const raw = {};

    headers.forEach((header, index) => {

        raw[cleanText(header)] = cleanText(row[index]);

    });

    return raw;

}


/* ============================================================
   RECORD BUILDER
============================================================ */

/**
 * Builds a normalized reconciliation record.
 *
 * @param {Array} row
 * @param {Object} schema
 * @returns {Object}
 */
function buildRecord(row, schema) {

    const {

        reportType,

        headers,

        columnMap

    } = schema;

    const record = {

        ticket:
            row[columnMap.ticket],

        passenger:
            columnMap.passenger >= 0
                ? row[columnMap.passenger]
                : "",

        issueDate:
            columnMap.issueDate >= 0
                ? row[columnMap.issueDate]
                : "",

        airline:
            columnMap.airline >= 0
                ? row[columnMap.airline]
                : "",

        consultant:
            columnMap.consultant >= 0
                ? row[columnMap.consultant]
                : "",

        status:
            columnMap.status >= 0
                ? row[columnMap.status]
                : "",

        source:
            reportType,

        raw:
            buildRawRow(
                row,
                headers
            )

    };

    return normalizeRecord(record);

}


/* ============================================================
   DUPLICATE DETECTOR
============================================================ */

/**
 * Returns true if ticket already exists.
 *
 * @param {Map} index
 * @param {string} ticket
 * @returns {boolean}
 */
function isDuplicate(index, ticket) {

    return index.has(ticket);

}


/* ============================================================
   RECORD PROCESSOR
============================================================ */

function processRows(rows, schema) {

    const {

        headerRow

    } = schema;

    const records = [];

    const duplicates = [];

    const voidRecords = [];

    const ticketIndex = new Map();

    for (

        let rowIndex = headerRow + 1;

        rowIndex < rows.length;

        rowIndex++

    ) {

        const row = rows[rowIndex];

        if (!row) {

            continue;

        }

        const record = buildRecord(
            row,
            schema
        );

        /* Skip rows with no ticket */

        if (!record.ticket) {

            continue;

        }

        /* VOID */

        if (isVoid(record.status)) {

            voidRecords.push(record);

            continue;

        }

        /* DUPLICATE */

        if (

            isDuplicate(
                ticketIndex,
                record.ticket
            )

        ) {

            duplicates.push(record);

            continue;

        }

        ticketIndex.set(

            record.ticket,

            record

        );

        records.push(record);

    }

    return {

        records,

        duplicates,

        voidRecords

    };

}

/* ============================================================
   ROW PARSER
============================================================ */

/**
 * Parses worksheet rows into normalized reconciliation data.
 *
 * @param {Array[]} rows
 * @param {Object} schema
 * @returns {Object}
 */
function parseRows(rows, schema) {

    const {

        reportType,

        headerRow,

        headers,

        columnMap

    } = schema;

    const {

        records,

        duplicates,

        voidRecords

    } = processRows(

        rows,

        schema

    );

    return {

        reportType,

        headerRow,

        headers,

        columnMap,

        totalRows:

            rows.length,

        processedRows:

            records.length,

        duplicateCount:

            duplicates.length,

        voidCount:

            voidRecords.length,

        records,

        duplicates,

        voidRecords

    };

}
