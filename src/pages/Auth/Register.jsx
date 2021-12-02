import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Validations from '../../util/Validations';
import Requests from '../../util/Requests';

const { registerRequest } = Requests;

const theme = createTheme();

export default function Register() {
    const [values, setValues] = useState({
        userName: '',
        email: '',
        password: '',
        verifyPassword: '',
        disableSubmit: true,
        userNameError: '',
        emailError: '',
        passwordError: '',
        verifyPasswordError: ''
    });

    let navigate = useNavigate();

    const handleChange = (prop) => (event) => {
        const {
            userName,
            email,
            password,
            verifyPassword
        } = values;

        const disableSubmit = !userName || !email || !password || !verifyPassword;

        setValues({ ...values, [prop]: event.target.value, disableSubmit, userNameError: '', emailError: '', passwordError: '', verifyPasswordError: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { userName, email, password, verifyPassword } = values;

        let emailError = '', passwordError = '', userNameError = '', verifyPasswordError = '';

        if (!Validations.validateEmail(email))
            emailError = 'Invalid Email';

        if (!Validations.validateUserName(userName))
            userNameError = 'Invalid User Name';

        if (password.length < 4)
            passwordError = 'Password too short';

        if (password !== verifyPassword)
            verifyPasswordError = 'Passwords do not match'

        if (emailError || userNameError || passwordError || verifyPasswordError) {
            setValues({ ...values, emailError, passwordError, userNameError, verifyPasswordError });
        } else {
            const data = { userName, email, password }, res = await registerRequest(data);

            if (!res.success) {
                setValues({ ...values, emailError: res.message });
            } else {
                navigate('/dissector-generator-web');
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="userName"
                                    required
                                    fullWidth
                                    id="userName"
                                    label="User Name"
                                    autoFocus
                                    onChange={handleChange('userName')}
                                    error={values.userNameError !== ''}
                                    helperText={values.userNameError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    onChange={handleChange('email')}
                                    error={values.emailError !== ''}
                                    helperText={values.emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    onChange={handleChange('password')}
                                    error={values.passwordError !== ''}
                                    helperText={values.passwordError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="verifyPassword"
                                    label="Verify Password"
                                    type="password"
                                    id="verifyPassword"
                                    onChange={handleChange('verifyPassword')}
                                    error={values.verifyPasswordError !== ''}
                                    helperText={values.verifyPasswordError}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={values.disableSubmit}
                        >
                            Register
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/dissector-generator-web/login" className="link">
                                    {"Already have an account? Login"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}