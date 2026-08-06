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
/* ============================================================================
   MATCHED
============================================================================ */

function processMatched(

    ticket,

    gdsRecords,

    systemRecords,

    result

){

    const item = createReconciliationItem({

        ticket,

        status: RESULT_STATUS.MATCHED,

        gds: gdsRecords,

        system: systemRecords

    });

    item.gdsCount = gdsRecords.length;

    item.systemCount = systemRecords.length;

    item.isDuplicate =

        item.gdsCount > 1 ||

        item.systemCount > 1;

    result.gdsMatched.push(item);

    result.records.push(item);

}
function compareIndexes(

    gdsIndex,

    systemIndex,

    result

){

    gdsIndex.forEach((gdsRecords, ticket) => {

        result.diagnostics.comparedTickets++;

        if(systemIndex.has(ticket)){

            processMatched(

                ticket,

                gdsRecords,

                systemIndex.get(ticket),

                result

            );

        }else{

            processMissingSystem(

                ticket,

                gdsRecords,

                result

            );

        }

    });

    systemIndex.forEach((systemRecords, ticket) => {

        if(!gdsIndex.has(ticket)){

            processMissingGDS(

                ticket,

                systemRecords,

                result

            );

        }

    });

}

 /* ============================================================================
   MISSING IN SYSTEM
============================================================================ */

function processMissingSystem(

    ticket,

    records,

    result

){

    const item = createReconciliationItem({

        ticket,

        status: RESULT_STATUS.MISSING_IN_SYSTEM,

        records

    });

    item.gdsCount = records.length;

    item.systemCount = 0;

    item.totalOccurrences =
    item.gdsCount +
    item.systemCount;

    item.isDuplicate =

        records.length > 1;

    result.records.sort(

    (a,b)=>

        a.ticket.localeCompare(

            b.ticket

        )

);

    result.gdsMissingInSystem.push(item);

    result.records.push(item);

}

   /* ============================================================================
   MISSING IN GDS
============================================================================ */

function processMissingGDS(

    ticket,

    records,

    result

){

    const item = createReconciliationItem({

        ticket,

        status: RESULT_STATUS.MISSING_IN_GDS,

        records

    });

    item.gdsCount = 0;

    item.systemCount = records.length;
    
    item.totalOccurrences =
    item.gdsCount +
    item.systemCount;

    item.isDuplicate =

        records.length > 1;

    result.records.sort(

    (a,b)=>

        a.ticket.localeCompare(

            b.ticket

        )

);

    result.systemMissingInGDS.push(item);

    result.records.push(item);

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
