
import { Box, TextField, Typography } from '@mui/material';

const fields = [
    { name: 'region', label: 'Регион', required: true },
    { name: 'city', label: 'Город' },
    { name: 'street', label: 'Улица' },
    { name: 'house', label: 'Дом' },
    { name: 'apartment', label: 'Квартира' },
];

export default function AddressFields({
    title,
    name,
    address,
    onChange,
    errors,
}) {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                {title}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'minmax(0, 1fr)',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(12, minmax(0, 1fr))',
                    },
                    gap: 2,
                }}
            >
                {fields.map(field => {
                    const fieldName = `${name}.${field.name}`;

                    return (
                        <TextField
                            key={field.name}
                            label={field.label}
                            value={address?.[field.name] ?? ''}
                            onChange={event =>
                                onChange(fieldName, event.target.value)
                            }
                            size="small"
                            required={Boolean(field.required)}
                            error={Boolean(errors[fieldName])}
                            helperText={errors[fieldName] || ''}
                            fullWidth
                            sx={{
                                gridColumn: {
                                    xs: 'span 1',
                                    sm: field.name === 'street' ? 'span 2' : 'span 1',
                                    lg:
                                        field.name === 'house' ||
                                            field.name === 'apartment'
                                            ? 'span 3'
                                            : 'span 6',
                                },
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}
