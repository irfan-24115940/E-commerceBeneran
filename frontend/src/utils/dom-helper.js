/**
 * Helper sederhana untuk memilih elemen dari DOM
 * @param {string} selector CSS selector
 * @returns {HTMLElement}
 */
export const $ = (selector) => document.querySelector(selector);

/**
 * Helper sederhana untuk memilih banyak elemen dari DOM
 * @param {string} selector CSS selector
 * @returns {NodeList}
 */
export const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Helper untuk bind event listener
 * @param {HTMLElement|string} element Elemen atau selector
 * @param {string} event Nama event (click, submit, dll)
 * @param {Function} handler Callback function
 */
export const on = (element, event, handler) => {
  const el = typeof element === 'string' ? $(element) : element;
  if (el) {
    el.addEventListener(event, handler);
  }
};
