import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { deleteCitizen, getCitizens } from '../data/citizenStorage.js';
import { deletePhoto } from '../data/photoStorage.js';
import { getAppeals } from '../data/appeals.js';
import CitizenCard from '../components/CitizenCard.jsx';
import CitizenAppeals from '../components/CitizenAppeals.jsx';

export default function CitizenDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [citizens, setCitizens] = useState(getCitizens);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const citizen = citizens.find(item => item.id === id);
    const citizenAppeals = getAppeals(citizens).filter(appeal => appeal.citizenId === id);

    async function handleDelete() {
        setDeleting(true);
        setDeleteError('');
        try {
            deleteCitizen(citizen.id);
            setDeleted(true);
        } catch (error) {
            setDeleteError(error.message || 'Не удалось удалить гражданина.');
            setDeleting(false);
            return;
        }
        if (citizen.photoId) {
            try {
                await deletePhoto(citizen.photoId);
            } catch {
                setDeleteError('Гражданин удалён, но не удалось удалить сохранённую фотографию.');
                setDeleting(false);
                return;
            }
        }
        navigate('/citizens', { replace: true });
    }

    if (!citizen) {
        return (
            <Box>
                <Typography variant="h5" mb={2}>Гражданин не найден</Typography>
                <Button component={Link} to="/citizens">Назад к списку</Button>
            </Box>
        );
    }

    return (
        <Box>
            <Button
                component={Link}
                to="/citizens"
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{ mb: 2, px: 2, py: 1, borderRadius: '8px', fontWeight: 600, textTransform: 'none', borderColor: 'transparent' }}
            >
                Назад к списку
            </Button>
            <Stack spacing={{ xs: 2, lg: 3 }}>
                <CitizenCard citizen={citizen} onSaved={() => setCitizens(getCitizens())} onDelete={() => setDeleteOpen(true)} />
                <CitizenAppeals citizenAppeals={citizenAppeals} />
            </Stack>
            <Dialog open={deleteOpen} onClose={() => { if (!deleting) deleted ? navigate('/citizens', { replace: true }) : setDeleteOpen(false); }} aria-labelledby="delete-citizen-title">
                <DialogTitle id="delete-citizen-title">Удалить гражданина?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Будет удалена карточка {citizen.lastName} {citizen.firstName} и связанные обращения: {citizenAppeals.length}.
                    </DialogContentText>
                    {deleteError && <Typography color="error" role="alert" sx={{ mt: 2 }}>{deleteError}</Typography>}
                </DialogContent>
                <DialogActions>
                    {deleted ? (
                        <Button onClick={() => navigate('/citizens', { replace: true })}>Закрыть</Button>
                    ) : (
                        <>
                            <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>Отмена</Button>
                            <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>Удалить</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
