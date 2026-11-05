
export function formatAddress(address) {
    if (!address) return '—';

    const parts = [
        address.region !== address.city
            ? address.region
            : null,
        address.city,
        address.street ? `ул. ${address.street}` : null,
        address.house ? `д. ${address.house}` : null,
        address.apartment ? `кв. ${address.apartment}` : null,
    ];

    return parts.filter(Boolean).join(', ') || '—';
}
