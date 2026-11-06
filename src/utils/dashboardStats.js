export const appealStatuses = [
    { id: 'new', label: 'Новое' },
    { id: 'in_progress', label: 'В работе' },
    { id: 'resolved', label: 'Завершено' },
    { id: 'rejected', label: 'Отклонено' },
];

export const appealCategories = [
    { id: 'waste_collection', label: 'Вывоз отходов' },
    { id: 'illegal_dumping', label: 'Несанкционированная свалка' },
    { id: 'recycling', label: 'Раздельный сбор' },
    { id: 'other', label: 'Другое' },
];

function countByOptions(items, options, field) {
    const counts = Object.fromEntries(options.map(option => [option.id, 0]));
    let unknown = 0;
    items.forEach(item => {
        if (Object.hasOwn(counts, item[field])) counts[item[field]] += 1;
        else unknown += 1;
    });
    const result = options.map(option => ({ ...option, value: counts[option.id] }));
    if (unknown > 0) result.push({ id: 'unknown', label: 'Не указано', value: unknown });
    return result;
}

export function getMonthlyAppeals(appeals) {
    const counts = {};
    appeals.forEach(appeal => {
        const match = typeof appeal.createdAt === 'string' && appeal.createdAt.match(/^(\d{4})-(\d{2})-\d{2}/);
        if (!match || Number(match[2]) < 1 || Number(match[2]) > 12 || !Number.isFinite(Date.parse(appeal.createdAt))) return;
        const month = `${match[1]}-${match[2]}`;
        counts[month] = (counts[month] || 0) + 1;
    });
    const months = Object.keys(counts).sort();
    if (months.length === 0) return [];
    const first = months[0].split('-').map(Number);
    const last = months[months.length - 1].split('-').map(Number);
    const result = [];
    let year = first[0];
    let month = first[1];
    while (year < last[0] || (year === last[0] && month <= last[1])) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        result.push({ month: key, value: counts[key] || 0 });
        month += 1;
        if (month === 13) {
            month = 1;
            year += 1;
        }
    }
    return result;
}

export function getDashboardStats(citizens, appeals) {
    return {
        totalCitizens: citizens.length,
        activeCitizens: citizens.filter(citizen => citizen.recordStatus === 'active').length,
        totalAppeals: appeals.length,
        openAppeals: appeals.filter(appeal => appeal.status === 'new' || appeal.status === 'in_progress').length,
        statuses: countByOptions(appeals, appealStatuses, 'status'),
        categories: countByOptions(appeals, appealCategories, 'category'),
        monthly: getMonthlyAppeals(appeals),
    };
}
