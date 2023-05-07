
// Use built-in crypto to generate a unique ID
export function generateUUID() {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    const uuid = array.join('-');
    return uuid;
}