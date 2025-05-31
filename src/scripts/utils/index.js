/**
 * 
 * @param {string} date 
 * @param {string} [locale='en-US']
 * @param {Object} [options={}]
 * @returns {string} 
 */
export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * 
 * @param {number} [time=1000] 
 * @returns {Promise} 
 */
export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
