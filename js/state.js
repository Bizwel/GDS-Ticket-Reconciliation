/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/state.js
 *
 * Central application state.
 * ============================================================================
 */

import {

    DASHBOARD,
    UI

} from "./config.js";

/* ============================================================================
   DEFAULT STATE
============================================================================ */

const DEFAULT_STATE = Object.freeze({

    files: {

        gds: null,

        system: null

    },

    datasets: {

        gds: null,

        system: null

    },

    reconciliation: null,

    currentView: UI.DEFAULT_VIEW,

    searchText: "",

    filter: "all",

    dashboard: structuredClone(
        DASHBOARD.DEFAULTS
    ),

    processing: {

        running: false,

        startedAt: null,

        finishedAt: null,

        duration: 0

    },

    diagnostics: {

        provider: "",

        headerRow: 0,

        ticketColumn: "",

        recordsRead: 0,

        duplicates: 0,

        voidRecords: 0

    }

});


/* ============================================================================
   INTERNAL STATE
============================================================================ */

let state = structuredClone(DEFAULT_STATE);


/* ============================================================================
   HELPERS
============================================================================ */

/**
 * Returns a deep copy of the current state.
 *
 * @returns {Object}
 */
export function getState() {

    return structuredClone(state);

}


/**
 * Replaces the application state.
 *
 * @param {Object} newState
 */
export function replaceState(newState) {

    state = structuredClone(newState);

}


/**
 * Resets state to defaults.
 */
export function resetState() {

    state = structuredClone(DEFAULT_STATE);

}


/**
 * Updates top-level properties.
 *
 * @param {Object} updates
 */
export function setState(updates) {

    state = {

        ...state,

        ...updates

    };

}


/**
 * Updates a nested object.
 *
 * @param {string} section
 * @param {Object} updates
 */
export function updateSection(

    section,

    updates

) {

    state[section] = {

        ...state[section],

        ...updates

    };

}


/* ============================================================================
   FILES
============================================================================ */

export function setGDSFile(file){

    updateSection(

        "files",

        {

            gds:file

        }

    );

}

export function setSystemFile(file){

    updateSection(

        "files",

        {

            system:file

        }

    );

}


/* ============================================================================
   DATASETS
============================================================================ */

export function setGDSDataset(dataset){

    updateSection(

        "datasets",

        {

            gds:dataset

        }

    );

}

export function setSystemDataset(dataset){

    updateSection(

        "datasets",

        {

            system:dataset

        }

    );

}


/* ============================================================================
   RECONCILIATION
============================================================================ */

export function setReconciliation(result){

    state.reconciliation = result;

}


/* ============================================================================
   VIEW
============================================================================ */

export function setCurrentView(view){

    state.currentView = view;

}

export function setSearch(text){

    state.searchText = text;

}

export function setFilter(filter){

    state.filter = filter;

}


/* ============================================================================
   DASHBOARD
============================================================================ */

export function updateDashboard(values){

    updateSection(

        "dashboard",

        values

    );

}


/* ============================================================================
   PROCESSING
============================================================================ */

export function beginProcessing(){

    updateSection(

        "processing",

        {

            running:true,

            startedAt:performance.now(),

            finishedAt:null,

            duration:0

        }

    );

}

export function endProcessing(){

    const finished = performance.now();

    const duration =

        finished -

        state.processing.startedAt;

    updateSection(

        "processing",

        {

            running:false,

            finishedAt:finished,

            duration

        }

    );

}


/* ============================================================================
   DIAGNOSTICS
============================================================================ */

export function updateDiagnostics(values){

    updateSection(

        "diagnostics",

        values

    );

}


/* ============================================================================
   SELECTORS
============================================================================ */

export function hasFiles(){

    return (

        state.files.gds &&

        state.files.system

    );

}

export function isProcessing(){

    return state.processing.running;

}
