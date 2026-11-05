import { useState } from 'react';
import { saveCitizen } from '../data/citizenStorage.js';

export function phoneDigits(phone = '') {
    const text = String(phone).trim();
    const digits = text.replace(/\D/g, '');

    if (text.startsWith('+7')) {
        return digits.slice(1, 11);
    }

    if (digits.length === 11 && /^[78]/.test(digits)) {
        return digits.slice(1);
    }

    return digits.slice(0, 10);
}

function formatPhone(phone) {
    const digits = phoneDigits(phone);

    if (!digits) return '';

    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
}

export default function useCitizenEditor(citizen, onSaved) {
    const [tab, setTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(null);
    const [errors, setErrors] = useState({});

    function startEditing() {
        setDraft({ ...citizen });
        setErrors({});
        setIsEditing(true);
    }

    function cancelEditing() {
        setDraft(null);
        setErrors({});
        setIsEditing(false);
    }


    function updateField(name, value) {
        setDraft(previous => {
            if (name.includes('.')) {
                const [addressType, field] = name.split('.');

                const updatedAddress = {
                    ...previous[addressType],
                    [field]: value,
                };

                if (
                    addressType === 'registrationAddress' &&
                    previous.sameAsRegistration
                ) {
                    return {
                        ...previous,
                        registrationAddress: updatedAddress,
                        residentialAddress: { ...updatedAddress },
                    };
                }

                return {
                    ...previous,
                    [addressType]: updatedAddress,
                };
            }

            if (name === 'sameAsRegistration' && value) {
                return {
                    ...previous,
                    sameAsRegistration: true,
                    residentialAddress: { ...previous.registrationAddress },
                };
            }

            return {
                ...previous,
                [name]: value,
            };
        });

        setErrors(previous => ({
            ...previous,
            [name]: '',
        }));
    }

    function handleChange(event) {
        updateField(event.target.name, event.target.value);
    }


    function handleSave(event) {
        event.preventDefault();

        if (!draft) return;

        const newErrors = {};

        if (!draft.lastName.trim()) {
            newErrors.lastName = 'Укажите фамилию';
        }

        if (!draft.firstName.trim()) {
            newErrors.firstName = 'Укажите имя';
        }

        if (!draft.recordStatus) {
            newErrors.recordStatus = 'Выберите статус';
        }

        if (!draft.phone.trim()) {
            newErrors.phone = 'Укажите номер телефона';
        } else if (phoneDigits(draft.phone).length !== 10) {
            newErrors.phone = 'Введите 10 цифр после +7';
        }

        if (
            draft.additionalPhone.trim() &&
            phoneDigits(draft.additionalPhone).length !== 10
        ) {
            newErrors.additionalPhone = 'Введите 10 цифр после +7';
        }

        if (
            draft.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
        ) {
            newErrors.email = 'Введите корректный email';
        }

        if (!draft.registrationAddress.region.trim()) {
            newErrors['registrationAddress.region'] =
                'Укажите регион регистрации';
        }

        if (
            !draft.sameAsRegistration &&
            !draft.residentialAddress.region.trim()
        ) {
            newErrors['residentialAddress.region'] =
                'Укажите регион проживания';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            if (
                newErrors.lastName ||
                newErrors.firstName ||
                newErrors.recordStatus
            ) {
                setTab(0);
            } else if (
                newErrors.phone ||
                newErrors.additionalPhone ||
                newErrors.email
            ) {
                setTab(1);
            } else {
                setTab(2);
            }

            return;
        }

        const updatedCitizen = {
            ...draft,
            lastName: draft.lastName.trim(),
            firstName: draft.firstName.trim(),
            middleName: draft.middleName.trim(),
            phone: formatPhone(draft.phone),
            additionalPhone: formatPhone(draft.additionalPhone),
            email: draft.email.trim(),
            registrationAddress: {
                ...draft.registrationAddress,
            },

            residentialAddress: draft.sameAsRegistration
                ? { ...draft.registrationAddress }
                : { ...draft.residentialAddress },
        };

        try {
            saveCitizen(updatedCitizen);
            onSaved();
            setDraft(null);
            setErrors({});
            setIsEditing(false);
        } catch {
            setErrors({
                form: 'Не удалось сохранить изменения.',
            });
        }
    }

    return { tab, setTab, isEditing, draft, errors, startEditing, cancelEditing, updateField, handleChange, handleSave };
}
