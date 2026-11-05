import { Box, Checkbox, FormControlLabel, MenuItem, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import AddressFields from './AddressFields.jsx';
import PhoneField from './PhoneField.jsx';

export default function CitizenEditFields({ tab, draft, errors, updateField, handleChange, educationLabels }) {
    const editFields = [
        [
            { name: 'lastName', label: 'Фамилия', required: true },
            { name: 'firstName', label: 'Имя', required: true },
            { name: 'middleName', label: 'Отчество' },
            { name: 'birthDate', label: 'Дата рождения', type: 'date' },
            {
                name: 'educationLevel',
                label: 'Образование',
                options: [
                    { value: '', label: 'Не указано' },
                    ...Object.entries(educationLabels).map(([value, label]) => ({
                        value,
                        label,
                    })),
                ],
            },
            {
                name: 'recordStatus',
                label: 'Статус гражданина',
                required: true,
                options: [
                    { value: 'active', label: 'Активный' },
                    { value: 'archived', label: 'Архивный' },
                ],
            },
            { name: 'gender', label: 'Пол', type: 'gender' },
        ],

        [
            { name: 'phone', label: 'Телефон', type: 'phone', required: true },
            { name: 'additionalPhone', label: 'Дополнительный телефон', type: 'phone' },
            { name: 'email', label: 'Email', type: 'email' },
            {
                name: 'preferredContact',
                label: 'Предпочтительный способ связи',
                options: [
                    { value: '', label: 'Не указан' },
                    { value: 'phone', label: 'Телефон' },
                    { value: 'email', label: 'Электронная почта' },
                ],
            },
            { name: 'contactComment', label: 'Комментарий', type: 'multiline' },
        ],

        [],
    ];

    return (
        tab === 2 ? (
            <Box sx={{ display: 'grid', gap: 3 }}>
                <AddressFields
                    title="Адрес регистрации"
                    name="registrationAddress"
                    address={draft.registrationAddress}
                    onChange={updateField}
                    errors={errors}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={draft.sameAsRegistration}
                            onChange={event =>
                                updateField(
                                    'sameAsRegistration',
                                    event.target.checked
                                )
                            }
                        />
                    }
                    label="Адрес проживания совпадает с регистрацией"
                />

                {!draft.sameAsRegistration && (
                    <AddressFields
                        title="Адрес проживания"
                        name="residentialAddress"
                        address={draft.residentialAddress}
                        onChange={updateField}
                        errors={errors}
                    />
                )}

                <TextField
                    label="Примечания"
                    name="notes"
                    value={draft.notes}
                    onChange={handleChange}
                    multiline
                    minRows={2}
                    size="small"
                    fullWidth
                />
            </Box>
        ) : (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'minmax(0, 1fr)',
                        md: 'repeat(2, minmax(0, 1fr))',
                    },
                    gap: 2,
                }}
            >
                {editFields[tab].map(field => {

                    if (field.type === 'gender') {
                        return (
                            <Box key={field.name}>
                                <Typography
                                    id="gender-label"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Пол
                                </Typography>

                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    color="primary"
                                    value={
                                        draft.gender === 'not_specified'
                                            ? null
                                            : draft.gender
                                    }
                                    onChange={(_event, value) => {
                                        if (value !== null) {
                                            updateField('gender', value);
                                        }
                                    }}
                                    aria-labelledby="gender-label"
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            width: 64,
                                            height: 40,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                        },
                                        '& .Mui-selected': {
                                            bgcolor: 'primary.light',
                                        },
                                    }}
                                >
                                    <ToggleButton value="male" aria-label="Мужской">
                                        М
                                    </ToggleButton>

                                    <ToggleButton value="female" aria-label="Женский">
                                        Ж
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        );
                    }
                    if (field.type === 'phone') {
                        return (
                            <PhoneField
                                key={field.name}
                                label={field.label}
                                name={field.name}
                                value={draft[field.name]}
                                onChange={updateField}
                                error={errors[field.name]}
                                required={field.required}
                            />
                        );
                    }

                    return (
                        <TextField
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            value={draft[field.name] ?? ''}
                            onChange={handleChange}
                            type={
                                field.type === 'date' || field.type === 'email'
                                    ? field.type
                                    : 'text'
                            }
                            select={Boolean(field.options)}
                            multiline={field.type === 'multiline'}
                            minRows={field.type === 'multiline' ? 2 : undefined}
                            required={Boolean(field.required)}
                            error={Boolean(errors[field.name])}
                            helperText={errors[field.name] || ''}
                            size="small"
                            fullWidth
                            slotProps={
                                field.type === 'date'
                                    ? { inputLabel: { shrink: true } }
                                    : undefined
                            }
                            sx={{
                                gridColumn:
                                    field.type === 'multiline' ? '1 / -1' : undefined,
                            }}
                        >
                            {field.options?.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    );
                })}
            </Box>
        )
    );
}
