/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/renderer.js
 * Description:
 * Handles all UI rendering.
 * ============================================================
 */

/* ============================================================
   DOM CACHE
============================================================ */

const elements = {

    gdsCount:

        document.getElementById("gdsCount"),

    systemCount:

        document.getElementById("systemCount"),

    voidCount:

        document.getElementById("voidCount"),

    duplicateCount:

        document.getElementById("duplicateCount"),

    missingSystemCount:

        document.getElementById("missingSystemCount"),

    missingGDSCount:

        document.getElementById("missingGDSCount"),

    resultBody:

        document.getElementById("resultBody"),

    statusText:

        document.getElementById("statusText"),

    progressFill:

        document.getElementById("progressFill"),

    progressMessage:

        document.getElementById("progressMessage"),

    progressSection:

        document.getElementById("progressSection"),

    loadingModal:

        document.getElementById("loadingModal")

};


/* ============================================================
   DASHBOARD
============================================================ */

/**
 * Updates dashboard metrics.
 *
 * @param {Object} summary
 */
export function renderDashboard(summary){

    elements.gdsCount.textContent =

        summary.gdsRecords;

    elements.systemCount.textContent =

        summary.systemRecords;

    elements.voidCount.textContent =

        summary.voidGDS +
        summary.voidSystem;

    elements.duplicateCount.textContent =

        summary.duplicateGDS +
        summary.duplicateSystem;

    elements.missingSystemCount.textContent =

        summary.missingSystem;

    elements.missingGDSCount.textContent =

        summary.missingGDS;

}


/* ============================================================
   STATUS
============================================================ */

/**
 * Updates the status bar.
 *
 * @param {string} message
 */
export function renderStatus(message){

    elements.statusText.textContent =

        message;

}


/* ============================================================
   PROGRESS
============================================================ */

/**
 * Updates progress.
 *
 * @param {number} percent
 * @param {string} message
 */
export function renderProgress(

    percent,

    message

){

    elements.progressSection
        .classList.remove("hidden");

    elements.progressFill.style.width =

        `${percent}%`;

    elements.progressMessage.textContent =

        message;

}


/**
 * Hides progress.
 */
export function hideProgress(){

    elements.progressSection
        .classList.add("hidden");

}


/* ============================================================
   LOADING
============================================================ */

/**
 * Shows loading dialog.
 */
export function showLoading(){

    elements.loadingModal
        .classList.remove("hidden");

}


/**
 * Hides loading dialog.
 */
export function hideLoading(){

    elements.loadingModal
        .classList.add("hidden");

}

/* ============================================================
   TABLE UTILITIES
============================================================ */

/**
 * Clears the result table.
 */
function clearTable() {

    elements.resultBody.innerHTML = "";

}


/**
 * Returns a status CSS class.
 *
 * @param {string} reason
 * @returns {string}
 */
function getStatusClass(reason) {

    switch (reason) {

        case "Missing in System":
            return "status-danger";

        case "Missing in GDS":
            return "status-warning";

        case "Duplicate":
            return "status-info";

        case "VOID":
            return "status-success";

        default:
            return "";

    }

}


/**
 * Creates one result row.
 *
 * @param {Object} record
 * @param {number} index
 * @returns {HTMLTableRowElement}
 */
function createRow(record, index) {

    const tr = document.createElement("tr");

    const statusClass = getStatusClass(
        record.reason || ""
    );

    tr.innerHTML = `

        <td>${index + 1}</td>

        <td>${record.originalTicket ?? record.ticket}</td>

        <td>${record.passenger ?? ""}</td>

        <td>${record.issueDate ?? ""}</td>

        <td>${record.airline ?? ""}</td>

        <td>${record.consultant ?? ""}</td>

        <td>${record.source ?? ""}</td>

        <td>${record.status ?? ""}</td>

        <td class="${statusClass}">

            ${record.reason ?? ""}

        </td>

    `;

    return tr;

}


/* ============================================================
   EMPTY STATE
============================================================ */

/**
 * Displays empty table message.
 *
 * @param {string} message
 */
export function renderEmpty(message = "No records found.") {

    clearTable();

    const tr = document.createElement("tr");

    tr.innerHTML = `

        <td colspan="9" class="text-center">

            ${message}

        </td>

    `;

    elements.resultBody.appendChild(tr);

}


/* ============================================================
   RESULT TABLE
============================================================ */

/**
 * Renders reconciliation records.
 *
 * @param {Array} records
 */
export function renderTable(records = []) {

    clearTable();

    if (!records.length) {

        renderEmpty();

        return;

    }

    records.forEach((record, index) => {

        elements.resultBody.appendChild(

            createRow(

                record,

                index

            )

        );

    });

}


/* ============================================================
   SUMMARY
============================================================ */

/**
 * Renders summary information.
 *
 * @param {Object} summary
 */
export function renderSummary(summary) {

    renderStatus(

        `Matched: ${summary.matched} | ` +

        `Missing in System: ${summary.missingSystem} | ` +

        `Missing in GDS: ${summary.missingGDS}`

    );

}
