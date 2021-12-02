import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

import Auth from '../util/Auth';
import Requests from '../util/Requests';

const { logoutRequest } = Requests;

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

    const handleCreate = () => {
        navigate('/dissector-generator-web/create');
    }

    return (
        <AppBar position="static" sx={{ flexGrow: 1 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to={'/dissector-generator-web'} className="home-link">
                        Dissector Generator
                    </Link>
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleCreate}
                        color="inherit">
                        <AddIcon />
                    </IconButton>
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