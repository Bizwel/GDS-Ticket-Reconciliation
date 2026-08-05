/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/config.js
 * Description:
 * Central configuration and application constants.
 * ============================================================
 */

/* ============================================================
   APPLICATION
============================================================ */

export const APP = {

    NAME: "GDS Ticket Reconciliation Tool",

    VERSION: "1.0.0",

    AUTHOR: "Business Well Technologies"

};


/* ============================================================
   SUPPORTED FILE TYPES
============================================================ */

export const FILE_TYPES = [

    ".csv",

    ".xls",

    ".xlsx"

];


/* ============================================================
   GDS TYPES
============================================================ */

export const GDS_TYPES = Object.freeze({

    AMADEUS: "Amadeus",

    GALILEO: "Galileo",

    SABRE: "Sabre",

    SYSTEM: "System"

});


/* ============================================================
   COLUMN ALIASES
============================================================ */

export const COLUMN_ALIASES = Object.freeze({

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

        "traveller",

        "traveler",

        "name"

    ],

    airline: [

        "airline",

        "carrier",

        "marketing carrier",

        "airline code"

    ],

    issueDate: [

        "issue date",

        "issued date",

        "date issued",

        "document date",

        "date"

    ],

    consultant: [

        "consultant",

        "agent",

        "sales agent",

        "issued by",

        "user"

    ]

});


/* ============================================================
   STATUS VALUES
============================================================ */

export const STATUS = Object.freeze({

    VOID: "VOID"

});


/* ============================================================
   FILTER OPTIONS
============================================================ */

export const FILTERS = Object.freeze({

    ALL: "all",

    MISSING_SYSTEM: "missing-system",

    MISSING_GDS: "missing-gds",

    DUPLICATES: "duplicates",

    VOID: "void"

});


/* ============================================================
   EXPORT SHEETS
============================================================ */

export const EXPORT_SHEETS = Object.freeze({

    SUMMARY: "Summary",

    MISSING_SYSTEM: "Missing in System",

    MISSING_GDS: "Missing in GDS",

    DUPLICATES: "Duplicates",

    VOID: "VOID Records"

});


/* ============================================================
   DASHBOARD DEFAULTS
============================================================ */

export const DASHBOARD_DEFAULTS = Object.freeze({

    gdsRecords: 0,

    systemRecords: 0,

    voidRecords: 0,

    duplicateRecords: 0,

    missingSystem: 0,

    missingGDS: 0

});


/* ============================================================
   NORMALIZATION RULES
============================================================ */

export const NORMALIZATION = Object.freeze({

    AIRLINE_PREFIX_LENGTH: 3,

    TICKET_LENGTH: 10,

    REMOVE_EXCHANGE_SUFFIX: true,

    REMOVE_SPACES: true

});


/* ============================================================
   REPORT SETTINGS
============================================================ */

export const REPORT = Object.freeze({

    HEADER_SCAN_LIMIT: 50,

    EMPTY_CELL: "",

    DATE_FORMAT: "yyyy-mm-dd"

});
