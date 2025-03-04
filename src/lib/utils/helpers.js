export function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

export function getDeviceId() {
    if (localStorage.getItem("deviceId")) {
        return localStorage.getItem("deviceId");
    }

    const deviceId = uuidv4();
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
}

export function getDomain() {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length > 2) {
        return parts.slice(-2).join(".");
    }
    return hostname;
} 