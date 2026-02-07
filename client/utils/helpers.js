/**
 * Utility Helper Functions
 */

/**
 * Get query parameter from URL
 */
export function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Set item in localStorage with error handling
 */
export function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error setting localStorage:', error);
        return false;
    }
}

/**
 * Get item from localStorage with error handling
 */
export function getStorageItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error getting localStorage:', error);
        return null;
    }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing localStorage:', error);
        return false;
    }
}

/**
 * Clear all localStorage
 */
export function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format date for filename (removes special characters)
 */
export function formatDateForFilename(date) {
    return formatDate(date).replace(/[^\w\s]/g, '-');
}

/**
 * Show message to user
 */
export function showMessage(element, message, type = 'info') {
    if (!element) return;
    
    const colors = {
        success: '#40ba55',
        error: '#ff3f3f',
        info: '#333333',
        warning: '#ffa500',
    };
    
    element.style.color = colors[type] || colors.info;
    element.textContent = message;
    
    // Auto-clear after 3 seconds for success/info
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            element.textContent = '';
        }, 3000);
    }
}

/**
 * Navigate to URL
 */
export function navigateTo(url) {
    window.location.href = url;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    const token = getStorageItem('token');
    return !!token;
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        navigateTo('/pages/auth/login.html');
        return false;
    }
    return true;
}

// Make available globally for vanilla JS
if (typeof window !== 'undefined') {
    window.helpers = {
        getQueryParam,
        setStorageItem,
        getStorageItem,
        removeStorageItem,
        clearStorage,
        formatDate,
        formatDateForFilename,
        showMessage,
        navigateTo,
        isAuthenticated,
        requireAuth,
    };
}

