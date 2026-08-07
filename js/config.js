/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * Version 2.0
 * File: js/config.js
 * ============================================================
 */

export const CONFIG = Object.freeze({

    /* ========================================================
       APPLICATION
    ======================================================== */

    app: {

        name: "GDS Ticket Reconciliation Tool",

        version: "2.0.0",

        author: "Business Well Technologies"

    },

    /* ========================================================
       PROVIDERS
    ======================================================== */

    providers: {

        AMADEUS: "amadeus",

        GALILEO: "galileo",

        SABRE: "sabre",

        SYSTEM: "system"

    },

    /* ========================================================
       SUPPORTED FILE TYPES
    ======================================================== */

    files: {

        supported: [

            ".xlsx",

            ".xls",

            ".csv"

        ],

        mimeTypes: [

            "application/vnd.ms-excel",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            "text/csv"

        ]

    },

    /* ========================================================
       REPORT SIGNATURES
    ======================================================== */

    signatures: {

        amadeus: {

            ticketHeaders: [

                "no"

            ]

        },

        galileo: {

            ticketHeaders: [

                "number"

            ]

        },

        sabre: {

            ticketHeaders: [

                "ticket #"

            ]

        }

    },

    /* ========================================================
       COLUMN ALIASES
    ======================================================== */

    columns: {

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

        passenger: [

            "passenger",

            "passenger name",

            "traveller",

            "traveler",

            "name"

        ],

        status: [

            "status",

            "ticket status",

            "document status"

        ],

        airline: [

            "airline",

            "carrier",

            "marketing carrier"

        ],

        consultant: [

            "consultant",

            "agent",

            "sales agent",

            "issued by"

        ],

        issueDate: [

            "issue date",

            "issued date",

            "document date",

            "date"

        ]

    },

    /* ========================================================
       BUSINESS STATUS
    ======================================================== */

    status: {

        VOID: "VOID"

    },

    /* ========================================================
       RESULT TYPES
    ======================================================== */

    resultTypes: {

        MATCHED: "matched",

        MISSING_SYSTEM: "missing-system",

        MISSING_GDS: "missing-gds",

        DUPLICATE: "duplicate",

        VOID: "void"

    },

    /* ========================================================
       EXPORT SHEETS
    ======================================================== */

    exportSheets: {

        SUMMARY: "Summary",

        MATCHED: "Matched",

        MISSING_SYSTEM: "Missing in System",

        MISSING_GDS: "Missing in GDS",

        DUPLICATES: "Duplicate Groups",

        VOID: "VOID",

        AUDIT: "Audit Log"

    },

    /* ========================================================
       VALIDATION
    ======================================================== */

    validation: {

        maxHeaderScan: 50,

        minimumRows: 2,

        maximumUploadMB: 50

    },

    /* ========================================================
       NORMALIZATION
    ======================================================== */

    normalization: {

        airlinePrefixDigits: 3,

        removeExchangeSuffix: true,

        removeSpaces: true,

        normalizedTicketLength: 10

    },

    /* ========================================================
       PERFORMANCE
    ======================================================== */

    performance: {

        batchRender: 500,

        searchDebounce: 250,

        maxVisibleRows: 1000

    },

    /* ========================================================
       UI DEFAULTS
    ======================================================== */

    ui: {

        defaultView: "missing-system",

        defaultSearch: "",

        defaultFilter: "all"

    }

});
