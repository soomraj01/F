const databaseName = 'soom-raj-portfolio';
const storeName = 'portfolio';
const projectsKey = 'projects';

// This function opens the browser database used for project data and local image files.
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// This function loads the saved project collection from IndexedDB.
export async function loadStoredProjects() {
    if (!('indexedDB' in window)) return null;
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction(storeName, 'readonly').objectStore(storeName).get(projectsKey);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

// This function stores the complete project collection without localStorage's small quota.
export async function saveStoredProjects(projects) {
    if (!('indexedDB' in window)) return false;
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction(storeName, 'readwrite').objectStore(storeName).put(projects, projectsKey);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}
