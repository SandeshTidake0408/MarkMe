/**
 * api client: Timeout, error handling, interceptors, token management
 */

class ApiClient {
	constructor(baseURL = null, options = {}) {
		if (baseURL === null) {
			if (typeof window !== 'undefined' && window.config?.api?.baseURL) {
				this.baseURL = window.config.api.baseURL;
			} else if (typeof window !== 'undefined' && window.CONSTANTS?.API_CONFIG?.BASE_URL) {
				this.baseURL = window.CONSTANTS.API_CONFIG.BASE_URL;
			} else {
				// Default fallback
				this.baseURL = 'http://localhost:4000/api/v1';
			}
		} else {
			this.baseURL = baseURL;
		}

		// Use timeout from config if available
		const timeout = options.timeout ||
			(typeof window !== 'undefined' && window.config?.api?.timeout) ||
			30000;
		this.defaultTimeout = timeout;

		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...options.headers,
		};
	}

	/**
	 * Get authentication token from localStorage
	 */
	getToken() {
		return localStorage.getItem('token');
	}

	/**
	 * Set authentication token
	 */
	setToken(token) {
		if (token) {
			localStorage.setItem('token', token);
		} else {
			localStorage.removeItem('token');
		}
	}

	/**
	 * Create AbortController for timeout
	 */
	createAbortController(timeout) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);
		return { controller, timeoutId };
	}

	/**
	 * Build full URL
	 */
	buildURL(endpoint) {
		if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
			return endpoint;
		}
		return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
	}

	/**
	 * Build headers with authentication
	 */
	buildHeaders(customHeaders = {}) {
		const headers = { ...this.defaultHeaders, ...customHeaders };
		const token = this.getToken();

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	/**
	 * Handle response and parse JSON
	 */
	async handleResponse(response) {
		// Clone response to read it multiple times if needed
		const clonedResponse = response.clone();

		// Check if response is ok
		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch (e) {
				errorData = { msg: response.statusText || 'An error occurred' };
			}

			const error = new Error(errorData.msg || `HTTP ${response.status}: ${response.statusText}`);
			error.status = response.status;
			error.statusText = response.statusText;
			error.data = errorData;
			error.response = {
				status: response.status,
				statusText: response.statusText,
				data: errorData,
			};
			throw error;
		}

		// Parse JSON response
		try {
			const data = await response.json();
			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			};
		} catch (e) {
			// If response is not JSON, return text
			const text = await clonedResponse.text();
			return {
				data: text,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
			};
		}
	}

	/**
	 * Make HTTP request with timeout and error handling
	 */
	async request(endpoint, options = {}) {
		const {
			method = 'GET',
			body,
			headers = {},
			timeout = this.defaultTimeout,
			signal,
		} = options;

		const url = this.buildURL(endpoint);
		const requestHeaders = this.buildHeaders(headers);

		// Create abort controller for timeout
		const { controller, timeoutId } = this.createAbortController(timeout);
		const abortSignal = signal || controller.signal;

		// Prepare request body
		let requestBody = null;
		if (body) {
			if (body instanceof FormData) {
				requestBody = body;
				// Remove Content-Type header for FormData (browser will set it with boundary)
				delete requestHeaders['Content-Type'];
			} else if (typeof body === 'object') {
				requestBody = JSON.stringify(body);
			} else {
				requestBody = body;
			}
		}

		try {
			const response = await fetch(url, {
				method,
				headers: requestHeaders,
				body: requestBody,
				signal: abortSignal,
			});

			clearTimeout(timeoutId);
			return await this.handleResponse(response);
		} catch (error) {
			clearTimeout(timeoutId);

			// Handle timeout/abort
			if (error.name === 'AbortError') {
				const timeoutError = new Error('Request timeout - please try again');
				timeoutError.isTimeout = true;
				timeoutError.code = 'TIMEOUT';
				throw timeoutError;
			}

			// Handle network errors
			if (error.name === 'TypeError' && error.message.includes('fetch')) {
				const networkError = new Error('Network error - please check your connection');
				networkError.isNetworkError = true;
				networkError.code = 'NETWORK_ERROR';
				throw networkError;
			}

			// Re-throw other errors (including our custom errors from handleResponse)
			throw error;
		}
	}

	/**
	 * GET request
	 */
	async get(endpoint, options = {}) {
		return this.request(endpoint, { ...options, method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post(endpoint, data, options = {}) {
		return this.request(endpoint, { ...options, method: 'POST', body: data });
	}

	/**
	 * PUT request
	 */
	async put(endpoint, data, options = {}) {
		return this.request(endpoint, { ...options, method: 'PUT', body: data });
	}

	/**
	 * PATCH request
	 */
	async patch(endpoint, data, options = {}) {
		return this.request(endpoint, { ...options, method: 'PATCH', body: data });
	}

	/**
	 * DELETE request
	 */
	async delete(endpoint, options = {}) {
		return this.request(endpoint, { ...options, method: 'DELETE' });
	}
}

// Create and export default instance
const api = new ApiClient();

// Make available globally for vanilla JS scripts
if (typeof window !== 'undefined') {
	window.api = api;
	window.ApiClient = ApiClient;
}

// Export for ES modules
export default api;
export { ApiClient };

