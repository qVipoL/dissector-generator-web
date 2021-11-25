import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

import Auth from '../util/Auth';

async function logoutRequest() {
    const response = await fetch('http://localhost/dissector-generator-api/api/routes/auth/logout.php', {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });

    return await response.json();
}

export default function MenuAppBar() {
    let navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutRequest();

        if (!res.success) {
            console.log(res.message);
        } else {
            Auth.logout();
            navigate('/dissector-generator-web');
        }
    };

    return (
        <AppBar position="static" sx={{ flexGrow: 1 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Dissector Generator
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleLogout}
                        color="inherit"
                    >
                        <LogoutIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}