// Polyfill for the net module that provides the isIP function
// Based on Node.js net module implementation

export function isIP(input) {
    if (typeof input !== 'string') {
        return 0;
    }

    // Check for IPv4
    if (isIPv4(input)) {
        return 4;
    }

    // Check for IPv6
    if (isIPv6(input)) {
        return 6;
    }

    return 0;
}

export function isIPv4(input) {
    if (typeof input !== 'string') {
        return false;
    }

    const parts = input.split('.');
    if (parts.length !== 4) {
        return false;
    }

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!/^\d+$/.test(part)) {
            return false;
        }

        const num = parseInt(part, 10);
        if (num < 0 || num > 255 || (part.length > 1 && part[0] === '0')) {
            return false;
        }
    }

    return true;
}

export function isIPv6(input) {
    if (typeof input !== 'string') {
        return false;
    }

    // Remove brackets if present
    if (input.startsWith('[') && input.endsWith(']')) {
        input = input.slice(1, -1);
    }

    // Check for compressed format
    const hasDoubleColon = input.includes('::');
    if (hasDoubleColon) {
        // Count the number of colons to determine how many segments are missing
        const colonCount = (input.match(/:/g) || []).length;
        if (colonCount > 7) {
            return false;
        }
    } else {
        // For non-compressed format, must have exactly 7 colons (8 segments)
        const colonCount = (input.match(/:/g) || []).length;
        if (colonCount !== 7) {
            return false;
        }
    }

    // Basic validation - this is a simplified check
    const segments = input.split(':');
    if (segments.length > 8) {
        return false;
    }

    // Check each segment
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        // Empty segment is allowed only for :: compression
        if (segment === '') {
            continue;
        }

        // Each segment should be a valid hex number (0-FFFF)
        if (!/^[0-9a-fA-F]{1,4}$/.test(segment)) {
            return false;
        }
    }

    return true;
}

// Also export as default
const net = {
    isIP,
    isIPv4,
    isIPv6
};

export default net;