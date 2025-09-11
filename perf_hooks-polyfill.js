// Polyfill for the perf_hooks module
// Based on Node.js perf_hooks module implementation

export class PerformanceObserver {
    constructor(callback) {
        this.callback = callback;
        this._entryTypes = [];
    }

    observe(options = {}) {
        if (options.entryTypes) {
            this._entryTypes = [...options.entryTypes];
        } else if (options.type) {
            this._entryTypes = [options.type];
        }
    }

    disconnect() {
        this._entryTypes = [];
    }

    static supportedEntryTypes = ['measure', 'navigation', 'resource'];
}

export class PerformanceEntry {
    constructor(name, entryType, startTime, duration) {
        this.name = name;
        this.entryType = entryType;
        this.startTime = startTime;
        this.duration = duration;
    }
}

// Also export as default
const perf_hooks = {
    PerformanceObserver,
    PerformanceEntry
};

export default perf_hooks;