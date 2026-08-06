/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/utils/search.js
 *
 * Generic search utilities.
 * ============================================================================
 */

import {

    SEARCHABLE_FIELDS

} from "../config.js";

import {

    normalizeText

} from "./helpers.js";

/**
 * Filters records by search text.
 *
 * @param {Array<Object>} records
 * @param {string} query
 * @returns {Array<Object>}
 */
export function searchRecords(records = [], query = ""){

    const search = normalizeText(query);

    if(!search){

        return records;

    }

    return records.filter(record =>

        SEARCHABLE_FIELDS.some(field =>

            normalizeText(

                record[field]

            ).includes(search)

        )

    );

}
