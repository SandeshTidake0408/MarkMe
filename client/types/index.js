/**
 * Type Definitions and JSDoc Types
 * 
 * This file contains type definitions for better code documentation
 * and support in vanilla JavaScript
 */

/**
 * @typedef {Object} User
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} userType - 'Student' or 'Teacher'
 * @property {string} [branch] - Student only
 * @property {string} [div] - Student only
 * @property {string} [rollNo] - Student only
 */

/**
 * @typedef {Object} Student
 * @extends {User}
 * @property {string} branch
 * @property {string} div
 * @property {string} rollNo
 * @property {number} mobileNo
 */

/**
 * @typedef {Object} Teacher
 * @extends {User}
 * @property {number} mobileNo
 */

/**
 * @typedef {Object} Session
 * @property {string} base - Session ID (subject_key)
 * @property {number} key - Session code
 * @property {string} subject
 * @property {string} year
 * @property {string} branch
 * @property {string} div
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} endTime
 */

/**
 * @typedef {Object} ApiResponse
 * @property {*} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} [status] - HTTP status code
 * @property {Object} [response] - Error response object
 * @property {Object} [response.data] - Error data
 * @property {string} [response.data.msg] - Error message from server
 * @property {boolean} [isTimeout] - Whether error is due to timeout
 * @property {boolean} [isNetworkError] - Whether error is network related
 */

/**
 * @typedef {Object} Location
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} [altitude]
 */

// Export for use in other files
if (typeof window !== 'undefined') {
    window.types = {
        // Types are available via JSDoc comments above
    };
}

