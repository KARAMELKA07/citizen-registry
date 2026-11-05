import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { appealStatusStyles } from '../app/statusStyles.js';

const statusLabels = {
    new: 'Новое',
    in_progress: 'В работе',
    resolved: 'Завершено',
    rejected: 'Отклонено',
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

export default function CitizenAppeals({ citizenAppeals }) {
    return (
                <Paper
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: '16px',
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
                            sx={{
                                ml: 'auto',
                                flexShrink: 0,
                                bgcolor: 'transparent',
                                color: '#64748B',
                                fontWeight: 400,
                                borderRadius: '8px',
                                height: 28,
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
                                                        <Box
                                                            sx={appealStatusStyles.label}
                                                        >
                                                            <Box
                                                                component="span"
                                                                sx={{ ...appealStatusStyles.dot, bgcolor: appealStatusStyles.dotColors[appeal.status] || appealStatusStyles.dotColors.default }}
                                                            />

                                                            <Box component="span">
                                                                {statusLabels[appeal.status] || 'Не указан'}
                                                            </Box>
                                                        </Box>
                                                    }
                                                    size="small"
                                                    sx={appealStatusStyles.chip}
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
    );
}
