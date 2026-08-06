/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/utils/download.js
 *
 * Browser download helpers.
 * ============================================================================
 */

/**
 * Downloads a Blob as a file.
 *
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename){

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}
