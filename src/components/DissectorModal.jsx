import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
};

export default function DissectorModal(props) {
    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography sx={{ marginBottom: 4, textAlign: 'center' }} id="modal-modal-title" variant="h6" component="h2">
                        Generated Lua Code
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        id="luaCode"
                        label="Lua Code"
                        name="luaCode"
                        maxRows={15}
                        defaultValue={props.luaCode}
                        onChange={() => props.handleChange('luaCode')}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={props.createDissector}
                        sx={{ mt: 2, mb: 0 }}>
                        Save Dissector
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
