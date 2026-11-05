
import { citizens } from './citizens.js';

const STORAGE_KEY = 'citizen-registry-edits';

function readEdits() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

// Старые поля адреса из предыдущей модели
const oldAddressFields = [
    'region',
    'city',
    'street',
    'house',
    'apartment',
];

function mergeCitizen(citizen, edit = {}) {
    // Начинаем с адреса из новой модели
    const registrationAddress = {
        ...citizen.registrationAddress,
        ...edit.registrationAddress,
    };

    // Если сохранённая запись использует старую модель,
    // переносим её поля в registrationAddress
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

    // Исключаем старые адресные поля из результата
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

    return citizens.map(citizen =>
        mergeCitizen(citizen, edits[citizen.id] || {})
    );
}

export function saveCitizen(updatedCitizen) {
    const edits = readEdits();

    edits[updatedCitizen.id] = {
        ...updatedCitizen,
        residentialAddress: updatedCitizen.sameAsRegistration
            ? { ...updatedCitizen.registrationAddress }
            : { ...updatedCitizen.residentialAddress },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}
