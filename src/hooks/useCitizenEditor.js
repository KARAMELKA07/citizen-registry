import { useEffect, useRef, useState } from 'react';
import { createCitizen, saveCitizen } from '../data/citizenStorage.js';
import { deletePhoto, savePhoto } from '../data/photoStorage.js';
import { hasCitizenChanges, prepareCitizen, validateCitizen, validatePhoto } from '../utils/citizenForm.js';

export default function useCitizenEditor(citizen, onSaved, isNew = false, onCancel) {
    const [tab, setTab] = useState(0);
    const [isEditing, setIsEditing] = useState(isNew);
    const [draft, setDraft] = useState(isNew ? citizen : null);
    const [errors, setErrors] = useState({});
    const [photo, setPhoto] = useState(null);
    const [photoRemoved, setPhotoRemoved] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const saving = useRef(false);
    const allowNavigation = useRef(false);
    const isDirty = isEditing && hasCitizenChanges(citizen, draft, photo, photoRemoved);

    useEffect(() => {
        return () => {
            if (photo?.url) URL.revokeObjectURL(photo.url);
        };
    }, [photo]);

    function selectPhoto(file) {
        if (!file) return;
        const error = validatePhoto(file);
        if (error) {
            setPhotoError(error);
            return;
        }
        setPhoto({ file, url: URL.createObjectURL(file) });
        setPhotoRemoved(false);
        setPhotoError('');
    }

    function removePhoto() {
        setPhoto(null);
        setPhotoRemoved(true);
        setPhotoError('');
    }

    function clearPhotoError() {
        setPhotoError('');
    }

    function startEditing() {
        allowNavigation.current = false;
        setPhoto(null);
        setPhotoRemoved(false);
        setPhotoError('');
        setDraft({ ...citizen });
        setErrors({});
        setIsEditing(true);
    }

    function cancelEditing() {
        allowNavigation.current = true;
        setPhoto(null);
        setPhotoRemoved(false);
        setPhotoError('');
        if (isNew) {
            onCancel();
            return;
        }
        setDraft(null);
        setErrors({});
        setIsEditing(false);
    }

    function updateField(name, value) {
        setDraft(previous => {
            if (name.includes('.')) {
                const [addressType, field] = name.split('.');
                const updatedAddress = { ...previous[addressType], [field]: value };
                if (addressType === 'registrationAddress' && previous.sameAsRegistration) {
                    return { ...previous, registrationAddress: updatedAddress, residentialAddress: { ...updatedAddress } };
                }
                return { ...previous, [addressType]: updatedAddress };
            }
            if (name === 'sameAsRegistration' && value) {
                return { ...previous, sameAsRegistration: true, residentialAddress: { ...previous.registrationAddress } };
            }
            return { ...previous, [name]: value };
        });
        setErrors(previous => ({ ...previous, [name]: '' }));
    }

    function handleChange(event) {
        updateField(event.target.name, event.target.value);
    }

    async function handleSave(event) {
        event.preventDefault();
        if (!draft || saving.current || photoError) return;
        const newErrors = validateCitizen(draft);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            if (newErrors.lastName || newErrors.firstName || newErrors.recordStatus || newErrors.birthDate) setTab(0);
            else if (newErrors.phone || newErrors.additionalPhone || newErrors.email) setTab(1);
            else setTab(2);
            return;
        }

        const updatedCitizen = prepareCitizen(draft);
        let newPhotoId;
        let savedCitizen;
        saving.current = true;
        setIsSaving(true);
        try {
            if (photo) {
                newPhotoId = await savePhoto(photo.file);
                updatedCitizen.photoId = newPhotoId;
                updatedCitizen.photoUrl = '';
            } else if (photoRemoved) {
                updatedCitizen.photoId = '';
                updatedCitizen.photoUrl = '';
            }
            savedCitizen = isNew ? createCitizen(updatedCitizen) : updatedCitizen;
            if (!isNew) saveCitizen(savedCitizen);
        } catch {
            if (newPhotoId) {
                try {
                    await deletePhoto(newPhotoId);
                } catch {
                    setErrors({ form: 'Не удалось сохранить данные и удалить временную фотографию.' });
                    return;
                }
            }
            setErrors({ form: 'Не удалось сохранить изменения.' });
            return;
        } finally {
            saving.current = false;
            setIsSaving(false);
        }

        if ((photo || photoRemoved) && citizen.photoId) {
            deletePhoto(citizen.photoId).catch(() => {});
        }
        setPhoto(null);
        setPhotoRemoved(false);
        setDraft(null);
        setErrors({});
        setIsEditing(false);
        allowNavigation.current = true;
        onSaved(savedCitizen);
    }

    return { tab, setTab, isEditing, draft, errors, startEditing, cancelEditing, updateField, handleChange, handleSave, photo, photoRemoved, photoError, selectPhoto, removePhoto, clearPhotoError, isSaving, isDirty, allowNavigation };
}
