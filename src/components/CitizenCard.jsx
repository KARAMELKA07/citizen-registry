import { useEffect, useState } from 'react';
import { useBlocker } from 'react-router';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import CitizenDetails from './CitizenDetails.jsx';
import CitizenProfile from './CitizenProfile.jsx';
import useCitizenEditor from '../hooks/useCitizenEditor.js';

export default function CitizenCard({ citizen, onSaved, isNew = false, onCancel, onDelete }) {
    const editor = useCitizenEditor(citizen, onSaved, isNew, onCancel);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const blocker = useBlocker(() => editor.isDirty && !editor.allowNavigation.current);

    useEffect(() => {
        if (!editor.isDirty) return;
        function handleBeforeUnload(event) {
            event.preventDefault();
            event.returnValue = '';
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [editor.isDirty]);

    function requestCancel() {
        if (editor.isDirty) setConfirmCancel(true);
        else editor.cancelEditing();
    }

    function stay() {
        if (blocker.state === 'blocked') blocker.reset();
        setConfirmCancel(false);
    }

    function discard() {
        if (blocker.state === 'blocked') blocker.proceed();
        else editor.cancelEditing();
        setConfirmCancel(false);
    }

    return (
        <>
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '16px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '250px minmax(0, 1fr)' }, gap: { xs: 2, lg: 4 }, alignItems: 'start' }}>
                <CitizenProfile citizen={citizen} editor={editor} isNew={isNew} />
                <CitizenDetails citizen={citizen} editor={{ ...editor, cancelEditing: requestCancel }} onDelete={onDelete} />
            </Box>
        </Paper>
        <Dialog open={confirmCancel || blocker.state === 'blocked'} onClose={stay} aria-labelledby="unsaved-changes-title">
            <DialogTitle id="unsaved-changes-title">Есть несохранённые изменения</DialogTitle>
            <DialogContent>
                <DialogContentText>Если выйти, изменения и выбранная фотография не сохранятся.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={stay} variant="outlined" sx={{ borderRadius: '8px' }}>Остаться</Button>
                <Button onClick={discard} color="error" variant="contained">Выйти без сохранения</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
