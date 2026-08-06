/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/reconciler.js
 *
 * Reconciliation Engine
 * ============================================================================
 */

import { log } from "./utils/logger.js";

import {

    RESULT_STATUS,

    STATUS_LABELS

} from "./config.js";

/* ============================================================================
   RESULT FACTORY
============================================================================ */

function createResult() {

    return {

         records: [],

        gdsMatched: [],

        gdsMissingInSystem: [],

        systemMissingInGDS: [],

        duplicateAnalysis: {

            gds: [],

            system: []

         },

        statistics: {

            gdsRecords: 0,

            systemRecords: 0,

            matched: 0,

            missingInSystem: 0,

            missingInGDS: 0,

            duplicateTickets: 0,

            duplicateRecords: 0,

            voidGDS: 0,

            voidSystem: 0,

            matchPercentage: 0,

            processingTime: 0

        },

        diagnostics: {

            gdsProvider: "",

            systemProvider: "",

            comparedTickets: 0,

            matchedTickets: 0,

            startedAt: 0,

            finishedAt: 0

        }

    };

}

/* ============================================================================
   INDEX BUILDER
============================================================================ */

/**
 * Builds a ticket index.
 *
 * @param {Array<Object>} records
 * @returns {Map<string, Array<Object>>}
 */
function buildTicketIndex(records) {

    const index = new Map();

    records.forEach(record => {

        if (!index.has(record.ticket)) {

            index.set(record.ticket, []);

        }

        index.get(record.ticket).push(record);

    });

    return index;

}
/* ============================================================================
   RECONCILIATION ITEM FACTORY
============================================================================ */

/**
 * Creates a reconciliation item.
 *
 * @param {Object} options
 * @returns {Object}
 */
function createReconciliationItem({

    ticket,

    status,

    gds = [],

    system = [],

    records = []

}){

    return {

        ticket,

        status,

        statusLabel:

            STATUS_LABELS[status],

        gds,

        system,

        records

    };

}
/* ============================================================================
   MATCHING ENGINE
============================================================================ */

/**
 * Compares two ticket indexes.
 *
 * @param {Map<string, Array<Object>>} gdsIndex
 * @param {Map<string, Array<Object>>} systemIndex
 * @param {Object} result
 */
function compareIndexes(
    gdsIndex,
    systemIndex,
    result
) {

    /* ------------------------------------------------------------------------
       GDS -> SYSTEM
    ------------------------------------------------------------------------ */

    gdsIndex.forEach((gdsRecords, ticket) => {

        result.diagnostics.comparedTickets++;

        if (systemIndex.has(ticket)) {

            const systemRecords = systemIndex.get(ticket);

           const item = {

    ticket,

   status: RESULT_STATUS.MATCHED;

    gds: gdsRecords,

    system: systemRecords

};

result.gdsMatched.push(item);

result.records.push(item);

        } else {

          const item = createReconciliationItem({

    ticket,

    status: RESULT_STATUS.MISSING_IN_SYSTEM,

    records: gdsRecords

});

result.gdsMissingInSystem.push(item);

result.records.push(item);

const item = {

    ticket,

    status: "MISSING_IN_GDS",

    records: systemRecords

};

   result.systemMissingInGDS.push(item);
   
   result.records.push(item);

});

    /* ------------------------------------------------------------------------
       SYSTEM -> GDS
    ------------------------------------------------------------------------ */

    systemIndex.forEach((systemRecords, ticket) => {

        if (!gdsIndex.has(ticket)) {

            result.systemMissingInGDS.push({

                ticket,

                records: systemRecords

            });

        }

    });

}
/* ============================================================================
   STATISTICS
============================================================================ */

function buildStatistics(
    result,
    gdsDataset,
    systemDataset
) {

    result.statistics.totalResults =
    result.records.length;
    
    result.statistics.gdsRecords =
        gdsDataset.records.length;

    result.statistics.systemRecords =
        systemDataset.records.length;

    result.statistics.matched =
        result.gdsMatched.length;

    result.statistics.missingInSystem =
        result.gdsMissingInSystem.length;

    result.statistics.missingInGDS =
        result.systemMissingInGDS.length;

    result.statistics.voidGDS =
        gdsDataset.voidRecords.length;

    result.statistics.voidSystem =
        systemDataset.voidRecords.length;

    result.statistics.duplicateTickets =

        gdsDataset.duplicateGroups.length +

        systemDataset.duplicateGroups.length;

    result.statistics.duplicateRecords =

        gdsDataset.duplicateGroups.reduce(

            (sum, group) => sum + group.records.length,

            0

        ) +

        systemDataset.duplicateGroups.reduce(

            (sum, group) => sum + group.records.length,

            0

        );

    if (result.statistics.gdsRecords > 0) {

        result.statistics.matchPercentage = Number(

            (

                result.statistics.matched /

                result.statistics.gdsRecords *

                100

            ).toFixed(2)

        );

    }

}
/* ============================================================================
   DIAGNOSTICS
============================================================================ */

function buildDiagnostics(
    result,
    gdsDataset,
    systemDataset,
    started
) {

    result.diagnostics.gdsProvider =
        gdsDataset.provider;

    result.diagnostics.systemProvider =
        systemDataset.provider;

    result.diagnostics.matchedTickets =
        result.statistics.matched;

    result.diagnostics.finishedAt =
        performance.now();

    result.statistics.processingTime = Number(

        (

            result.diagnostics.finishedAt -

            started

        ).toFixed(2)

    );

}
/* ============================================================================
   PUBLIC API
============================================================================ */

/**
 * Reconciles two datasets.
 *
 * @param {Object} gdsDataset
 * @param {Object} systemDataset
 * @returns {Object}
 */
export function reconcileDatasets(
    gdsDataset,
    systemDataset
) {

    const started = performance.now();

    const result = createResult();

    const gdsIndex =
        buildTicketIndex(
            gdsDataset.records
        );

    const systemIndex =
        buildTicketIndex(
            systemDataset.records
        );

    compareIndexes(
        gdsIndex,
        systemIndex,
        result
    );

    buildStatistics(
        result,
        gdsDataset,
        systemDataset
    );

    buildDiagnostics(
        result,
        gdsDataset,
        systemDataset,
        started
    );

    result.duplicateAnalysis.gds =
        gdsDataset.duplicateGroups;

    result.duplicateAnalysis.system =
        systemDataset.duplicateGroups;

    log("Reconciliation Complete", result);

    return result;

}
