/* ==========================================================
   GDS Ticket Reconciliation Tool
   app.js - Part 1
   Application Core
   ========================================================== */

'use strict';

/* ==========================================================
   APPLICATION STATE
   ========================================================== */

const App = {

    /* Uploaded files */
    gdsFile: null,
    systemFile: null,

    /* Parsed datasets */
    gdsRecords: [],
    systemRecords: [],

    /* Comparison results */
    missingInSystem: [],
    missingInGDS: [],
    duplicateGDS: [],
    duplicateSystem: [],
    voidRecords: [],

    /* Statistics */
    stats: {
        totalGDS: 0,
        totalSystem: 0,
        validTickets: 0,
        voidRemoved: 0,
        duplicateTickets: 0,
        missingSystem: 0,
        missingGDS: 0
    }

};


/* ==========================================================
   DOM REFERENCES
   ========================================================== */

const UI = {

    gdsInput: document.getElementById("gdsFile"),
    systemInput: document.getElementById("systemFile"),

    browseGDS: document.getElementById("browseGDS"),
    browseSystem: document.getElementById("browseSystem"),

    gdsDropZone: document.getElementById("gdsDropZone"),
    systemDropZone: document.getElementById("systemDropZone"),

    gdsFilename: document.getElementById("gdsFilename"),
    systemFilename: document.getElementById("systemFilename"),

    compareBtn: document.getElementById("compareBtn"),
    resetBtn: document.getElementById("resetBtn"),

    progressSection: document.getElementById("progressSection"),
    progressFill: document.getElementById("progressFill"),
    progressText: document.getElementById("progressText"),

    loadingModal: document.getElementById("loadingModal"),

    searchBox: document.getElementById("searchBox"),
    resultFilter: document.getElementById("resultFilter"),

    resultsTable: document.querySelector("#resultsTable tbody"),

    excelExport: document.getElementById("excelExport"),
    csvExport: document.getElementById("csvExport"),

    statusMessage: document.getElementById("statusMessage")

};


/* ==========================================================
   DASHBOARD REFERENCES
   ========================================================== */

const Dashboard = {

    totalGDS: document.getElementById("gdsTotal"),
    validTickets: document.getElementById("validTickets"),
    voidTickets: document.getElementById("voidTickets"),
    duplicateTickets: document.getElementById("duplicateTickets"),
    missingTickets: document.getElementById("missingTickets"),
    missingSystem: document.getElementById("missingSystem")

};


/* ==========================================================
   INITIALIZATION
   ========================================================== */

document.addEventListener("DOMContentLoaded", init);


function init(){

    registerEvents();

    resetDashboard();

    setStatus("Ready");

}


/* ==========================================================
   EVENT REGISTRATION
   ========================================================== */

function registerEvents(){

    /* Browse buttons */

    UI.browseGDS.addEventListener("click", () => UI.gdsInput.click());

    UI.browseSystem.addEventListener("click", () => UI.systemInput.click());


    /* File selection */

    UI.gdsInput.addEventListener("change", handleGDSFile);

    UI.systemInput.addEventListener("change", handleSystemFile);


    /* Drag & Drop */

    enableDropZone(UI.gdsDropZone, handleDroppedGDS);

    enableDropZone(UI.systemDropZone, handleDroppedSystem);


    /* Buttons */

    UI.compareBtn.addEventListener("click", compareReports);

    UI.resetBtn.addEventListener("click", resetApplication);

}


/* ==========================================================
   DRAG & DROP
   ========================================================== */

function enableDropZone(zone, callback){

    zone.addEventListener("dragover", e => {

        e.preventDefault();

        zone.classList.add("active");

    });

    zone.addEventListener("dragleave", () => {

        zone.classList.remove("active");

    });

    zone.addEventListener("drop", e => {

        e.preventDefault();

        zone.classList.remove("active");

        const file = e.dataTransfer.files[0];

        if(file){

            callback(file);

        }

    });

}


/* ==========================================================
   FILE HANDLERS
   ========================================================== */

function handleGDSFile(){

    const file = UI.gdsInput.files[0];

    if(file){

        handleDroppedGDS(file);

    }

}


function handleSystemFile(){

    const file = UI.systemInput.files[0];

    if(file){

        handleDroppedSystem(file);

    }

}


function handleDroppedGDS(file){

    App.gdsFile = file;

    UI.gdsFilename.textContent = file.name;

    UI.gdsFilename.classList.add("loaded");

    enableCompareButton();

    setStatus("GDS report loaded.");

}


function handleDroppedSystem(file){

    App.systemFile = file;

    UI.systemFilename.textContent = file.name;

    UI.systemFilename.classList.add("loaded");

    enableCompareButton();

    setStatus("System report loaded.");

}


/* ==========================================================
   BUTTON STATE
   ========================================================== */

function enableCompareButton(){

    UI.compareBtn.disabled = !(App.gdsFile && App.systemFile);

}


/* ==========================================================
   DASHBOARD
   ========================================================== */

function resetDashboard(){

    Dashboard.totalGDS.textContent = "0";

    Dashboard.validTickets.textContent = "0";

    Dashboard.voidTickets.textContent = "0";

    Dashboard.duplicateTickets.textContent = "0";

    Dashboard.missingTickets.textContent = "0";

    Dashboard.missingSystem.textContent = "0";

}


/* ==========================================================
   STATUS
   ========================================================== */

function setStatus(message){

    UI.statusMessage.textContent = message;

}


/* ==========================================================
   LOADING
   ========================================================== */

function showLoading(){

    UI.loadingModal.classList.remove("hidden");

}


function hideLoading(){

    UI.loadingModal.classList.add("hidden");

}


/* ==========================================================
   PROGRESS
   ========================================================== */

function updateProgress(percent, message){

    UI.progressSection.classList.remove("hidden");

    UI.progressFill.style.width = percent + "%";

    UI.progressText.textContent = message;

}


function hideProgress(){

    UI.progressSection.classList.add("hidden");

}


/* ==========================================================
   RESET
   ========================================================== */

function resetApplication(){

    location.reload();

}


/* ==========================================================
   PLACEHOLDER
   (Implemented in Part 2)
   ========================================================== */

async function compareReports(){

    alert("Part 2 will parse and normalize the uploaded files.");

}
/* ==========================================================
   app.js - Part 2A
   Excel / CSV Readers & Utility Functions
   ========================================================== */

/* ==========================================================
   FILE READER
   ========================================================== */

async function readFile(file){

    if(!file)
        throw new Error("No file selected.");

    const extension = getFileExtension(file.name);

    switch(extension){

        case "csv":
            return await readCSV(file);

        case "xlsx":
        case "xls":
            return await readExcel(file);

        default:
            throw new Error("Unsupported file format: " + extension);

    }

}


/* ==========================================================
   READ EXCEL
   ========================================================== */

function readExcel(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload = function(e){

            try{

                const workbook = XLSX.read(
                    e.target.result,
                    {
                        type:"array"
                    }
                );

                const firstSheet =
                    workbook.SheetNames[0];

                const worksheet =
                    workbook.Sheets[firstSheet];

                const rows =
                    XLSX.utils.sheet_to_json(
                        worksheet,
                        {
                            header:1,
                            raw:false,
                            defval:""
                        }
                    );

                resolve(rows);

            }

            catch(error){

                reject(error);

            }

        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);

    });

}


/* ==========================================================
   READ CSV
   ========================================================== */

function readCSV(file){

    return new Promise((resolve,reject)=>{

        Papa.parse(file,{

            skipEmptyLines:true,

            complete:function(results){

                resolve(results.data);

            },

            error:function(err){

                reject(err);

            }

        });

    });

}


/* ==========================================================
   FILE EXTENSION
   ========================================================== */

function getFileExtension(filename){

    return filename
        .split(".")
        .pop()
        .toLowerCase();

}


/* ==========================================================
   STRING NORMALIZATION
   ========================================================== */

function cleanText(value){

    if(value===null || value===undefined)
        return "";

    return value
        .toString()
        .replace(/\u00A0/g," ")
        .replace(/\r/g,"")
        .replace(/\n/g,"")
        .replace(/\t/g," ")
        .trim();

}


/* ==========================================================
   REMOVE EMPTY ROWS
   ========================================================== */

function removeEmptyRows(rows){

    return rows.filter(row=>{

        if(!Array.isArray(row))
            return false;

        return row.some(cell=>cleanText(cell)!=="");

    });

}


/* ==========================================================
   SAFE CELL ACCESS
   ========================================================== */

function getCell(row,index){

    if(!row)
        return "";

    if(index<0)
        return "";

    return cleanText(row[index]);

}


/* ==========================================================
   FIND COLUMN INDEX
   ========================================================== */

function findColumn(headers, aliases){

    const normalizedHeaders = headers.map(h =>
        cleanText(h).toLowerCase()
    );

    for(const alias of aliases){

        const idx = normalizedHeaders.indexOf(
            alias.toLowerCase()
        );

        if(idx>=0)
            return idx;

    }

    return -1;

}


/* ==========================================================
   UPDATE PROGRESS
   ========================================================== */

async function stepProgress(percent,message){

    updateProgress(percent,message);

    await new Promise(resolve=>{

        requestAnimationFrame(resolve);

    });

}


/* ==========================================================
   DEBUG LOGGER
   ========================================================== */

const DEBUG = true;

function log(){

    if(DEBUG){

        console.log.apply(console,arguments);

    }

}


/* ==========================================================
   ERROR HANDLER
   ========================================================== */

function handleError(error){

    console.error(error);

    hideLoading();

    hideProgress();

    setStatus(error.message);

    alert(error.message);

}
/* ==========================================================
   app.js - Part 2B
   Intelligent Header Detection & Column Mapping
   ========================================================== */

/* ==========================================================
   COLUMN ALIASES
   ========================================================== */

const COLUMN_ALIASES = {

    ticket: [
        "ticket number",
        "ticket no",
        "ticket #",
        "ticket",
        "number",
        "no",
        "document number",
        "document no"
    ],

    status: [
        "status",
        "ticket status",
        "document status",
        "action status"
    ],

    passenger: [
        "passenger",
        "passenger name",
        "name",
        "traveller",
        "traveler"
    ],

    issueDate: [
        "issue date",
        "issued date",
        "date issued",
        "date",
        "document date"
    ],

    airline: [
        "airline",
        "carrier",
        "marketing carrier",
        "airline code"
    ],

    consultant: [
        "consultant",
        "agent",
        "sales agent",
        "issued by",
        "user"
    ]

};


/* ==========================================================
   HEADER ROW DETECTION
   ========================================================== */

function detectHeaderRow(rows){

    let bestRow = -1;
    let highestScore = 0;

    const maxRows = Math.min(rows.length, 50);

    for(let r = 0; r < maxRows; r++){

        const row = rows[r];

        if(!Array.isArray(row))
            continue;

        let score = 0;

        row.forEach(cell => {

            const value = cleanText(cell).toLowerCase();

            Object.values(COLUMN_ALIASES).forEach(list => {

                if(list.includes(value))
                    score++;

            });

        });

        if(score > highestScore){

            highestScore = score;
            bestRow = r;

        }

    }

    if(bestRow === -1)
        throw new Error("Unable to detect the report header row.");

    return bestRow;

}


/* ==========================================================
   DETECT REPORT TYPE
   ========================================================== */

function detectReportType(headers){

    const cols = headers.map(h =>
        cleanText(h).toLowerCase()
    );

    if(cols.includes("ticket #"))
        return "Sabre";

    if(cols.includes("number"))
        return "Galileo";

    if(cols.includes("no"))
        return "Amadeus";

    return "System";

}


/* ==========================================================
   BUILD COLUMN MAP
   ========================================================== */

function buildColumnMap(headers){

    return {

        ticket:
            findColumn(headers, COLUMN_ALIASES.ticket),

        status:
            findColumn(headers, COLUMN_ALIASES.status),

        passenger:
            findColumn(headers, COLUMN_ALIASES.passenger),

        issueDate:
            findColumn(headers, COLUMN_ALIASES.issueDate),

        airline:
            findColumn(headers, COLUMN_ALIASES.airline),

        consultant:
            findColumn(headers, COLUMN_ALIASES.consultant)

    };

}


/* ==========================================================
   VALIDATE COLUMN MAP
   ========================================================== */

function validateColumnMap(map){

    if(map.ticket === -1){

        throw new Error(
            "Ticket column could not be identified."
        );

    }

}


/* ==========================================================
   EXTRACT SCHEMA
   ========================================================== */

function extractSchema(rows){

    const headerRow = detectHeaderRow(rows);

    const headers = rows[headerRow].map(cleanText);

    const reportType = detectReportType(headers);

    const columnMap = buildColumnMap(headers);

    validateColumnMap(columnMap);

    return {

        reportType,

        headerRow,

        headers,

        columnMap

    };

}


/* ==========================================================
   LOG SCHEMA
   ========================================================== */

function logSchema(schema){

    log("--------------------------------");

    log("Report Type:", schema.reportType);

    log("Header Row :", schema.headerRow);

    log("Column Map :", schema.columnMap);

    log("--------------------------------");

}
/* ==========================================================
   app.js - Part 2C
   Record Builder, Ticket Normalization,
   VOID Filtering & Duplicate Detection
   ========================================================== */


/* ==========================================================
   NORMALIZE TICKET NUMBER
   ========================================================== */

function normalizeTicket(ticket){

    let value = cleanText(ticket);

    if(!value)
        return "";

    // Remove spaces

    value = value.replace(/\s+/g,"");

    // Remove invisible characters

    value = value.replace(/[^\d-]/g,"");

    // Remove exchange suffix
    // 0712617231450-451

    value = value.replace(/-\d+$/,"");

    // Remove airline prefix
    // 157-
    // 071-

    value = value.replace(/^\d{3}-/,"");

    // Galileo
    // 0712617231450

    if(/^\d{13}$/.test(value)){

        value = value.substring(3);

    }

    return value;

}


/* ==========================================================
   IS VOID
   ========================================================== */

function isVoid(status){

    return cleanText(status)
        .toUpperCase()
        === "VOID";

}


/* ==========================================================
   BUILD RECORD
   ========================================================== */

function buildRecord(row,map,reportType){

    return{

        ticket:

            normalizeTicket(
                getCell(row,map.ticket)
            ),

        passenger:

            getCell(
                row,
                map.passenger
            ),

        issueDate:

            getCell(
                row,
                map.issueDate
            ),

        airline:

            getCell(
                row,
                map.airline
            ),

        consultant:

            getCell(
                row,
                map.consultant
            ),

        status:

            getCell(
                row,
                map.status
            ),

        source:

            reportType,

        originalRow:

            row

    };

}


/* ==========================================================
   PARSE REPORT
   ========================================================== */

async function parseReport(file,isSystem=false){

    await stepProgress(
        10,
        "Reading " + file.name
    );

    let rows = await readFile(file);

    rows = removeEmptyRows(rows);

    await stepProgress(
        30,
        "Detecting report layout..."
    );

    const schema = extractSchema(rows);

    logSchema(schema);

    const {

        reportType,
        headerRow,
        columnMap

    } = schema;

    await stepProgress(
        50,
        "Normalizing ticket numbers..."
    );

    const records=[];

    const duplicateStore=[];

    const seen=new Set();

    let voidCount=0;

    for(

        let i=headerRow+1;

        i<rows.length;

        i++

    ){

        const row=rows[i];

        if(!row)
            continue;

        const record=
            buildRecord(
                row,
                columnMap,
                reportType
            );

        if(!record.ticket)
            continue;

        if(

            isVoid(
                record.status
            )

        ){

            voidCount++;

            App.voidRecords.push(record);

            continue;

        }

        if(

            seen.has(
                record.ticket
            )

        ){

            duplicateStore.push(record);

            continue;

        }

        seen.add(record.ticket);

        records.push(record);

    }

    await stepProgress(
        90,
        "Finalising records..."
    );

    if(isSystem){

        App.duplicateSystem=duplicateStore;

    }
    else{

        App.duplicateGDS=duplicateStore;

    }

    await stepProgress(
        100,
        "Completed."
    );

    return{

        reportType,

        records,

        duplicateCount:
            duplicateStore.length,

        voidCount,

        totalRows:
            rows.length

    };

}
/* ==========================================================
   app.js - Part 2D
   Integration
   ========================================================== */


/* ==========================================================
   LOAD REPORTS
   ========================================================== */

async function loadReports(){

    if(!App.gdsFile || !App.systemFile){

        throw new Error(
            "Please select both reports."
        );

    }

    showLoading();

    updateProgress(
        0,
        "Preparing..."
    );

    try{

        const gdsResult =
            await parseReport(
                App.gdsFile,
                false
            );

        const systemResult =
            await parseReport(
                App.systemFile,
                true
            );

        App.gdsRecords =
            gdsResult.records;

        App.systemRecords =
            systemResult.records;

        App.stats.totalGDS =
            gdsResult.totalRows;

        App.stats.totalSystem =
            systemResult.totalRows;

        App.stats.validTickets =
            gdsResult.records.length;

        App.stats.voidRemoved =
            gdsResult.voidCount +
            systemResult.voidCount;

        App.stats.duplicateTickets =
            gdsResult.duplicateCount +
            systemResult.duplicateCount;

        updateDashboard();

        renderSummary();

        hideLoading();

        hideProgress();

        setStatus(
            "Files successfully processed."
        );

    }

    catch(error){

        handleError(error);

    }

}


/* ==========================================================
   UPDATE DASHBOARD
   ========================================================== */

function updateDashboard(){

    Dashboard.totalGDS.textContent =
        App.stats.totalGDS;

    Dashboard.validTickets.textContent =
        App.stats.validTickets;

    Dashboard.voidTickets.textContent =
        App.stats.voidRemoved;

    Dashboard.duplicateTickets.textContent =
        App.stats.duplicateTickets;

    Dashboard.missingTickets.textContent =
        App.stats.missingSystem;

    Dashboard.missingSystem.textContent =
        App.stats.missingGDS;

}


/* ==========================================================
   SUMMARY
   ========================================================== */

function renderSummary(){

    UI.resultsTable.innerHTML="";

    const row=document.createElement("tr");

    row.innerHTML=`

        <td colspan="9">

            GDS Records :
            <strong>${App.gdsRecords.length}</strong>

            &nbsp;&nbsp;&nbsp;

            System Records :
            <strong>${App.systemRecords.length}</strong>

            <br><br>

            Ready for reconciliation.

        </td>

    `;

    UI.resultsTable.appendChild(row);

}


/* ==========================================================
   ENABLE EXPORTS
   ========================================================== */

function enableExports(){

    UI.excelExport.disabled=false;

    UI.csvExport.disabled=false;

}


/* ==========================================================
   DISABLE EXPORTS
   ========================================================== */

function disableExports(){

    UI.excelExport.disabled=true;

    UI.csvExport.disabled=true;

}


/* ==========================================================
   COMPARE REPORTS
   (Temporary)
   ========================================================== */

async function compareReports(){

    await loadReports();

    enableExports();

    alert(
        "Part 3 will perform the ticket reconciliation."
    );

}
