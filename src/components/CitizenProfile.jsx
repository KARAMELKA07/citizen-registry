import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { statusStyles } from '../app/statusStyles.js';
import { deleteActionStyle, editActionStyle } from '../app/actionStyles.js';
import { getPhoto } from '../data/photoStorage.js';

export default function CitizenProfile({ citizen, editor, isNew }) {
    const [storedPhoto, setStoredPhoto] = useState(null);
    const [loadError, setLoadError] = useState('');
    const { isEditing, draft, photo, photoRemoved, photoError, selectPhoto, removePhoto, clearPhotoError, isSaving } = editor;
    const shownCitizen = isNew ? draft : citizen;
    const fullName = [shownCitizen?.lastName, shownCitizen?.firstName, shownCitizen?.middleName].filter(Boolean).join(' ');
    const defaultPhoto = shownCitizen?.gender === 'female' ? '/avatars/female.png' : shownCitizen?.gender === 'male' || isNew ? '/avatars/male.png' : null;

    useEffect(() => {
        if (!citizen.photoId) return;
        let active = true;
        let url;
        getPhoto(citizen.photoId).then(file => {
            if (!active) return;
            if (!file) throw new Error('Фотография не найдена');
            url = URL.createObjectURL(file);
            setStoredPhoto({ id: citizen.photoId, url });
            setLoadError('');
        }).catch(() => {
            if (active) setLoadError('Не удалось загрузить сохранённую фотографию.');
        });
        return () => {
            active = false;
            if (url) URL.revokeObjectURL(url);
        };
    }, [citizen.photoId]);

    const savedPhoto = storedPhoto && storedPhoto.id === citizen.photoId ? storedPhoto.url : '';
    const currentPhoto = photo?.url || (!photoRemoved && (citizen.photoId ? savedPhoto : citizen.photoUrl));
    const photoSrc = currentPhoto || defaultPhoto;

    return (
        <Box sx={{ minWidth: 0 }}>
            <Stack spacing={{ xs: 1, lg: 2 }} sx={{ alignItems: 'center' }}>
                <Box sx={{ position: 'relative', width: { xs: 'min(100%, 200px)', lg: '100%' } }}>
                <Avatar variant="rounded" sx={{ position: 'relative', width: '100%', height: 'auto', aspectRatio: '1 / 1', borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: '#E5EDFA', color: 'primary.main', fontSize: 54 }}>
                    {fullName ? `${shownCitizen.firstName?.[0] || ''}${shownCitizen.lastName?.[0] || ''}` : <PersonOutlineIcon sx={{ fontSize: 72 }} />}
                    {photoSrc && (
                        <Box
                            component="img"
                            key={photoSrc}
                            src={photoSrc}
                            alt={fullName || 'Фотография гражданина'}
                            onError={event => {
                                const img = event.currentTarget;
                                if (defaultPhoto && !img.src.endsWith(defaultPhoto)) img.src = defaultPhoto;
                                else img.style.display = 'none';
                            }}
                            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                </Avatar>
                {isEditing && (!isNew || currentPhoto) && (
                    <Box sx={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 0.5, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
                        <Tooltip title="Изменить фото">
                            <IconButton component="label" aria-label="Изменить фото" disabled={isSaving} sx={editActionStyle}>
                                <EditOutlinedIcon fontSize="small" />
                                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={event => { selectPhoto(event.target.files?.[0]); event.target.value = ''; }} />
                            </IconButton>
                        </Tooltip>
                        {currentPhoto && (
                            <Tooltip title="Удалить фото">
                                <IconButton type="button" aria-label="Удалить фото" onClick={removePhoto} disabled={isSaving} sx={deleteActionStyle}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                )}
                </Box>

                {isEditing && isNew && !currentPhoto && (
                    <Stack spacing={0.5} sx={{ width: '100%', maxWidth: { xs: 200, lg: '100%' } }}>
                        <Button component="label" variant="outlined" disabled={isSaving} sx={{ borderRadius: '8px' }}>
                            Добавить фото
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                hidden
                                onChange={event => {
                                    selectPhoto(event.target.files?.[0]);
                                    event.target.value = '';
                                }}
                            />
                        </Button>
                    </Stack>
                )}

                {(photoError || (!photo && !photoRemoved && loadError)) && (
                    <Typography variant="body2" color="error" role="alert">{photoError || loadError}</Typography>
                )}
                {photoError && <Button type="button" size="small" onClick={clearPhotoError}>Закрыть сообщение</Button>}

                {!isNew && <Box sx={{ width: '100%', maxWidth: '100%', textAlign: { xs: 'center', lg: 'left' } }}>
                    {!isEditing && (
                    <Typography variant="h6" fontWeight={700} sx={{ mb: { xs: 1, lg: 1.5 }, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
                        {fullName}
                    </Typography>
                    )}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, width: '100%', maxWidth: { xs: 200, lg: '100%' }, mx: 'auto' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0, whiteSpace: 'nowrap' }}>ID: {citizen.id}</Typography>
                            {!isEditing && <Chip label={citizen.recordStatus === 'active' ? 'Активный' : 'Архивный'} size="small" sx={{ ...statusStyles[citizen.recordStatus], flexShrink: 0 }} />}
                        </Box>
                </Box>}
            </Stack>
        </Box>
    );
}
