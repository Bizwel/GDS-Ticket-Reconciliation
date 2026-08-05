/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * File: js/reconciler.js
 * Description:
 * Compares parsed GDS and System reports.
 * ============================================================
 */

/* ============================================================
   INDEX BUILDER
============================================================ */

/**
 * Creates a ticket index.
 *
 * @param {Array} records
 * @returns {Map}
 */
function buildIndex(records) {

    const index = new Map();

    records.forEach(record => {

        index.set(

            record.ticket,

            record

        );

    });

    return index;

}


/* ============================================================
   MATCHED
============================================================ */

function findMatched(

    gdsIndex,

    systemIndex

) {

    const matched = [];

    gdsIndex.forEach(record => {

        if (

            systemIndex.has(
                record.ticket
            )

        ) {

            matched.push({

                gds: record,

                system:

                    systemIndex.get(

                        record.ticket

                    )

            });

        }

    });

    return matched;

}


/* ============================================================
   MISSING IN SYSTEM
============================================================ */

function findMissingInSystem(

    gdsIndex,

    systemIndex

) {

    const missing = [];

    gdsIndex.forEach(record => {

        if (

            !systemIndex.has(

                record.ticket

            )

        ) {

            missing.push({

                ...record,

                reason:

                    "Missing in System"

            });

        }

    });

    return missing;

}


/* ============================================================
   MISSING IN GDS
============================================================ */

function findMissingInGDS(

    gdsIndex,

    systemIndex

) {

    const missing = [];

    systemIndex.forEach(record => {

        if (

            !gdsIndex.has(

                record.ticket

            )

        ) {

            missing.push({

                ...record,

                reason:

                    "Missing in GDS"

            });

        }

    });

    return missing;

}


/* ============================================================
   PUBLIC API
============================================================ */

/**
 * Reconciles two parsed reports.
 *
 * @param {Object} gds
 * @param {Object} system
 * @returns {Object}
 */
export function reconcile(

    gds,

    system

) {

    const gdsIndex =

        buildIndex(

            gds.records

        );

    const systemIndex =

        buildIndex(

            system.records

        );

    const matched =

        findMatched(

            gdsIndex,

            systemIndex

        );

    const missingSystem =

        findMissingInSystem(

            gdsIndex,

            systemIndex

        );

    const missingGDS =

        findMissingInGDS(

            gdsIndex,

            systemIndex

        );

    return {

        matched,

        missingSystem,

        missingGDS,

        duplicateGDS:

            gds.duplicates,

        duplicateSystem:

            system.duplicates,

        voidGDS:

            gds.voidRecords,

        voidSystem:

            system.voidRecords,

        summary: {

            gdsRecords:

                gds.records.length,

            systemRecords:

                system.records.length,

            matched:

                matched.length,

            missingSystem:

                missingSystem.length,

            missingGDS:

                missingGDS.length,

            duplicateGDS:

                gds.duplicates.length,

            duplicateSystem:

                system.duplicates.length,

            voidGDS:

                gds.voidRecords.length,

            voidSystem:

                system.voidRecords.length

        }

    };

}
