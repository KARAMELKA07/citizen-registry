import { NumberFormatBase, usePatternFormat } from 'react-number-format';
import { TextField } from '@mui/material';
import { phoneDigits } from '../hooks/useCitizenEditor.js';

export default function PhoneField({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
}) {
    const {
        removeFormatting,
        ...patternProps
    } = usePatternFormat({
        format: '+7 (###) ###-##-##',
        mask: '_',
        value: phoneDigits(value),
        valueIsNumericString: true,
    });

    function handleRemoveFormatting(inputValue, changeMeta, props) {
        const text = inputValue.trim();
        const digits = text.replace(/\D/g, '');

        if (/^\+7[\d\s-]*$/.test(text)) {
            return digits.slice(1, 11);
        }

        if (/^[78]\d{10}$/.test(text)) {
            return digits.slice(1);
        }

        return removeFormatting(inputValue, changeMeta, props);
    }

    return (
        <NumberFormatBase
            {...patternProps}
            customInput={TextField}
            label={label}
            name={name}
            removeFormatting={handleRemoveFormatting}
            onValueChange={(values, info) => {
                if (info.source === 'event') {
                    onChange(name, values.value);
                }
            }}
            type="tel"
            size="small"
            fullWidth
            required={required}
            error={Boolean(error)}
            helperText={error || ''}
        />
    );
}
