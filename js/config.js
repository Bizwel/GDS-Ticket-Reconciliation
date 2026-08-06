/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/config.js
 * Author  : Business Well Technologies
 *
 * Application configuration and global constants.
 * ============================================================================
 */

/* ============================================================================
   APPLICATION
============================================================================ */

export const APP = Object.freeze({

    NAME: "GDS Ticket Reconciliation Tool",

    VERSION: "2.0.0",

    AUTHOR: "Business Well Technologies",

    DESCRIPTION:
        "GDS Sales Report Reconciliation Tool",

    BUILD_DATE: "2026-08-05"

});


/* ============================================================================
   FILE SUPPORT
============================================================================ */

export const FILE_TYPES = Object.freeze({

    EXCEL: ["xls", "xlsx"],

    CSV: ["csv"],

    ALL: ["xls", "xlsx", "csv"]

});


/* ============================================================================
   GDS TYPES
============================================================================ */

export const GDS = Object.freeze({

    AMADEUS: "Amadeus",

    GALILEO: "Galileo",

    SABRE: "Sabre",

    SYSTEM: "System",

    UNKNOWN: "Unknown"

});


/* ============================================================================
   REPORT SIGNATURES
   Used during automatic report detection.
============================================================================ */

export const REPORT_SIGNATURES = Object.freeze({

    [GDS.AMADEUS]: {

        ticket: ["no"],

        required: ["no"]

    },

    [GDS.GALILEO]: {

        ticket: ["number"],

        required: ["number"]

    },

    [GDS.SABRE]: {

        ticket: ["ticket #"],

        required: ["ticket #"]

    }

});


/* ============================================================================
   COLUMN ALIASES
============================================================================ */

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


/* ============================================================================
   STATUS VALUES
============================================================================ */

export const STATUS = Object.freeze({

    VOID: "VOID",

    ACTIVE: "ACTIVE",

    UNKNOWN: ""

});


/* ============================================================================
   RESULT VIEWS
============================================================================ */

export const RESULT_STATUS = Object.freeze({

    MATCHED: "MATCHED",

    MISSING_IN_SYSTEM: "MISSING_IN_SYSTEM",

    MISSING_IN_GDS: "MISSING_IN_GDS",

    DUPLICATE: "DUPLICATE",

    VOID: "VOID"

});


/* ============================================================================
   EXPORT SHEETS
============================================================================ */

export const EXPORT_SHEETS = Object.freeze({

    SUMMARY: "Summary",

    MATCHED: "Matched",

    MISSING_SYSTEM: "Missing in System",

    MISSING_GDS: "Missing in GDS",

    DUPLICATE_GDS: "Duplicate GDS",

    DUPLICATE_SYSTEM: "Duplicate System",

    VOID_GDS: "VOID GDS",

    VOID_SYSTEM: "VOID System",

    AUDIT: "Audit Log"

});


/* ============================================================================
   NORMALIZATION
============================================================================ */

export const NORMALIZATION = Object.freeze({

    AIRLINE_PREFIX_LENGTH: 3,

    NORMALIZED_TICKET_LENGTH: 10,

    REMOVE_PREFIX: true,

    REMOVE_SUFFIX: true,

    REMOVE_SPACES: true,

    UPPERCASE_TEXT: true

});


/* ============================================================================
   PARSER
============================================================================ */

export const PARSER = Object.freeze({

    HEADER_SCAN_LIMIT: 50,

    EMPTY_VALUE: "",

    MAX_FILE_SIZE_MB: 25

});


/* ============================================================================
   SEARCH
============================================================================ */

export const SEARCHABLE_FIELDS = Object.freeze([

    "ticket",

    "originalTicket",

    "passenger",

    "consultant",

    "airline",

    "status",

    "reason"

]);


/* ============================================================================
   DASHBOARD
============================================================================ */

export const DASHBOARD = Object.freeze({

    DEFAULTS: {

        gdsRecords: 0,

        systemRecords: 0,

        matched: 0,

        missingSystem: 0,

        missingGDS: 0,

        duplicateGroups: 0,

        voidRecords: 0,

        processingTime: 0

    }

});


/* ============================================================================
   UI
============================================================================ */

export const UI = Object.freeze({

    DATE_FORMAT: "yyyy-MM-dd",

    PAGE_SIZE: 100,

    DEFAULT_VIEW: RESULT_TYPES.MISSING_SYSTEM

});


/* ============================================================================
   DEBUG
============================================================================ */

export const DEBUG = false;
