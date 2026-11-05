const baseStatusStyle = {
    bgcolor: 'transparent',
    border: '1px solid currentColor',
    fontWeight: 600,
    borderRadius: '100px',
    height: 28,
    minWidth: 112,
};

export const statusStyles = {
    active: {
        ...baseStatusStyle,
        color: '#50B83C',
    },
    archived: {
        ...baseStatusStyle,
        color: '#5D6B82',
    },

};

export const appealStatusStyles = {
    chip: {
        bgcolor: '#EEF0F3',
        color: '#475569',
        border: 'none',
        borderRadius: '999px',
        fontWeight: 400,
        height: 28,
        width: 116,
        justifyContent: 'flex-start',
        '& .MuiChip-label': {
            width: '100%',
            px: 1,
        },
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
        width: '100%',
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        flexShrink: 0,
    },
    dotColors: {
        new: '#3B82F6',
        in_progress: '#ffea00',
        resolved: '#18c558',
        rejected: '#ff3131',
        default: '#94A3B8',
    },
};
