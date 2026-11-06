import { useState } from 'react';
import { Link } from 'react-router';

import {
    Box,
    Button,
    Chip,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { ruRU } from '@mui/x-data-grid/locales';
import AddIcon from '@mui/icons-material/Add';

import { getCitizens } from '../data/citizenStorage.js';
import { getAppeals } from '../data/appeals.js';
import { statusStyles } from '../app/statusStyles.js';



const columns = [
    {
        field: 'id',
        headerName: 'ID',
        minWidth: 90,
        maxWidth: 145,
        flex: 0.6,
    },
    {
        field: 'fullName',
        headerName: 'ФИО',
        minWidth: 230,
        flex: 1.8,
        renderCell: ({ row }) => (
            <Link to={`/citizens/${row.id}`}>
                {row.fullName}
            </Link>
        ),
    },
    {
        field: 'birthDate',
        headerName: 'Дата рождения',
        minWidth: 140,
        flex: 0.9,
        renderCell: ({ value }) =>
            value ? value.split('-').reverse().join('.') : '—',
    },
    {
        field: 'region',
        headerName: 'Регион',
        minWidth: 180,
        flex: 1.4,
    },
    {
        field: 'phone',
        headerName: 'Телефон',
        minWidth: 160,
        flex: 1,
    },
    {
        field: 'appealsCount',
        headerName: 'Обращения',
        type: 'number',
        minWidth: 125,
        maxWidth: 170,
        flex: 0.7,
        align: 'left',
        headerAlign: 'left',
    },
    {
        field: 'recordStatus',
        headerName: 'Статус',
        minWidth: 125,
        maxWidth: 175,
        flex: 0.8,
        renderCell: ({ value }) => (
            <Chip
                label={value === 'active' ? 'Активный' : 'Архивный'}
                size="small"
                sx={{
                    ...statusStyles[value],
                }}
            />
        ),
    },
];



export default function CitizensPage() {
    const [citizens] = useState(getCitizens);
    const appeals = getAppeals(citizens);

    const regions = [
        ...new Set(
            citizens.map(c => c.registrationAddress.region).filter(Boolean)
        ),
    ];

    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('all');
    const [status, setStatus] = useState('all');

    const rows = citizens.map((citizen) => ({
        ...citizen,
        region: citizen.registrationAddress.region,
        fullName: [
            citizen.lastName,
            citizen.firstName,
            citizen.middleName,
        ].filter(Boolean).join(' '),
        appealsCount: appeals.filter(
            appeal => appeal.citizenId === citizen.id
        ).length,
    }));

    const filteredRows = rows.filter((citizen) => {
        const matchesSearch = citizen.fullName
            .toLowerCase()
            .includes(search.trim().toLowerCase());

        const matchesRegion =
            region === 'all' || citizen.region === region;

        const matchesStatus =
            status === 'all' || citizen.recordStatus === status;

        return matchesSearch && matchesRegion && matchesStatus;
    });


    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Paper
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: '16px',
                    minWidth: 0,
                }}
            >
                {/* Поиск и фильтры */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    useFlexGap
                    sx={{ mb: 3, flexWrap: 'wrap', alignItems: { md: 'center' } }}
                >
                    <TextField
                        label="Поиск по ФИО"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', md: 240 } }}
                    />

                    <TextField
                        select
                        label="Регион"
                        size="small"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        sx={{ width: { xs: '100%', md: 200 } }}
                    >
                        <MenuItem value="all">Все регионы</MenuItem>

                        {regions.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Статус"
                        size="small"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ width: { xs: '100%', md: 170 } }}
                    >
                        <MenuItem value="all">Все статусы</MenuItem>
                        <MenuItem value="active">Активные</MenuItem>
                        <MenuItem value="archived">Архивные</MenuItem>
                    </TextField>

                    <Button
                        component={Link}
                        to="/citizens/new"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ width: { xs: '100%', md: 'auto' }, ml: { md: 'auto' } }}
                    >
                        Добавить гражданина
                    </Button>
                </Stack>

                {/* Количество найденных граждан */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2.5 }}
                >
                    Найдено: {filteredRows.length} из {citizens.length}
                </Typography>

                {/* Таблица */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        minHeight: 230,
                        maxHeight: 450,
                    }}
                >
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    page: 0,
                                    pageSize: 5,
                                },
                            },
                        }}
                        localeText={{
                            ...ruRU.components.MuiDataGrid.defaultProps.localeText,
                            noRowsLabel:
                                'Граждане не найдены. Измените параметры поиска.',
                            noResultsOverlayLabel:
                                'По заданным условиям граждане не найдены.',
                        }}
                        disableRowSelectionOnClick
                        sx={{
                            border: 0,
                            '--DataGrid-overlayHeight': '160px',
                            '& a': {
                                color: 'primary.main',
                                textDecoration: 'none',
                            },
                            '& a:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );

}
