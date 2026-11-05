import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { getCitizens } from '../data/citizenStorage.js';
import { appeals } from '../data/appeals.js';
import { statusStyles } from '../app/statusStyles.js';
import CitizenDetails from '../components/CitizenDetails.jsx';
import CitizenAppeals from '../components/CitizenAppeals.jsx';

export default function CitizenDetailPage() {
    const { id } = useParams();
    const [citizens, setCitizens] = useState(getCitizens);
    const citizen = citizens.find(c => c.id === id);
    const citizenAppeals = appeals.filter(a => a.citizenId === id);

    if (!citizen) {
        return (
            <Box>
                <Typography variant="h5" mb={2}>
                    Гражданин не найден
                </Typography>

                <Button component={Link} to="/citizens">
                    Назад к списку
                </Button>
            </Box>
        );
    }

    const fullName = [
        citizen.lastName,
        citizen.firstName,
        citizen.middleName,
    ].filter(Boolean).join(' ');

    const defaultPhoto =
        citizen.gender === 'female'
            ? '/avatars/female.png'
            : citizen.gender === 'male'
                ? '/avatars/male.png'
                : null;

    const photoSrc = citizen.photoUrl?.trim() || defaultPhoto;

    return (
        <Box>

            <Button
                component={Link}
                to="/citizens"
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{
                    mb: 2,
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'transparent',

                }}
            >
                Назад к списку
            </Button>


            <Stack spacing={{ xs: 2, lg: 3 }}>
                <Paper
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: '16px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'minmax(0, 1fr)',
                                lg: '250px minmax(0, 1fr)',
                            },
                            gap: { xs: 2, lg: 4 },
                            alignItems: 'start',
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Stack spacing={{ xs: 1, lg: 2 }} sx={{ alignItems: 'center' }}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        position: 'relative',
                                        width: { xs: 'min(100%, 200px)', lg: '100%' },
                                        height: 'auto',
                                        aspectRatio: '1 / 1',
                                        borderRadius: '16px',
                                        bgcolor: '#E5EDFA',
                                        color: 'primary.main',
                                        fontSize: 54,
                                    }}
                                >
                                    {citizen.firstName?.[0]}
                                    {citizen.lastName?.[0]}

                                    {photoSrc && (
                                        <Box
                                            component="img"
                                            key={photoSrc}
                                            src={photoSrc}
                                            alt={fullName}
                                            onError={(event) => {
                                                const img = event.currentTarget;

                                                if (
                                                    defaultPhoto &&
                                                    !img.src.endsWith(defaultPhoto)
                                                ) {
                                                    img.src = defaultPhoto;
                                                } else {
                                                    img.style.display = 'none';
                                                }
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                </Avatar>

                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: '100%',
                                        textAlign: { xs: 'center', lg: 'left' },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{
                                            mb: { xs: 1, lg: 1.5 },
                                            lineHeight: 1.3,
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {fullName}
                                    </Typography>


                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: 1,
                                            width: '100%',
                                            maxWidth: { xs: 200, lg: '100%' },
                                            mx: 'auto',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                minWidth: 0,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            ID: {citizen.id}
                                        </Typography>

                                        <Chip
                                            label={
                                                citizen.recordStatus === 'active'
                                                    ? 'Активный'
                                                    : 'Архивный'
                                            }
                                            size="small"
                                            sx={{
                                                ...statusStyles[citizen.recordStatus],
                                                flexShrink: 0,
                                            }}
                                        />
                                    </Box>


                                </Box>
                            </Stack>
                        </Box>

                        <CitizenDetails citizen={citizen} onSaved={() => setCitizens(getCitizens())} />
                    </Box>
                </Paper>

                <CitizenAppeals citizenAppeals={citizenAppeals} />
            </Stack>
        </Box>
    );
}
