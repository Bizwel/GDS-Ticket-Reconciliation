/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0
 * File    : js/state.js
 * Purpose : Central application state management.
 * ============================================================
 */

import { CONFIG } from "./config.js";

/* ============================================================
   PRIVATE STATE
============================================================ */

const initialState = () => ({

    datasets: {

        gds: null,

        system: null

    },

    reconciliation: null,

    ui: {

        activeView:

            CONFIG.ui.defaultView,

        search:

            CONFIG.ui.defaultSearch,

        filter:

            CONFIG.ui.defaultFilter

    },

    diagnostics: {

        provider: "",

        recordsRead: 0,

        matched: 0,

        missingSystem: 0,

        missingGDS: 0,

        duplicateGroups: 0,

        voidRecords: 0,

        processingTime: 0

    }

});

let state = initialState();

/* ============================================================
   DATASETS
============================================================ */

export function setDataset(type, dataset) {

    if (!(type in state.datasets)) {

        throw new Error(`Unknown dataset: ${type}`);

    }

    state.datasets[type] = dataset;

}

export function getDataset(type) {

    return state.datasets[type];

}

/* ============================================================
   RECONCILIATION
============================================================ */

export function setReconciliation(result) {

    state.reconciliation = result;

}

export function getReconciliation() {

    return state.reconciliation;

}

/* ============================================================
   UI STATE
============================================================ */

export function setActiveView(view) {

    state.ui.activeView = view;

}

export function getActiveView() {

    return state.ui.activeView;

}

export function setSearch(text) {

    state.ui.search = text.trim();

}

export function getSearch() {

    return state.ui.search;

}

export function setFilter(filter) {

    state.ui.filter = filter;

}

export function getFilter() {

    return state.ui.filter;

}

/* ============================================================
   DIAGNOSTICS
============================================================ */

export function updateDiagnostics(values = {}) {

    state.diagnostics = {

        ...state.diagnostics,

        ...values

    };

}

export function getDiagnostics() {

    return state.diagnostics;

}

/* ============================================================
   STATE
============================================================ */

/**
 * Returns a read-only snapshot of the application state.
 *
 * @returns {Object}
 */
export function getState() {

    return structuredClone(state);

}

/**
 * Resets the application state.
 */
export function resetState() {

    state = initialState();

}
