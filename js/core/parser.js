/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/parser.js
 *
 * Reads and converts uploaded reports into the canonical dataset.
 * ============================================================================
 */

import {

    loadRows

} from "./utils/excel.js";

import {

    detectReport

} from "./detector.js";

import {

    normalizeRecord

} from "./normalizer.js";

import {

    GDS,
    STATUS

} from "./config.js";

import {

    log

} from "./utils/logger.js";


/* ============================================================================
   DATASET BUILDER
============================================================================ */

/**
 * Creates an empty dataset.
 *
 * @returns {Object}
 */
function createDataset() {

    return {

        provider: GDS.UNKNOWN,

        reportName: "",

        sheetName: "",

        headers: [],

        columnMap: {},

        records: [],

        voidRecords: [],

        duplicateGroups: [],

        diagnostics: {

    provider: "",

    reportName: "",

    sheetName: "",

    headerRow: 0,

    ticketColumn: "",

    recordsRead: 0,

    activeRecords: 0,

    voidRecords: 0,

    duplicateGroups: 0,

    duplicateTickets: 0,

    processingTime: 0

}

    };

}


/* ============================================================================
   DUPLICATE INDEX
============================================================================ */

/**
 * Builds an index of tickets.
 *
 * @returns {Map<string, Array<Object>>}
 */
function createDuplicateIndex() {

    return new Map();

}


/**
 * Adds a record to the duplicate index.
 *
 * @param {Map} index
 * @param {Object} record
 */
function addToDuplicateIndex(index, record) {

    if (!index.has(record.ticket)) {

        index.set(record.ticket, []);

    }

    index.get(record.ticket).push(record);

}


/**
 * Extracts duplicate groups.
 *
 * @param {Map} index
 * @returns {Array<Array<Object>>}
 */
function buildDuplicateGroups(index) {

    return [...index.values()]

        .filter(group => group.length > 1);

}


/* ============================================================================
   CANONICAL RECORD
============================================================================ */

/**
 * Builds a canonical record from one spreadsheet row.
 *
 * @param {Array} row
 * @param {Object} context
 * @returns {Object}
 */

/**
 * Builds a canonical record.
 *
 * @param {Object} options
 * @returns {Object}
 */
function buildRecord({

    row,

    columnMap,

    headers,

    provider,

    rowNumber

}) {

    const raw = {};

    headers.forEach((header, index) => {

        raw[header] = row[index] ?? "";

    });

    const fields = extractFields(

        row,

        columnMap

    );

    return normalizeRecord({

        id: `${provider}-${rowNumber}`,

        ticket: "",

        ...fields,

        provider,

        reportName: "",

        sheetName: "",

        sourceRow: rowNumber,

        duplicate: false,

        duplicateGroup: null,

        reason: "",

        raw

    });

}
/* ============================================================================
   DATASET PROCESSOR
============================================================================ */

/**
 * Processes spreadsheet rows into a canonical dataset.
 *
 * @param {Array<Array>} rows
 * @returns {Object}
 */
function processRows(rows){

    const started = performance.now();

    const dataset = createDataset();

    const report = detectReport(rows);

    if(!report.valid){

        throw new Error(report.message);

 }

      const {

    provider,

    headers,

    columns,

    headerRow

} = report;

    dataset.diagnostics.provider = provider;

    dataset.diagnostics.ticketColumn =

    headers[columns.ticket] ?? "";

    dataset.provider = provider;

    dataset.headers = headers;
    
    dataset.columnMap = columns;
    
    dataset.diagnostics.headerRow = headerRow;

    const duplicateIndex = createDuplicateIndex();

   for (

    let rowIndex = headerRow + 1;

    rowIndex < rows.length;

    rowIndex++

) {

    const row = rows[rowIndex];

    if (!row) {

        continue;

    }

    const record = buildRecord({

        row,

        columnMap: columns,

        headers,

        provider,

        rowNumber: rowIndex + 1

    });

    dataset.diagnostics.recordsRead++;

    // Continue processing...
}

        dataset.diagnostics.recordsRead++;

        /* ----------------------------------------
           VOID
        ----------------------------------------- */

        if(record.status === STATUS.VOID){

            dataset.voidRecords.push(record);

            dataset.diagnostics.voidRecords++;

            continue;

        }

        /* ----------------------------------------
           ACTIVE RECORD
        ----------------------------------------- */

        dataset.records.push(record);

        dataset.diagnostics.activeRecords++;

        addToDuplicateIndex(

            duplicateIndex,

            record

        );

    }

    dataset.duplicateGroups =

        buildDuplicateGroups(

            duplicateIndex

        );

});

    dataset.duplicateGroups.forEach(group => {

    group.records.forEach(record => {

        record.duplicate = true;

        record.duplicateGroup = group.ticket;

    });



    dataset.diagnostics.duplicateGroups =

        dataset.duplicateGroups.length;

    dataset.diagnostics.processingTime =

        Number(

            (

                performance.now()

                -

                started

            ).toFixed(2)

        );

    log(

        "Parser completed",

        dataset

    );

    return dataset;

}
/* ============================================================================
   FIELD EXTRACTION
============================================================================ */

/**
 * Extracts logical fields from a spreadsheet row.
 *
 * @param {Array} row
 * @param {Object} columnMap
 * @returns {Object}
 */
function extractFields(row, columnMap){

    return {

        originalTicket:

            row[columnMap.ticket] ?? "",

        passenger:

            row[columnMap.passenger] ?? "",

        airline:

            row[columnMap.airline] ?? "",

        route:

            row[columnMap.route] ?? "",

        issueDate:

            row[columnMap.issueDate] ?? "",

        consultant:

            row[columnMap.consultant] ?? "",

        status:

            row[columnMap.status] ?? ""

    };

}


/* ============================================================================
   PUBLIC API
============================================================================ */

/**
 * Parses an uploaded report file into the
 * canonical dataset.
 *
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function parseFile(file){

    const {

    rows,

    sheetName

} = await loadRows(file);

    if(!rows.length){

        throw new Error(

            "The uploaded report contains no data."

        );

    }

   const dataset = processRows(rows);

    dataset.reportName = file.name;

    dataset.sheetName = sheetName;
    dataset.diagnostics.reportName =
    dataset.reportName;
    dataset.diagnostics.sheetName =
    dataset.sheetName;
    return dataset;

}
