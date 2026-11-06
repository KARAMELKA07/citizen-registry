import { Box, Paper, Stack, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { getCitizens } from '../data/citizenStorage.js';
import { getAppeals } from '../data/appeals.js';
import { getDashboardStats } from '../utils/dashboardStats.js';
import { appealStatusStyles } from '../app/statusStyles.js';

const cardStyle = { p: { xs: 2, md: 3 }, borderRadius: '16px', minWidth: 0 };

function MetricCard({ title, value, icon }) {
    return (
        <Paper sx={cardStyle}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ display: 'flex', p: 1.25, borderRadius: '12px', color: 'primary.main', bgcolor: 'primary.light' }}>
                    {icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                    <Typography variant="h5" fontWeight={700}>{value.toLocaleString('ru-RU')}</Typography>
                </Box>
            </Stack>
        </Paper>
    );
}

function ChartCard({ title, children }) {
    return (
        <Paper sx={cardStyle}>
            <Typography variant="h6" fontWeight={700} mb={2}>{title}</Typography>
            {children}
        </Paper>
    );
}

function EmptyChart() {
    return <Typography color="text.secondary" sx={{ py: 5, textAlign: 'center' }}>Данных об обращениях пока нет.</Typography>;
}

function formatMonth(month) {
    const [year, value] = month.split('-');
    return `${value}.${year.slice(2)}`;
}

export default function DashboardPage() {
    const citizens = getCitizens();
    const stats = getDashboardStats(citizens, getAppeals(citizens));
    const statuses = stats.statuses.map(status => ({
        ...status,
        color: appealStatusStyles.dotColors[status.id] || appealStatusStyles.dotColors.default,
    }));
    const metrics = [
        { title: 'Всего граждан', value: stats.totalCitizens, icon: <PeopleOutlineIcon /> },
        { title: 'Активных граждан', value: stats.activeCitizens, icon: <PersonOutlineIcon /> },
        { title: 'Всего обращений', value: stats.totalAppeals, icon: <ForumOutlinedIcon /> },
        { title: 'Открытых обращений', value: stats.openAppeals, icon: <PendingActionsOutlinedIcon /> },
    ];
    const tickStep = Math.max(1, Math.ceil(stats.monthly.length / 5));

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                {metrics.map(metric => <MetricCard key={metric.title} {...metric} />)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 3 }}>
                <ChartCard title="Обращения по статусам">
                    {stats.totalAppeals === 0 ? <EmptyChart /> : (
                        <>
                            <PieChart
                                title="Распределение обращений по статусам"
                                series={[{ data: statuses, innerRadius: 60, outerRadius: 95, paddingAngle: 2 }]}
                                height={220}
                                hideLegend
                                skipAnimation
                            />
                            <Stack spacing={1}>
                                {statuses.map(status => (
                                    <Box key={status.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ ...appealStatusStyles.dot, bgcolor: status.color }} />
                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>{status.label}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{status.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </>
                    )}
                </ChartCard>
                <ChartCard title="Обращения по категориям">
                    {stats.totalAppeals === 0 ? <EmptyChart /> : (
                        <>
                            <BarChart
                                title="Количество обращений по категориям"
                                layout="horizontal"
                                yAxis={[{ scaleType: 'band', data: stats.categories.map((_, index) => String(index + 1)), width: 28 }]}
                                xAxis={[{ min: 0, tickMinStep: 1 }]}
                                series={[{ data: stats.categories.map(category => category.value), label: 'Обращения', color: '#2563EB', valueFormatter: (value, { dataIndex }) => `${stats.categories[dataIndex].label}: ${value}` }]}
                                height={220}
                                margin={{ left: 4, right: 16, top: 8, bottom: 8 }}
                                hideLegend
                                skipAnimation
                            />
                            <Stack spacing={1}>
                                {stats.categories.map((category, index) => (
                                    <Box key={category.id} sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">{index + 1}.</Typography>
                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>{category.label}</Typography>
                                        <Typography variant="body2" fontWeight={600}>{category.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </>
                    )}
                </ChartCard>
            </Box>
            <ChartCard title="Динамика обращений">
                {stats.monthly.length === 0 ? <EmptyChart /> : (
                    <LineChart
                        title="Количество обращений по месяцам"
                        xAxis={[{ scaleType: 'point', data: stats.monthly.map(item => item.month), valueFormatter: formatMonth, tickLabelInterval: (_, index) => index % tickStep === 0 }]}
                        yAxis={[{ min: 0, tickMinStep: 1, width: 35 }]}
                        series={[{ data: stats.monthly.map(item => item.value), label: 'Обращения', color: '#2563EB', showMark: false }]}
                        height={280}
                        margin={{ left: 4, right: 20, top: 16, bottom: 8 }}
                        hideLegend
                        skipAnimation
                    />
                )}
            </ChartCard>
        </Stack>
    );
}
