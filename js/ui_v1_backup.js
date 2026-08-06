/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/ui.js
 * Description:
 * Handles all UI interactions.
 * ============================================================
 */

import {

    renderStatus,
    renderProgress,
    hideProgress,
    showLoading,
    hideLoading

} from "./renderer.js";


/* ============================================================
   UI STATE
============================================================ */

const state = {

    gdsFile: null,

    systemFile: null,

    currentView: "missing-system",

    currentRecords: [],

    reconciliation: null

};


/* ============================================================
   DOM
============================================================ */

const ui = {

    gdsFileName:

        document.getElementById("gdsFileName"),

    systemFilName:

        document.getElementById("systemFileName"),

    browseGDS:

        document.getElementById("browseGDS"),

    browseSystem:

        document.getElementById("browseSystem"),

    compareBtn:

        document.getElementById("compareBtn"),

    resetBtn:

        document.getElementById("resetBtn"),

    exportExcel:

        document.getElementById("exportExcel"),

    exportCSV:

        document.getElementById("exportCSV"),

    searchInput:

        document.getElementById("searchInput"),

    filterSelect:

        document.getElementById("filterSelect"),

    gdsDropZone:

        document.getElementById("gdsDropZone"),

    systemDropZone:

        document.getElementById("systemDropZone"),

    tabs:

        document.querySelectorAll(".tab")

};


/* ============================================================
   PUBLIC STATE
============================================================ */

export function getState(){

    return state;

}


/* ============================================================
   FILES
============================================================ */

export function setGDSFile(file){

    state.gdsFile = file;

    updateCompareButton();

}


export function setSystemFile(file){

    state.systemFile = file;

    updateCompareButton();

}


/* ============================================================
   BUTTON STATE
============================================================ */

function updateCompareButton(){

    ui.compareBtn.disabled = !(

        state.gdsFile &&

        state.systemFile

    );

}


/* ============================================================
   RESET
============================================================ */

export function resetState(){

    state.gdsFile = null;

    state.systemFile = null;

    state.currentRecords = [];

    state.reconciliation = null;

    state.currentView =

        "missing-system";

    ui.gdsFile.value = "";

    ui.systemFile.value = "";

    updateCompareButton();

    hideProgress();

    renderStatus("Ready");

}


/* ============================================================
   LOADING
============================================================ */

export function beginProcessing(message){

    showLoading();

    renderProgress(

        5,

        message

    );

}


export function finishProcessing(message){

    hideLoading();

    hideProgress();

    renderStatus(message);

}

/* ============================================================
   FILE PICKERS
============================================================ */

function openGDSFilePicker() {

    ui.gdsFile.click();

}

function openSystemFilePicker() {

    ui.systemFile.click();

}

/* ============================================================
   FILE SELECTION
============================================================ */

function handleGDSSelection(event) {

    const file = event.target.files[0];

    if (!file) {

        return;

    }

    setGDSFile(file);
   
    ui.gdsFileName.textContent = file.name;
   

}

function handleSystemSelection(event) {

    const file = event.target.files[0];

    if (!file) {

        return;

    }

    setSystemFile(file);

    ui.systemFileName.textContent = file.name;

}

/* ============================================================
   DRAG & DROP
============================================================ */

function registerDropZone(dropZone, callback) {

    ["dragenter", "dragover"].forEach(eventName => {

        dropZone.addEventListener(eventName, event => {

            event.preventDefault();

            dropZone.classList.add("drag-over");

        });

    });

    ["dragleave", "drop"].forEach(eventName => {

        dropZone.addEventListener(eventName, event => {

            event.preventDefault();

            dropZone.classList.remove("drag-over");

        });

    });

    dropZone.addEventListener("drop", event => {

        const file = event.dataTransfer.files[0];

        if (!file) {

            return;

        }

        callback(file);

    });

}

/* ============================================================
   FILE DROP
============================================================ */

function handleGDSDrop(file) {

    setGDSFile(file);

    document.getElementById("gdsFileName").textContent =
        file.name;

}

function handleSystemDrop(file) {

    setSystemFile(file);

    document.getElementById("systemFileName").textContent =
        file.name;

}

/* ============================================================
   EVENTS
============================================================ */

export function registerUIEvents(handlers) {

    ui.browseGDS.addEventListener(

        "click",

        openGDSFilePicker

    );

    ui.browseSystem.addEventListener(

        "click",

        openSystemFilePicker

    );

    ui.gdsFile.addEventListener(

        "change",

        handleGDSSelection

    );

    ui.systemFile.addEventListener(

        "change",

        handleSystemSelection

    );

    registerDropZone(

        ui.gdsDropZone,

        handleGDSDrop

    );

    registerDropZone(

        ui.systemDropZone,

        handleSystemDrop

    );

    ui.compareBtn.addEventListener(

        "click",

        handlers.compare

    );

    ui.resetBtn.addEventListener(

        "click",

        handlers.reset

    );

    ui.exportExcel.addEventListener(

        "click",

        handlers.exportExcel

    );

    ui.exportCSV.addEventListener(

        "click",

        handlers.exportCSV

    );

}
/* ============================================================
   SEARCH
============================================================ */

/**
 * Registers search handler.
 *
 * @param {Function} callback
 */
function registerSearch(callback){

    ui.searchInput.addEventListener(

        "input",

        event=>{

            callback(

                event.target.value

            );

        }

    );

}


/* ============================================================
   FILTER
============================================================ */

/**
 * Registers filter handler.
 *
 * @param {Function} callback
 */
function registerFilter(callback){

    ui.filterSelect.addEventListener(

        "change",

        event=>{

            callback(

                event.target.value

            );

        }

    );

}


/* ============================================================
   RESULT TABS
============================================================ */

/**
 * Registers tab handlers.
 *
 * @param {Function} callback
 */
function registerTabs(callback){

    ui.tabs.forEach(tab=>{

        tab.addEventListener(

            "click",

            ()=>{

                callback(

                    tab.dataset.tab

                );

            }

        );

    });

}


/* ============================================================
   ENABLE EXPORTS
============================================================ */

/**
 * Enables export buttons.
 */
export function enableExports(){

    ui.exportExcel.disabled = false;

    ui.exportCSV.disabled = false;

}


/* ============================================================
   DISABLE EXPORTS
============================================================ */

/**
 * Disables export buttons.
 */
export function disableExports(){

    ui.exportExcel.disabled = true;

    ui.exportCSV.disabled = true;

}


/* ============================================================
   INITIALIZATION
============================================================ */

/**
 * Initializes UI.
 *
 * @param {Object} handlers
 */
export function initializeUI(handlers){

    registerUIEvents(

        handlers

    );

    registerSearch(

        handlers.search

    );

    registerFilter(

        handlers.filter

    );

    registerTabs(

        handlers.changeTab

    );

    disableExports();

    renderStatus(

        "Ready"

    );

}
