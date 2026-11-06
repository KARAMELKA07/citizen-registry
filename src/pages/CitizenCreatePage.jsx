import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Box, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CitizenCard from '../components/CitizenCard.jsx';
import { createEmptyCitizen } from '../utils/citizenForm.js';

export default function CitizenCreatePage() {
    const navigate = useNavigate();
    const [citizen] = useState(createEmptyCitizen);

    return (
        <Box>
            <Button component={Link} to="/citizens" startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 2 }}>
                Назад к списку
            </Button>
            <CitizenCard
                citizen={citizen}
                isNew
                onSaved={saved => navigate(`/citizens/${saved.id}`, { replace: true })}
                onCancel={() => navigate('/citizens')}
            />
        </Box>
    );
}
