/**
 * Application Constants
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:4000/api/v1',
    TIMEOUT: 30000, // 30 seconds
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/pages/auth/login.html',
    SIGNUP_STUDENT: '/pages/auth/signup.html',
    SIGNUP_TEACHER: '/pages/auth/signupTeacher.html',
    STUDENT_FEED: '/pages/student/feed.html',
    TEACHER_FEED: '/pages/teacher/feed.html',
    TEACHER_SESSION: '/pages/teacher/session.html',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    EMAIL: 'email',
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error - please check your connection',
    TIMEOUT: 'Request timeout - please try again',
    UNAUTHORIZED: 'Unauthorized - please login again',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Server error - please try again later',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    SIGNUP_SUCCESS: 'Sign up successful',
    SESSION_CREATED: 'Session created successfully',
    ATTENDANCE_MARKED: 'Attendance marked successfully',
};

// Make available globally for vanilla JS
if (typeof window !== 'undefined') {
    window.CONSTANTS = {
        API_CONFIG,
        ROUTES,
        STORAGE_KEYS,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
    };
}

