export function createEmptyCitizen() {
    return {
        lastName: '', firstName: '', middleName: '', birthDate: '',
        gender: 'not_specified', recordStatus: 'active', educationLevel: '',
        phone: '', additionalPhone: '', email: '', preferredContact: '', contactComment: '',
        registrationAddress: { region: '', city: '', street: '', house: '', apartment: '' },
        sameAsRegistration: true,
        residentialAddress: { region: '', city: '', street: '', house: '', apartment: '' },
        notes: '',
    };
}

export function hasCitizenChanges(citizen, draft, photo, photoRemoved) {
    if (!draft) return false;
    if (photo) return true;
    if (photoRemoved && (citizen.photoId || citizen.photoUrl)) return true;
    const original = { ...citizen, phone: phoneDigits(citizen.phone), additionalPhone: phoneDigits(citizen.additionalPhone) };
    const current = { ...draft, phone: phoneDigits(draft.phone), additionalPhone: phoneDigits(draft.additionalPhone) };
    return JSON.stringify(original) !== JSON.stringify(current);
}

export function validatePhoto(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !/\.(jpe?g|png|webp)$/i.test(file.name)) {
        return 'Выберите изображение JPEG, PNG или WebP.';
    }
    if (file.size > 5 * 1024 * 1024) return 'Размер фотографии не должен превышать 5 МБ.';
    return '';
}

export function phoneDigits(phone = '') {
    const text = String(phone).trim();
    const digits = text.replace(/\D/g, '');
    if (text.startsWith('+7')) return digits.slice(1, 11);
    if (digits.length === 11 && /^[78]/.test(digits)) return digits.slice(1);
    return digits.slice(0, 10);
}

function formatPhone(phone) {
    const digits = phoneDigits(phone);
    if (!digits) return '';
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
}

export function validateCitizen(draft, today = new Date()) {
    const errors = {};
    if (!draft.lastName.trim()) errors.lastName = 'Укажите фамилию';
    if (!draft.firstName.trim()) errors.firstName = 'Укажите имя';
    if (!draft.recordStatus) errors.recordStatus = 'Выберите статус';

    if (draft.birthDate) {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(draft.birthDate);
        const date = match ? new Date(`${draft.birthDate}T00:00:00Z`) : null;
        const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        if (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== draft.birthDate || draft.birthDate > currentDate) {
            errors.birthDate = 'Укажите корректную дату рождения не в будущем';
        }
    }

    if (!draft.phone.trim()) errors.phone = 'Укажите номер телефона';
    else if (phoneDigits(draft.phone).length !== 10) errors.phone = 'Введите 10 цифр после +7';
    if (draft.additionalPhone.trim() && phoneDigits(draft.additionalPhone).length !== 10) {
        errors.additionalPhone = 'Введите 10 цифр после +7';
    }
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) {
        errors.email = 'Введите корректный email';
    }
    if (!draft.registrationAddress.region.trim()) errors['registrationAddress.region'] = 'Укажите регион регистрации';
    if (!draft.sameAsRegistration && !draft.residentialAddress.region.trim()) {
        errors['residentialAddress.region'] = 'Укажите регион проживания';
    }
    return errors;
}

export function prepareCitizen(draft) {
    return {
        ...draft,
        lastName: draft.lastName.trim(),
        firstName: draft.firstName.trim(),
        middleName: draft.middleName.trim(),
        phone: formatPhone(draft.phone),
        additionalPhone: formatPhone(draft.additionalPhone),
        email: draft.email.trim(),
        registrationAddress: { ...draft.registrationAddress },
        residentialAddress: draft.sameAsRegistration ? { ...draft.registrationAddress } : { ...draft.residentialAddress },
    };
}
