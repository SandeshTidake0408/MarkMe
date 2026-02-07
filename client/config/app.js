/**
 * Application Configuration
 */

const config = {
    // API Configuration
    api: {
        baseURL: 'http://localhost:4000/api/v1',
        timeout: 30000,
    },
    
    // Application Settings
    app: {
        name: 'MarkMe',
        version: '1.0.0',
    },
    
    // Feature Flags
    features: {
        geolocation: true,
        ipTracking: true,
        otpVerification: true,
    },
};

// Make available globally
if (typeof window !== 'undefined') {
    window.config = config;
}

export default config;

