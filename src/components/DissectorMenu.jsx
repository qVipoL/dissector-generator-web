import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Auth from '../util/Auth';

export default function DissectorMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isMyDissector = () => {
        const id = Auth.getData().id;

        return id === props.userId;
    };

    const handleAction = (action) => {
        navigate(`/dissector-generator-web/${action}`);
    };

    return (
        <div>
            <IconButton
                id="demo-positioned-button"
                aria-controls="demo-positioned-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={props.downloadDissector}>Download</MenuItem>

                {isMyDissector() && <MenuItem onClick={() => handleAction(`update/${props.dissectorId}`)}>Update</MenuItem>}
                {isMyDissector() && <MenuItem onClick={props.deleteDissector}>Delete</MenuItem>}

            </Menu>
        </div >
    );
}
