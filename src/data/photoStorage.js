function openPhotoDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('citizen-registry-photos', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('photos');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Не удалось открыть хранилище фотографий'));
    });
}

async function accessPhoto(mode, action) {
    const database = await openPhotoDatabase();
    try {
        return await new Promise((resolve, reject) => {
            const transaction = database.transaction('photos', mode);
            const request = action(transaction.objectStore('photos'));
            transaction.oncomplete = () => resolve(request.result);
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error || new Error('Операция отменена'));
        });
    } finally {
        database.close();
    }
}

export async function savePhoto(file) {
    const id = crypto.randomUUID();
    await accessPhoto('readwrite', store => store.add(file, id));
    return id;
}

export function getPhoto(id) {
    return accessPhoto('readonly', store => store.get(id));
}

export function deletePhoto(id) {
    return accessPhoto('readwrite', store => store.delete(id));
}
