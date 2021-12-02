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

import Auth from '../../util/Auth';
import Validations from '../../util/Validations';
import Requests from '../../util/Requests';

const { loginRequest } = Requests;

const theme = createTheme();

export default function Login() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        disableSubmit: true,
        emailError: '',
        passwordError: ''
    });

    let navigate = useNavigate();

    const handleChange = (prop) => (event) => {
        const { email, password } = values;

        const disableSubmit = !email || !password;

        setValues({ ...values, [prop]: event.target.value, disableSubmit, emailError: '', passwordError: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = values;

        let emailError = '', passwordError = '';

        if (!Validations.validateEmail(email))
            emailError = 'Invalid Email';

        if (password.length < 4)
            passwordError = 'Password too short';

        if (emailError || passwordError) {
            setValues({ ...values, emailError, passwordError });
        } else {
            const data = { email, password }, res = await loginRequest(data);

            if (!res.success) {
                setValues({ ...values, emailError: res.message, passwordError: res.message });
            } else {
                Auth.login(res.user);
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
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={handleChange('email')}
                            autoFocus
                            error={values.emailError !== ''}
                            helperText={values.emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={handleChange('password')}
                            autoComplete="current-password"
                            error={values.passwordError !== ''}
                            helperText={values.passwordError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={values.disableSubmit}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Link to="/dissector-generator-web/register" className="link">
                                {"Don't have an account? Register"}
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}