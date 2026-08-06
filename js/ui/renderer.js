/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/renderer.js
 *
 * UI Rendering Engine
 * ============================================================================
 */

import {

    byId,
    clear,
    text

} from "./utils/dom.js";

import {

    STATUS_LABELS

} from "./config.js";

import {

    log

} from "./utils/logger.js";


/* ============================================================================
   DOM CACHE
============================================================================ */

const elements = {};


/**
 * Cache all required DOM elements.
 */
export function initializeRenderer(){

    elements.gdsFile =
        byId("gdsFile");

    elements.systemFile =
        byId("systemFile");

    elements.compareButton =
        byId("compareBtn");

    elements.exportExcel =
        byId("exportExcel");

    elements.exportCSV =
        byId("exportCSV");

    elements.search =
        byId("searchBox");

    elements.statusFilter =
        byId("statusFilter");

    /* Dashboard Cards */

   elements.dashboard = {

    totalGDS: byId("totalGDS"),

    totalSystem: byId("totalSystem"),

    totalMatched: byId("totalMatched"),

    totalMissingSystem: byId("totalMissingSystem"),

    totalMissingGDS: byId("totalMissingGDS"),

    totalDuplicates: byId("totalDuplicates"),

    totalVoid: byId("totalVoid"),

    processingTime: byId("processingTime")

};

    /* Table */

    elements.tableBody =
        byId("resultsBody");

    elements.resultCount =
        byId("resultCount");

    elements.pagination =
        byId("pagination");

    /* Diagnostics */

    elements.provider =
        byId("provider");

    elements.sheet =
        byId("sheetName");

    elements.headerRow =
        byId("headerRow");

    elements.ticketColumn =
        byId("ticketColumn");

    log("Renderer initialized.");

}


/* ============================================================================
   ACCESSOR
============================================================================ */

/**
 * Returns cached elements.
 *
 * @returns {Object}
 */
export function getElements(){

    return elements;

}


/* ============================================================================
   RESET
============================================================================ */

/**
 * Clears previous results.
 */
export function clearRenderer(){

    clear(

        elements.tableBody

    );

    text(

        elements.resultCount,

        "0"

    );

}


/* ============================================================================
   STATUS LABEL
============================================================================ */

/**
 * Converts internal status to UI label.
 *
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status){

    return STATUS_LABELS[status] ||

           status;

}
/* ============================================================================
   DASHBOARD
============================================================================ */

/**
 * Updates dashboard summary cards.
 *
 * @param {Object} statistics
 */
export function renderDashboard(statistics){

    const cards = elements.dashboard;

    text(
        cards.totalGDS,
        statistics.gdsRecords
    );

    text(
        cards.totalSystem,
        statistics.systemRecords
    );

    text(
        cards.totalMatched,
        statistics.matched
    );

    text(
        cards.totalMissingSystem,
        statistics.missingInSystem
    );

    text(
        cards.totalMissingGDS,
        statistics.missingInGDS
    );

    text(
        cards.totalDuplicates,
        statistics.duplicateTickets
    );

    text(
        cards.totalVoid,
        statistics.voidGDS + statistics.voidSystem
    );

    text(
        cards.processingTime,
        `${statistics.processingTime} ms`
    );

}


/* ============================================================================
   SUMMARY
============================================================================ */

/**
 * Updates summary information.
 *
 * @param {Object} statistics
 */
export function renderSummary(statistics){

    text(

        elements.resultCount,

        statistics.gdsRecords

    );

}
/* ============================================================================
   STATUS BADGE
============================================================================ */

/**
 * Returns badge class.
 *
 * @param {string} status
 * @returns {string}
 */
function statusClass(status){

    switch(status){

        case "MATCHED":

            return "badge-success";

        case "MISSING_IN_SYSTEM":

            return "badge-danger";

        case "MISSING_IN_GDS":

            return "badge-warning";

        case "VOID":

            return "badge-secondary";

        default:

            return "badge-light";

    }

}


/**
 * Creates badge HTML.
 *
 * @param {string} status
 * @returns {string}
 */
export function renderStatusBadge(status){

    return `

        <span class="${statusClass(status)}">

            ${getStatusLabel(status)}

        </span>

    `;

}
/* ============================================================================
   EMPTY TABLE
============================================================================ */

export function renderEmptyTable(message = "No records found."){

    clear(

        elements.tableBody

    );

    const row = document.createElement("tr");

    row.innerHTML = `

        <td colspan="8"

            class="text-center empty">

            ${message}

        </td>

    `;

    elements.tableBody.appendChild(row);

}
/* ============================================================================
   DIAGNOSTICS
============================================================================ */

export function renderDiagnostics(diagnostics){

    text(

        elements.provider,

        diagnostics.gdsProvider

    );

    text(

        elements.sheet,

        diagnostics.sheetName

    );

    text(

        elements.headerRow,

        diagnostics.headerRow

    );

    text(

        elements.ticketColumn,

        diagnostics.ticketColumn

    );

}
/* ============================================================================
   TABLE HEADER
============================================================================ */

import {

    TABLE_COLUMNS

} from "./config.js";


/**
 * Builds the table header.
 */
export function renderTableHeader(){

    const headerRow = byId("resultsHeader");

    if(!headerRow){

        return;

    }

    clear(headerRow);

  TABLE_COLUMNS.forEach(column => {

    const th = document.createElement("th");

    th.textContent = column.label;

    // NEW
    if (column.width) {

        th.style.width = column.width;

    }

    if (column.align) {

        th.style.textAlign = column.align;

    }

    headerRow.appendChild(th);

});

}
/* ============================================================================
   CELL
============================================================================ */

function buildCell(value, column){

    const td = document.createElement("td");

    td.textContent = value ?? "";

    // NEW
    if (column.align) {

        td.style.textAlign = column.align;

    }

    return td;

}
/* ============================================================================
   ROW
============================================================================ */

function buildRow(item){

    const tr = document.createElement("tr");

    TABLE_COLUMNS.forEach(column=>{

        let value = item[column.key];

        if(column.key==="statusLabel"){

            const td = document.createElement("td");

            td.innerHTML =

                renderStatusBadge(

                    item.status

                );

            tr.appendChild(td);

            return;

        }

        tr.appendChild(

            buildCell(
                
                value,
                
                column
            )

        );

    });

    if(item.isDuplicate){

        tr.classList.add(

            "duplicate-row"

        );

    }

    return tr;

}
/* ============================================================================
   GRID
============================================================================ */

export function renderResults(records){

    clear(

        elements.tableBody

    );

    if(!records.length){

        renderEmptyTable();

        return;

    }

    records.forEach(record=>{

        elements.tableBody.appendChild(

            buildRow(record)

        );

    });

    text(

        elements.resultCount,

        records.length

    );

}

export const TABLE_COLUMNS = Object.freeze([

    {

        key: "ticket",

        label: "Ticket Number",

        width: "180px",

        align: "left"

    },

    {

        key: "gdsCount",

        label: "GDS",

        width: "80px",

        align: "center"

    },

    {

        key: "statusLabel",

        label: "Status",

        width: "170px",

        align: "center"

    }

]);
