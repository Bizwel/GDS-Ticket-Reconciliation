/**
 * ============================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0
 * File    : js/validator.js
 * Purpose : Upload validation.
 * ============================================================
 */

import { CONFIG } from "./config.js";

/* ============================================================
   FILE TYPE
============================================================ */

/**
 * Validates the uploaded file extension.
 *
 * @param {File} file
 * @returns {boolean}
 */
function isSupportedExtension(file) {

    const extension =
        "." +
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    return CONFIG.files.supported.includes(
        extension
    );

}

/* ============================================================
   FILE SIZE
============================================================ */

/**
 * Validates file size.
 *
 * @param {File} file
 * @returns {boolean}
 */
function isValidSize(file) {

    const limit =
        CONFIG.validation.maximumUploadMB *
        1024 *
        1024;

    return file.size <= limit;

}

/* ============================================================
   FILE EXISTS
============================================================ */

/**
 * Ensures a file was selected.
 *
 * @param {File|null} file
 * @returns {boolean}
 */
function hasFile(file) {

    return !!file;

}

/* ============================================================
   VALIDATION
============================================================ */

/**
 * Validates a file before parsing.
 *
 * @param {File} file
 * @returns {Object}
 */
export function validateFile(file) {

    const errors = [];

    const warnings = [];

    if (!hasFile(file)) {

        errors.push(
            "No file selected."
        );

        return {

            valid: false,

            errors,

            warnings

        };

    }

    if (!isSupportedExtension(file)) {

        errors.push(
            "Unsupported file type."
        );

    }

    if (!isValidSize(file)) {

        errors.push(

            `File exceeds ${CONFIG.validation.maximumUploadMB} MB.`

        );

    }

    if (file.size === 0) {

        errors.push(
            "The selected file is empty."
        );

    }

    return {

        valid:

            errors.length === 0,

        errors,

        warnings

    };

}

/* ============================================================
   DATASET VALIDATION
============================================================ */

/**
 * Validates parsed worksheet rows.
 *
 * @param {Array[]} rows
 * @returns {Object}
 */
export function validateRows(rows) {

    const errors = [];

    const warnings = [];

    if (!Array.isArray(rows)) {

        errors.push(
            "Worksheet could not be read."
        );

    }

    else if (

        rows.length <
        CONFIG.validation.minimumRows

    ) {

        errors.push(
            "Worksheet contains insufficient rows."
        );

    }

    return {

        valid:

            errors.length === 0,

        errors,

        warnings

    };

}

/* ============================================================
   RESULT HELPERS
============================================================ */

/**
 * Returns true if a validation result is valid.
 *
 * @param {Object} result
 * @returns {boolean}
 */
export function isValid(result) {

    return result.valid;

}

/**
 * Combines multiple validation results.
 *
 * @param  {...Object} results
 * @returns {Object}
 */
export function mergeResults(...results) {

    const merged = {

        valid: true,

        errors: [],

        warnings: []

    };

    results.forEach(result => {

        if (!result.valid) {

            merged.valid = false;

        }

        merged.errors.push(
            ...result.errors
        );

        merged.warnings.push(
            ...result.warnings
        );

    });

    return merged;

}
