/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/utils/excel.js
 *
 * Excel and CSV helper functions.
 * ============================================================================
 */

import {

    getExtension

} from "../validator.js";

import {

    removeEmptyRows

} from "./helpers.js";

/* ============================================================================
   FILE READER
============================================================================ */

/**
 * Reads a browser File as ArrayBuffer.
 *
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
export function readFile(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload =

            event=>resolve(

                event.target.result

            );

        reader.onerror =

            reject;

        reader.readAsArrayBuffer(file);

    });

}

/* ============================================================================
   WORKBOOK
============================================================================ */

/**
 * Opens Excel workbook.
 *
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function openWorkbook(file){

    const buffer =

        await readFile(file);

    return XLSX.read(

        buffer,

        {

            type:"array",

            cellDates:true

        }

    );

}

/* ============================================================================
   SHEETS
============================================================================ */

/**
 * Returns worksheet names.
 *
 * @param {Object} workbook
 * @returns {string[]}
 */
export function getSheetNames(workbook){

    return workbook.SheetNames;

}

/**
 * Returns worksheet object.
 *
 * @param {Object} workbook
 * @param {string} sheet
 * @returns {Object}
 */
export function getWorksheet(

    workbook,

    sheet

){

    return workbook.Sheets[sheet];

}

/* ============================================================================
   ROWS
============================================================================ */

/**
 * Converts worksheet into row arrays.
 *
 * @param {Object} worksheet
 * @returns {Array[]}
 */
export function worksheetToRows(worksheet){

    const rows =

        XLSX.utils.sheet_to_json(

            worksheet,

            {

                header:1,

                defval:"",

                raw:false,

                blankrows:false

            }

        );

    return removeEmptyRows(rows);

}

/**
 * Returns rows from first worksheet.
 *
 * @param {Object} workbook
 * @returns {Array[]}
 */
export function firstSheetRows(workbook){

    const first =

        workbook.SheetNames[0];

    return worksheetToRows(

        workbook.Sheets[first]

    );

}

/* ============================================================================
   CSV
============================================================================ */

/**
 * Reads CSV file.
 *
 * @param {File} file
 * @returns {Promise<Array[]>}
 */
export function openCSV(file){

    return new Promise((resolve,reject)=>{

        Papa.parse(

            file,

            {

                skipEmptyLines:true,

                complete(results){

                    resolve(

                        removeEmptyRows(

                            results.data

                        )

                    );

                },

                error(error){

                    reject(error);

                }

            }

        );

    });

}

/* ============================================================================
   DATASET
============================================================================ */

/**
 * Returns worksheet rows regardless of file type.
 *
 * @param {File} file
 * @returns {Promise<Array[]>}
 */
export async function loadRows(file){

    const extension =

        getExtension(file);

    if(extension==="csv"){

        return await openCSV(file);

    }

    const workbook =

        await openWorkbook(file);

    return firstSheetRows(

        workbook

    );

}

/* ============================================================================
   WORKBOOK INFO
============================================================================ */

/**
 * Reads workbook metadata.
 *
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function workbookInfo(file){

    const workbook =

        await openWorkbook(file);

    return{

        sheets:

            workbook.SheetNames,

        count:

            workbook.SheetNames.length,

        properties:

            workbook.Props || {}

    };

}
