/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/validator.js
 *
 * Validates uploaded files before parsing.
 * ============================================================================
 */

import {

    FILE_TYPES,
    PARSER

} from "./config.js";

/* ============================================================================
   FILE EXTENSION
============================================================================ */

/**
 * Returns file extension.
 *
 * @param {File} file
 * @returns {string}
 */
export function getExtension(file){

    if(!file){

        return "";

    }

    const parts =

        file.name.split(".");

    return parts
        .pop()
        .toLowerCase();

}


/* ============================================================================
   FILE TYPE
============================================================================ */

/**
 * Checks if extension is supported.
 *
 * @param {File} file
 * @returns {boolean}
 */
export function isSupportedFile(file){

    return FILE_TYPES.ALL.includes(

        getExtension(file)

    );

}


/* ============================================================================
   FILE SIZE
============================================================================ */

/**
 * Returns size in MB.
 *
 * @param {File} file
 * @returns {number}
 */
export function fileSizeMB(file){

    return Number(

        (

            file.size /

            (1024 * 1024)

        ).toFixed(2)

    );

}


/**
 * Checks maximum file size.
 *
 * @param {File} file
 * @returns {boolean}
 */
export function isValidSize(file){

    return (

        fileSizeMB(file)

        <=

        PARSER.MAX_FILE_SIZE_MB

    );

}


/* ============================================================================
   EMPTY FILE
============================================================================ */

/**
 * Checks for empty file.
 *
 * @param {File} file
 * @returns {boolean}
 */
export function isEmptyFile(file){

    return file.size === 0;

}


/* ============================================================================
   FILE VALIDATION
============================================================================ */

/**
 * Validates uploaded file.
 *
 * @param {File} file
 * @returns {{valid:boolean,message:string}}
 */
export function validateFile(file){

    if(!file){

        return{

            valid:false,

            message:

                "No file selected."

        };

    }

    if(!isSupportedFile(file)){

        return{

            valid:false,

            message:

                "Unsupported file format."

        };

    }

    if(isEmptyFile(file)){

        return{

            valid:false,

            message:

                "Uploaded file is empty."

        };

    }

    if(!isValidSize(file)){

        return{

            valid:false,

            message:

                `Maximum file size is ${PARSER.MAX_FILE_SIZE_MB} MB.`

        };

    }

    return{

        valid:true,

        message:""

    };

}


/* ============================================================================
   MULTIPLE FILES
============================================================================ */

/**
 * Validates two uploaded files.
 *
 * @param {File} gdsFile
 * @param {File} systemFile
 * @returns {{valid:boolean,message:string}}
 */
export function validateUploads(

    gdsFile,

    systemFile

){

    const gds =

        validateFile(

            gdsFile

        );

    if(!gds.valid){

        return gds;

    }

    const system =

        validateFile(

            systemFile

        );

    if(!system.valid){

        return system;

    }

    return{

        valid:true,

        message:""

    };

}
