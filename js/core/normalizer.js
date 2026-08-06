/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/normalizer.js
 *
 * Normalization engine.
 * ============================================================================
 */

import {

    NORMALIZATION,
    STATUS

} from "./config.js";

import {

    cleanText,
    upper

} from "./utils/helpers.js";


/* ============================================================================
   PRIVATE PIPELINE FUNCTIONS
============================================================================ */

/**
 * Removes leading airline prefix.
 *
 * Example:
 * 157-4854655725 -> 4854655725
 * 071 2617231450 -> 2617231450
 */
function removePrefix(ticket){

    return ticket.replace(

        /^\d{3}[- ]?/,

        ""

    );

}


/**
 * Removes coupon/range suffix.
 *
 * Example:
 * 2617231450-451
 * ->
 * 2617231450
 */
function removeSuffix(ticket){

    return ticket.replace(

        /-\d+$/,

        ""

    );

}


/**
 * Removes spaces.
 */
function removeSpaces(ticket){

    return ticket.replace(/\s+/g,"");

}


/**
 * Keeps digits only.
 */
function digitsOnly(ticket){

    return ticket.replace(/\D/g,"");

}


/**
 * Validates normalized ticket.
 */
function validateTicket(ticket){

    if(

        ticket.length <

        NORMALIZATION.NORMALIZED_TICKET_LENGTH

    ){

        return "";

    }

    return ticket;

}


/* ============================================================================
   PUBLIC
============================================================================ */

/**
 * Normalizes ticket.
 *
 * @param {*} value
 * @returns {string}
 */
export function normalizeTicket(value){

    let ticket =

        cleanText(value);

    ticket =

        removePrefix(ticket);

    ticket =

        removeSuffix(ticket);

    ticket =

        removeSpaces(ticket);

    ticket =

        digitsOnly(ticket);

    ticket =

        validateTicket(ticket);

    return ticket;

}


/**
 * Passenger.
 */
export function normalizePassenger(value){

    return upper(value);

}


/**
 * Consultant.
 */
export function normalizeConsultant(value){

    return upper(value);

}


/**
 * Status.
 */
export function normalizeStatus(value){

    const status =

        upper(value);

    return status === STATUS.VOID

        ? STATUS.VOID

        : STATUS.ACTIVE;

}


/**
 * Generic text.
 */
export function normalizeTextField(value){

    return cleanText(value);

}


/**
 * Builds canonical record.
 *
 * @param {Object} record
 * @returns {Object}
 */
export function normalizeRecord(record){

    return {

        ...record,

        ticket:

            normalizeTicket(

                record.originalTicket

            ),

        passenger:

            normalizePassenger(

                record.passenger

            ),

        consultant:

            normalizeConsultant(

                record.consultant

            ),

        status:

            normalizeStatus(

                record.status

            )

    };

}


/**
 * Dataset.
 *
 * @param {Array<Object>} records
 * @returns {Array<Object>}
 */
export function normalizeDataset(records){

    return records.map(

        normalizeRecord

    );

}
