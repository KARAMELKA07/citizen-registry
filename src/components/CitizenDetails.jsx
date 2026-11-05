import { Box, Button, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CitizenEditFields from './CitizenEditFields.jsx';
import { formatAddress } from '../data/addressUtils.js';
import useCitizenEditor from '../hooks/useCitizenEditor.js';

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
export default function CitizenDetails({ citizen, onSaved }) {
    const { tab, setTab, isEditing, draft, errors, startEditing, cancelEditing, updateField, handleChange, handleSave } = useCitizenEditor(citizen, onSaved);

    const registrationAddress = formatAddress(
        citizen.registrationAddress
    );

    const residentialAddress = formatAddress(
        citizen.sameAsRegistration
            ? citizen.registrationAddress
            : citizen.residentialAddress
    );

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
                    value: residentialAddress,
                },
                {
                    label: 'Примечания',
                    value: citizen.notes,
                },
            ],
        },
    ];


    return (
    <Box
        component="form"
        noValidate
        onSubmit={handleSave}
        sx={{ minWidth: 0 }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Tabs
                value={tab}
                onChange={(_event, value) => setTab(value)}
                variant="scrollable"
                scrollButtons={false}
                aria-label="Разделы карточки гражданина"
                sx={{
                    flex: 1,
                    minWidth: 0,
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
                    />
                ))}
            </Tabs>

            {!isEditing && (
                <Tooltip title="Редактировать карточку">
                    <IconButton
                        type="button"
                        onClick={startEditing}
                        aria-label="Редактировать карточку"
                        sx={{
                            color: 'text.secondary',
                            borderRadius: '8px',
                            flexShrink: 0,
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'primary.light',
                            },
                        }}
                    >
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Box>

        <Box
            role="tabpanel"
            id={`citizen-panel-${tab}`}
            aria-labelledby={`citizen-tab-${tab}`}
            sx={{ minWidth: 0 }}
        >
            {isEditing ? (
                <CitizenEditFields
                    tab={tab}
                    draft={draft}
                    errors={errors}
                    updateField={updateField}
                    handleChange={handleChange}
                    educationLabels={educationLabels}
                />
            ) : (
                sections[tab].fields.map(field => (
                    <InfoRow
                        key={field.label}
                        label={field.label}
                        value={field.value}
                    />
                ))
            )}
        </Box>

        {isEditing && (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {errors.form && (
                    <Typography
                        color="error"
                        role="alert"
                        sx={{ width: '100%' }}
                    >
                        {errors.form}
                    </Typography>
                )}

                <Button
                    type="button"
                    variant="outlined"
                    onClick={cancelEditing}
                    sx={{ borderRadius: '8px' }}
                >
                    Отмена
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ borderRadius: '8px' }}
                >
                    Сохранить
                </Button>
            </Box>
        )}
    </Box>
    );
}
