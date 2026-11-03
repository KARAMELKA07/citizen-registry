
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import {
    Avatar,
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { citizens } from '../data/citizens.js';
import { appeals } from '../data/appeals.js';

const genderLabels = {
    male: 'Мужской',
    female: 'Женский',
    not_specified: 'Не указан',
};

const contactLabels = {
    phone: 'Телефон',
    email: 'Электронная почта',
};

const educationLabels = {
    secondary: 'Среднее',
    vocational: 'Среднее профессиональное',
    higher: 'Высшее',
    other: 'Другое',
};

const statusLabels = {
    new: 'Новое',
    in_progress: 'В работе',
    resolved: 'Завершено',
    rejected: 'Отклонено',
};

const statusColors = {
    new: 'info',
    in_progress: 'warning',
    resolved: 'success',
    rejected: 'default',
};

const categoryLabels = {
    waste_collection: 'Вывоз отходов',
    illegal_dumping: 'Несанкционированная свалка',
    recycling: 'Раздельный сбор',
    other: 'Другое',
};

function formatDate(value) {
    if (!value) return '—';

    const [year, month, day] = value.slice(0, 10).split('-');
    return `${day}.${month}.${year}`;
}

function InfoRow({ label, value }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: 'minmax(110px, 36%) minmax(0, 1fr)',
                    sm: '180px minmax(0, 1fr)',
                },
                gap: { xs: 1, sm: 2 },
                alignItems: 'start',
                py: 1.2,
                borderBottom: '1px solid',
                borderColor: 'divider',

                '&:last-child': {
                    borderBottom: 0,
                },
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflowWrap: 'anywhere' }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={500}
                sx={{ overflowWrap: 'anywhere', minWidth: 0 }}
            >
                {value === '' || value == null ? '—' : value}
            </Typography>
        </Box>
    );
}

export default function CitizenDetailPage() {
    const { id } = useParams();
    const [tab, setTab] = useState(0);

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

    const registrationAddress = [
        citizen.region !== citizen.city ? citizen.region : null,
        citizen.city,
        citizen.street ? `ул. ${citizen.street}` : null,
        citizen.house ? `д. ${citizen.house}` : null,
        citizen.apartment ? `кв. ${citizen.apartment}` : null,
    ].filter(Boolean).join(', ');

    // Разделы карточки и поля каждого раздела
    const sections = [
        {
            title: 'Основная информация',
            fields: [
                {
                    label: 'Дата рождения',
                    value: formatDate(citizen.birthDate),
                },
                {
                    label: 'Пол',
                    value: genderLabels[citizen.gender],
                },
                {
                    label: 'Дата регистрации',
                    value: formatDate(citizen.createdAt),
                },
                {
                    label: 'Образование',
                    value: educationLabels[citizen.educationLevel],
                },
            ],
        },
        {
            title: 'Контакты',
            fields: [
                { label: 'Телефон', value: citizen.phone },
                {
                    label: 'Доп. телефон',
                    value: citizen.additionalPhone,
                },
                { label: 'Email', value: citizen.email },
                {
                    label: 'Способ связи',
                    value: contactLabels[citizen.preferredContact],
                },
                {
                    label: 'Комментарий',
                    value: citizen.contactComment,
                },
            ],
        },
        {
            title: 'Адрес',
            fields: [
                {
                    label: 'Адрес регистрации',
                    value: registrationAddress,
                },
                {
                    label: 'Адреса совпадают',
                    value: citizen.sameAsRegistration ? 'Да' : 'Нет',
                },
                {
                    label: 'Адрес проживания',
                    value: citizen.sameAsRegistration
                        ? registrationAddress
                        : citizen.livingAddress,
                },
                {
                    label: 'Примечания',
                    value: citizen.notes,
                },
            ],
        },
    ];

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
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'transparent',

                }}
            >
                Назад к списку
            </Button>


            <Stack spacing={3}>
                {/* Верхняя карточка */}
                <Paper
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'minmax(0, 1fr)',
                                lg: '250px minmax(0, 1fr)',
                            },
                            gap: { xs: 3, lg: 4 },
                            alignItems: 'start',
                        }}
                    >
                        {/* Фото и краткая информация */}
                        <Box sx={{ minWidth: 0 }}>
                            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        position: 'relative',
                                        width: 'min(100%, 200px)',
                                        height: 200,
                                        borderRadius: 3,
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
                                        maxWidth: { xs: '100%', lg: 250 },
                                        textAlign: { xs: 'center', lg: 'left' },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{
                                            mb: 1.5,
                                            lineHeight: 1.3,
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {fullName}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1.5 }}
                                    >
                                        ID: {citizen.id}
                                    </Typography>

                                    <Chip
                                        label={
                                            citizen.recordStatus === 'active'
                                                ? 'Активный'
                                                : 'Архивный'
                                        }
                                        color={
                                            citizen.recordStatus === 'active'
                                                ? 'success'
                                                : 'default'
                                        }
                                        variant="outlined"
                                        sx={{
                                            width: '100%',
                                            height: 36,
                                            '& .MuiChip-label': {
                                                width: '100%',
                                                textAlign: 'center',
                                            },
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* Вкладки и сведения о гражданине */}
                        <Box sx={{ minWidth: 0 }}>
                            <Tabs
                                value={tab}
                                onChange={(_event, value) => setTab(value)}
                                variant="scrollable"
                                scrollButtons={false}
                                aria-label="Разделы карточки гражданина"
                                sx={{
                                    mb: 2.5,
                                    borderBottom: 1,
                                    borderColor: 'divider',

                                    '& .MuiTab-root': {
                                        minWidth: 0,
                                        px: { xs: 1.25, sm: 2 },
                                    },

                                    '& .MuiTab-root:first-of-type': {
                                        pl: 0,
                                    },
                                }}
                            >
                                {sections.map((section, index) => (
                                    <Tab
                                        key={section.title}
                                        id={`citizen-tab-${index}`}
                                        aria-controls={`citizen-panel-${index}`}
                                        label={section.title}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    />
                                ))}
                            </Tabs>

                            <Box
                                role="tabpanel"
                                id={`citizen-panel-${tab}`}
                                aria-labelledby={`citizen-tab-${tab}`}
                                sx={{ minWidth: 0 }}
                            >
                                {sections[tab].fields.map((field) => (
                                    <InfoRow
                                        key={field.label}
                                        label={field.label}
                                        value={field.value}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Нижний блок: обращения */}
                <Paper
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 3,
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            mb: 2,
                            pb: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="h6" fontWeight={700}>
                            Обращения
                        </Typography>

                        <Chip
                            label={`Всего: ${citizenAppeals.length}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                                ml: 'auto',
                                flexShrink: 0,
                            }}
                        />
                    </Box>

                    {citizenAppeals.length === 0 ? (
                        <Typography color="text.secondary">
                            Обращений пока нет.
                        </Typography>
                    ) : (
                        <TableContainer sx={{ maxWidth: '100%' }}>
                            <Table size="small" sx={{ minWidth: 760 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Номер</TableCell>
                                        <TableCell>Тема</TableCell>
                                        <TableCell>Категория</TableCell>
                                        <TableCell>Статус</TableCell>
                                        <TableCell>Дата</TableCell>
                                        <TableCell>Исполнитель</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {citizenAppeals.map((appeal) => (
                                        <TableRow key={appeal.id} hover>
                                            <TableCell>{appeal.number}</TableCell>

                                            <TableCell>{appeal.subject}</TableCell>

                                            <TableCell>
                                                {categoryLabels[appeal.category] || 'Другое'}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        statusLabels[appeal.status] ||
                                                        'Не указан'
                                                    }
                                                    color={
                                                        statusColors[appeal.status] ||
                                                        'default'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(appeal.createdAt)}
                                            </TableCell>

                                            <TableCell>
                                                {appeal.assignee || 'Не назначен'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
}
