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
