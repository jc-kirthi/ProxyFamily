/**
 * Offline Service Worker & Network Service
 * Enables offline functionality and graceful degradation
 */

// ============= NETWORK STATUS MONITOR =============
export class NetworkStatusService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = [];
    this.init();
  }

  init() {
    window.addEventListener('online', () => {
      console.log('🌐 Back online!');
      this.isOnline = true;
      this.notifyListeners('online');
    });

    window.addEventListener('offline', () => {
      console.log('📡 Offline detected');
      this.isOnline = false;
      this.notifyListeners('offline');
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    // Call immediately with current status
    callback(this.isOnline ? 'online' : 'offline');
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(status) {
    this.listeners.forEach(callback => callback(status));
  }

  getStatus() {
    return this.isOnline ? 'online' : 'offline';
  }
}

// ============= LOCAL STORAGE CACHE =============
export class CacheService {
  constructor(storageName = 'bidbuddy_cache') {
    this.storageName = storageName;
  }

  set(key, value, expirationMs = null) {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiration: expirationMs ? Date.now() + expirationMs : null
      };
      localStorage.setItem(`${this.storageName}:${key}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Cache set error:', e);
      return false;
    }
  }

  get(key) {
    try {
      const data = JSON.parse(localStorage.getItem(`${this.storageName}:${key}`));
      if (!data) return null;

      // Check expiration
      if (data.expiration && Date.now() > data.expiration) {
        this.remove(key);
        return null;
      }

      return data.value;
    } catch (e) {
      console.error('Cache get error:', e);
      return null;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(`${this.storageName}:${key}`);
      return true;
    } catch (e) {
      console.error('Cache remove error:', e);
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this.storageName));
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      console.error('Cache clear error:', e);
      return false;
    }
  }

  getAllKeys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this.storageName))
      .map(k => k.replace(`${this.storageName}:`, ''));
  }
}

// ============= API FALLBACK SERVICE =============
export class APIFallbackService {
  constructor(cacheService) {
    this.cache = cacheService;
    this.mockData = {
      '/api/proxy/calls': {
        calls: [
          { id: 1, name: "Aunty Radha", type: "aunty", relation: "Father's Sister", urgency: "high" },
          { id: 2, name: "Uncle Shankar", type: "uncle", relation: "Mother's Brother", urgency: "medium" }
        ]
      },
      '/api/proxy/deflect': {
        response: {
          success: true,
          message: "Deflection anchored on blockchain.",
          voice_cloning: "Perfect match generated"
        }
      }
    };
  }

  async fetchWithFallback(url, options = {}, cacheKey = null, cacheExpiration = 3600000) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // Cache successful response
      if (cacheKey) {
        this.cache.set(cacheKey, data, cacheExpiration);
      }

      return {
        success: true,
        data,
        source: 'network'
      };
    } catch (error) {
      console.error('❌ Network request failed:', error);

      // Try to return cached data
      if (cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          console.log('📦 Using cached data for:', cacheKey);
          return {
            success: true,
            data: cached,
            source: 'cache'
          };
        }
      }

      // Use mock data as last resort
      if (this.mockData[url]) {
        console.log('🎭 Using mock data for:', url);
        return {
          success: true,
          data: this.mockData[url],
          source: 'mock',
          message: 'Offline mode: showing sample data'
        };
      }

      return {
        success: false,
        error: error.message,
        source: 'error'
      };
    }
  }
}

// ============= SERVICE WORKER REGISTRATION =============
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker registered'))
      .catch(err => console.log('⚠️ Service Worker registration failed:', err));
  }
}

// ============= EXPORTS =============
export const networkStatusService = new NetworkStatusService();
export const cacheService = new CacheService();
export const apiFallbackService = new APIFallbackService(cacheService);
