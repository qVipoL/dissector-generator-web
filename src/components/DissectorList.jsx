import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import DissectorMenu from './DissectorMenu';
import Auth from '../util/Auth';

const theme = createTheme();

export default function BasicTable() {
    const [data, setData] = useState({
        dissectors: [],
        reRender: false
    });

    let navigate = useNavigate();

    useEffect(
        () => {
            async function getDissectors() {
                const response = await fetch('http://localhost/dissector-generator-api/api/routes/dissectors/getAll.php', {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer'
                });

                const res = await response.json();

                if (res.success && !res.success) {
                    Auth.logout();
                    navigate('/dissector-generator-web/login');
                    return;
                }

                setData({ dissectors: res.dissectors });
            }

            getDissectors();
        },
        [data.reRender, navigate]
    );

    return (
        data.dissectors ? (
            <ThemeProvider theme={theme}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Options</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.dissectors.map((dissector) => (
                                <TableRow
                                    key={dissector.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {dissector.name}
                                    </TableCell>
                                    <TableCell>{dissector.userName}</TableCell>
                                    <TableCell>{new Date(dissector.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <DissectorMenu userId={dissector.userId} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ThemeProvider>
        ) : (
            <div>
            </div>
        )
    );
}
