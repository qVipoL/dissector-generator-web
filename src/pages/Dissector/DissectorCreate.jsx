import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl'

const theme = createTheme();

export default function DissectorCreate(props) {

    const propTypes = {
        formType: 'CREATE',
        endianType: 'big',
        dissectorName: 'test',
        description: 'test',
        connectionType: 'tcp.port',
        port: '1337',
        structs: [
            {
                structName: 'struct2',
                fields: []
            },
            {
                structName: 'dissector',
                fields: [
                    {
                        type: 'field',
                        fieldType: 'int',
                        fieldName: 'test'
                    },
                    {
                        type: 'bit-field',
                        fieldType: 'int',
                        fieldName: 'bit',
                        bitMask: '0x007'
                    },
                    {
                        type: 'condition',
                        conditionField: 'test',
                        cases: [
                            {
                                case: '1',
                                fieldType: 'int',
                                fieldName: 'case1'
                            },
                            {
                                case: 'default',
                                fieldType: 'int',
                                fieldName: 'default11'
                            }
                        ]
                    },
                    {
                        type: 'structReference',
                        structName: 'struct2'
                    }
                ]
            }
        ],
        mainStructName: 'dissector'
    };

    const [values, setValues] = useState({
        endianType: 'big'
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    if (props.type === 'VIEW')

        return (
            <ThemeProvider theme={theme} >
                <Container component="main" maxWidth="lg">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Create Dissetor
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        name="dissectorName"
                                        required
                                        fullWidth
                                        id="dissectorName"
                                        label="Dissector Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ minWidth: 120 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="endianType">Endian Type</InputLabel>
                                            <Select
                                                labelId="endianType"
                                                id="selectEndianType"
                                                value={values.endianType}
                                                label="Endian Type"
                                                onChange={handleChange('endianType')}
                                            >
                                                <MenuItem value={"big"}>Big</MenuItem>
                                                <MenuItem value={"little"}>Little</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        maxRows={10}
                                        id="description"
                                        label="Dissector Description"
                                        name="description"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="connectionType"
                                        label="Connection Type"
                                        id="connectionType"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="port"
                                        label="Port"
                                        id="port"
                                        type="number"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Privew Code
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider >
        );
}