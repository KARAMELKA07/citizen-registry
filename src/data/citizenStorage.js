
import { citizens } from './citizens.js';

const STORAGE_KEY = 'citizen-registry-edits';
const CREATED_STORAGE_KEY = 'citizen-registry-created';
const DELETED_STORAGE_KEY = 'citizen-registry-deleted';

function readDeletedCitizens(strict = false) {
    try {
        const saved = localStorage.getItem(DELETED_STORAGE_KEY);
        const deleted = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(deleted) || !deleted.every(id => typeof id === 'string')) throw new Error('Invalid deleted citizens');
        return deleted;
    } catch {
        if (strict) throw new Error('Unable to read deleted citizens');
        return [];
    }
}

function readCreatedCitizens() {
    const saved = localStorage.getItem(CREATED_STORAGE_KEY);
    const created = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(created)) throw new Error('Invalid citizen storage');
    return created;
}

function readEdits(strict = false) {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const edits = saved ? JSON.parse(saved) : {};
        if (!edits || Array.isArray(edits) || typeof edits !== 'object') throw new Error('Invalid citizen edits');
        return edits;
    } catch {
        if (strict) throw new Error('Unable to read citizen edits');
        return {};
    }
}

const oldAddressFields = [
    'region',
    'city',
    'street',
    'house',
    'apartment',
];

function mergeCitizen(citizen, edit = {}) {
    const registrationAddress = {
        ...citizen.registrationAddress,
        ...edit.registrationAddress,
    };

    if (!edit.registrationAddress) {
        oldAddressFields.forEach(field => {
            if (Object.hasOwn(edit, field)) {
                registrationAddress[field] = edit[field];
            }
        });
    }

    const sameAsRegistration =
        edit.sameAsRegistration ?? citizen.sameAsRegistration;

    const residentialAddress = sameAsRegistration
        ? { ...registrationAddress }
        : {
            ...citizen.residentialAddress,
            ...edit.residentialAddress,
        };

    const otherEdits = { ...edit };
    oldAddressFields.forEach(field => {
        delete otherEdits[field];
    });
    delete otherEdits.livingAddress;

    return {
        ...citizen,
        ...otherEdits,
        registrationAddress,
        sameAsRegistration,
        residentialAddress,
    };
}

export function getCitizens() {
    const edits = readEdits();
    let created;
    try {
        created = readCreatedCitizens();
    } catch {
        created = [];
    }
    const deleted = new Set(readDeletedCitizens());
    return [...citizens, ...created].filter(citizen => !deleted.has(citizen.id)).map(citizen =>
        mergeCitizen(citizen, edits[citizen.id] || {})
    );
}

export function saveCitizen(updatedCitizen) {
    const created = readCreatedCitizens();
    const index = created.findIndex(citizen => citizen.id === updatedCitizen.id);
    if (index !== -1) {
        created[index] = {
            ...updatedCitizen,
            residentialAddress: updatedCitizen.sameAsRegistration
                ? { ...updatedCitizen.registrationAddress }
                : { ...updatedCitizen.residentialAddress },
        };
        localStorage.setItem(CREATED_STORAGE_KEY, JSON.stringify(created));
        return;
    }
    const edits = readEdits(true);

    edits[updatedCitizen.id] = {
        ...updatedCitizen,
        residentialAddress: updatedCitizen.sameAsRegistration
            ? { ...updatedCitizen.registrationAddress }
            : { ...updatedCitizen.residentialAddress },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

export function createCitizen(draft) {
    const created = readCreatedCitizens();
    const edits = readEdits(true);
    const ids = new Set([...citizens.map(citizen => citizen.id), ...created.map(citizen => citizen.id), ...Object.keys(edits), ...readDeletedCitizens(true)]);
    let number = 1;
    let id = `CIT-${String(number).padStart(3, '0')}`;
    while (ids.has(id)) {
        number += 1;
        id = `CIT-${String(number).padStart(3, '0')}`;
    }
    const citizen = { ...draft, id, createdAt: new Date().toISOString() };
    localStorage.setItem(CREATED_STORAGE_KEY, JSON.stringify([...created, citizen]));
    return citizen;
}

export function deleteCitizen(id) {
    const created = readCreatedCitizens();
    const edits = readEdits(true);
    const deleted = readDeletedCitizens(true);
    if (deleted.includes(id) || ![...citizens, ...created].some(citizen => citizen.id === id)) {
        throw new Error('Гражданин не найден');
    }

    const keys = [CREATED_STORAGE_KEY, STORAGE_KEY, DELETED_STORAGE_KEY];
    const previous = keys.map(key => localStorage.getItem(key));
    const remaining = created.filter(citizen => citizen.id !== id);
    delete edits[id];
    try {
        if (remaining.length !== created.length) localStorage.setItem(CREATED_STORAGE_KEY, JSON.stringify(remaining));
        if (previous[1] !== null) localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
        localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify([...deleted, id]));
    } catch {
        try {
            keys.forEach((key, index) => {
                if (previous[index] === null) localStorage.removeItem(key);
                else localStorage.setItem(key, previous[index]);
            });
        } catch {
            throw new Error('Не удалось удалить гражданина и восстановить данные. Проверьте хранилище браузера.');
        }
        throw new Error('Не удалось удалить гражданина. Попробуйте ещё раз.');
    }
}
