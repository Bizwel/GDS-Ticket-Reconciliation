/**
 * ============================================================================
 * GDS Ticket Reconciliation Tool
 * Version : 2.0.0
 * File    : js/utils/dom.js
 *
 * DOM utility functions.
 * ============================================================================
 */

/* ============================================================================
   SELECTORS
============================================================================ */

/**
 * Returns the first matching element.
 *
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 * @returns {Element|null}
 */
export function $(selector, parent = document) {

    return parent.querySelector(selector);

}

/**
 * Returns all matching elements.
 *
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 * @returns {Element[]}
 */
export function $all(selector, parent = document) {

    return [...parent.querySelectorAll(selector)];

}

/**
 * Returns an element by ID.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
export function byId(id) {

    return document.getElementById(id);

}

/* ============================================================================
   ELEMENTS
============================================================================ */

/**
 * Creates an HTML element.
 *
 * @param {string} tag
 * @param {Object} [options={}]
 * @returns {HTMLElement}
 */
export function create(tag, options = {}) {

    const element = document.createElement(tag);

    if (options.className) {
        element.className = options.className;
    }

    if (options.id) {
        element.id = options.id;
    }

    if (options.text !== undefined) {
        element.textContent = options.text;
    }

    if (options.html !== undefined) {
        element.innerHTML = options.html;
    }

    if (options.attributes) {

        Object.entries(options.attributes).forEach(([key, value]) => {

            element.setAttribute(key, value);

        });

    }

    return element;

}

/**
 * Removes all child nodes.
 *
 * @param {HTMLElement} element
 */
export function clear(element) {

    while (element.firstChild) {

        element.removeChild(element.firstChild);

    }

}

/* ============================================================================
   CLASSES
============================================================================ */

export function addClass(element, className) {

    element?.classList.add(className);

}

export function removeClass(element, className) {

    element?.classList.remove(className);

}

export function toggleClass(element, className, force) {

    element?.classList.toggle(className, force);

}

export function hasClass(element, className) {

    return element?.classList.contains(className) ?? false;

}

/* ============================================================================
   VISIBILITY
============================================================================ */

export function show(element) {

    removeClass(element, "hidden");

}

export function hide(element) {

    addClass(element, "hidden");

}

/* ============================================================================
   CONTENT
============================================================================ */

export function text(element, value) {

    if (!element) return;

    element.textContent = value;

}

export function html(element, value) {

    if (!element) return;

    element.innerHTML = value;

}

/* ============================================================================
   EVENTS
============================================================================ */

/**
 * Adds an event listener.
 *
 * @param {EventTarget} element
 * @param {string} event
 * @param {Function} handler
 * @param {Object|boolean} [options]
 */
export function on(element, event, handler, options) {

    element?.addEventListener(event, handler, options);

}

export function off(element, event, handler, options) {

    element?.removeEventListener(event, handler, options);

}
