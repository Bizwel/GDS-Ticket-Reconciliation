/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/exporter.js
 * Description:
 * Handles Excel and CSV exports.
 * ============================================================
 */

import {

    EXPORT_SHEETS

} from "./config.js";

import {

    generateTimestamp,

    downloadBlob

} from "./utils.js";


/* ============================================================
   PRIVATE HELPERS
============================================================ */

/**
 * Converts reconciliation records to exportable rows.
 *
 * @param {Array<Object>} records
 * @returns {Array<Object>}
 */
function prepareRows(records = []) {

    return records.map(record => ({

        "Ticket Number":

            record.originalTicket ??
            record.ticket,

        Passenger:

            record.passenger ?? "",

        "Issue Date":

            record.issueDate ?? "",

        Airline:

            record.airline ?? "",

        Consultant:

            record.consultant ?? "",

        Source:

            record.source ?? "",

        Status:

            record.status ?? "",

        Reason:

            record.reason ?? ""

    }));

}


/**
 * Creates a worksheet.
 *
 * @param {Array<Object>} rows
 * @returns {Object}
 */
function createWorksheet(rows){

    return XLSX.utils.json_to_sheet(

        rows,

        {

            skipHeader:false

        }

    );

}


/**
 * Adds a worksheet to a workbook.
 *
 * @param {Object} workbook
 * @param {string} name
 * @param {Array<Object>} rows
 */
function appendSheet(
    workbook,
    name,
    rows
){

    const sheet =

        createDynamicWorksheet(rows);

    XLSX.utils.book_append_sheet(

        workbook,

        sheet,

        name

    );

}

/* ============================================================
   WORKBOOK
============================================================ */

/**
 * Creates a workbook with document properties.
 *
 * @returns {Object}
 */
function createWorkbook() {

    const workbook = XLSX.utils.book_new();

    workbook.Props = {

        Title: "GDS Ticket Reconciliation",

        Subject: "Ticket Reconciliation Report",

        Author: "Business Well Technologies",

        CreatedDate: new Date()

    };

    return workbook;

}


/* ============================================================
   SUMMARY SHEET
============================================================ */

/**
 * Creates summary worksheet.
 *
 * @param {Object} summary
 * @returns {Object}
 */
function createSummarySheet(summary) {

    const rows = [

        {

            Metric: "GDS Records",

            Value: summary.gdsRecords

        },

        {

            Metric: "System Records",

            Value: summary.systemRecords

        },

        {

            Metric: "Matched",

            Value: summary.matched

        },

        {

            Metric: "Missing in System",

            Value: summary.missingSystem

        },

        {

            Metric: "Missing in GDS",

            Value: summary.missingGDS

        },

        {

            Metric: "Duplicate GDS",

            Value: summary.duplicateGDS

        },

        {

            Metric: "Duplicate System",

            Value: summary.duplicateSystem

        },

        {

            Metric: "VOID GDS",

            Value: summary.voidGDS

        },

        {

            Metric: "VOID System",

            Value: summary.voidSystem

        }

    ];

    return XLSX.utils.json_to_sheet(rows);

}


/* ============================================================
   PUBLIC API
============================================================ */

/**
 * Exports reconciliation results to Excel.
 *
 * @param {Object} reconciliation
 */
export function exportToExcel(reconciliation) {

    const workbook = createWorkbook();

    XLSX.utils.book_append_sheet(

        workbook,

        createSummarySheet(

            reconciliation.summary

        ),

        EXPORT_SHEETS.SUMMARY

    );

    appendSheet(

        workbook,

        EXPORT_SHEETS.MISSING_SYSTEM,

        reconciliation.missingSystem

    );

    appendSheet(

        workbook,

        EXPORT_SHEETS.MISSING_GDS,

        reconciliation.missingGDS

    );

    appendSheet(

        workbook,

        "Duplicate GDS",

        reconciliation.duplicateGDS

    );

    appendSheet(

        workbook,

        "Duplicate System",

        reconciliation.duplicateSystem

    );

    appendSheet(

        workbook,

        "VOID GDS",

        reconciliation.voidGDS

    );

    appendSheet(

        workbook,

        "VOID System",

        reconciliation.voidSystem

    );

    XLSX.writeFile(

        workbook,

        `Reconciliation_${generateTimestamp()}.xlsx`

    );

}

/* ============================================================
   DYNAMIC EXPORT ROW
============================================================ */

/**
 * Converts a reconciliation record into an export row.
 *
 * Standard reconciliation fields are placed first,
 * followed by all original spreadsheet columns.
 *
 * @param {Object} record
 * @returns {Object}
 */
function buildExportRow(record) {

    return {

        "Ticket Number":

            record.originalTicket ??
            record.ticket,

        "Normalized Ticket":

            record.ticket,

        Passenger:

            record.passenger ?? "",

        Airline:

            record.airline ?? "",

        "Issue Date":

            record.issueDate ?? "",

        Consultant:

            record.consultant ?? "",

        Source:

            record.source ?? "",

        Status:

            record.status ?? "",

        Reason:

            record.reason ?? "",

        ...(record.raw || {})

    };

}


/* ============================================================
   AUTO COLUMN WIDTH
============================================================ */

/**
 * Automatically sizes worksheet columns.
 *
 * @param {Object} worksheet
 * @param {Array<Object>} rows
 */
function autoFitColumns(worksheet, rows) {

    if (!rows.length) {

        return;

    }

    const keys = Object.keys(rows[0]);

    worksheet["!cols"] = keys.map(key => {

        let width = key.length;

        rows.forEach(row => {

            const value = String(

                row[key] ?? ""

            );

            width = Math.max(

                width,

                value.length

            );

        });

        return {

            wch: Math.min(

                width + 2,

                40

            )

        };

    });

}


/* ============================================================
   OVERRIDE SHEET CREATION
============================================================ */

/**
 * Creates a worksheet with dynamic columns.
 *
 * @param {Array<Object>} records
 * @returns {Object}
 */
function createDynamicWorksheet(records) {

    const rows = records.map(

        buildExportRow

    );

    const worksheet =

        XLSX.utils.json_to_sheet(

            rows

        );

    autoFitColumns(

        worksheet,

        rows

    );

    return worksheet;

}


/* ============================================================
   CSV EXPORT
============================================================ */

/**
 * Exports records to CSV.
 *
 * @param {Array<Object>} records
 * @param {String} filename
 */
export function exportToCSV(

    records,

    filename = "Export"

) {

    const rows =

        records.map(

            buildExportRow

        );

    const worksheet =

        XLSX.utils.json_to_sheet(

            rows

        );

    const csv =

        XLSX.utils.sheet_to_csv(

            worksheet

        );

    const blob =

        new Blob(

            [csv],

            {

                type:"text/csv;charset=utf-8"

            }

        );

    downloadBlob(

        blob,

        `${filename}_${generateTimestamp()}.csv`

    );

}
