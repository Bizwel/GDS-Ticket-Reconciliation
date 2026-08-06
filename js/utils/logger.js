/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/utils/logger.js
 *
 * Centralized logging utility.
 * ============================================================================
 */

import {

    DEBUG,
    APP

} from "../config.js";


/* ============================================================================
   PRIVATE
============================================================================ */

function buildPrefix(level){

    return `[${APP.NAME}] [${level}]`;

}


/* ============================================================================
   PUBLIC
============================================================================ */

/**
 * Standard log.
 *
 * @param  {...any} args
 */
export function log(...args){

    if(!DEBUG){

        return;

    }

    console.log(

        buildPrefix("INFO"),

        ...args

    );

}


/**
 * Warning log.
 *
 * @param  {...any} args
 */
export function warn(...args){

    if(!DEBUG){

        return;

    }

    console.warn(

        buildPrefix("WARN"),

        ...args

    );

}


/**
 * Error log.
 *
 * @param  {...any} args
 */
export function error(...args){

    console.error(

        buildPrefix("ERROR"),

        ...args

    );

}


/**
 * Timing start.
 *
 * @param {string} label
 */
export function time(label){

    if(!DEBUG){

        return;

    }

    console.time(

        buildPrefix(label)

    );

}


/**
 * Timing end.
 *
 * @param {string} label
 */
export function timeEnd(label){

    if(!DEBUG){

        return;

    }

    console.timeEnd(

        buildPrefix(label)

    );

}


/**
 * Group start.
 *
 * @param {string} title
 */
export function group(title){

    if(!DEBUG){

        return;

    }

    console.group(

        buildPrefix(title)

    );

}


/**
 * Group end.
 */
export function groupEnd(){

    if(!DEBUG){

        return;

    }

    console.groupEnd();

}
