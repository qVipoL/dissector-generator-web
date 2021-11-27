import React, { useState, Fragment } from 'react';
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
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StructMenu from './StructMenu';

const theme = createTheme();

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
                }
            ]
        }
    ],
    mainStruct: 'dissector'
};

export default function DissectorForm(props) {
    const [values, setValues] = useState({
        formType: props.formType,
        endianType: props.data?.endianType || 'big',
        dissectorName: props.data?.dissectorName || '',
        description: props.data?.description || '',
        connectionType: props.data?.connectionType || '',
        port: props.data?.port || '',
        structs: props.data?.structs || [],
        mainStruct: props.data?.mainStruct || ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const addStruct = () => {
        setValues({
            ...values,
            structs: [
                ...values.structs,
                {
                    structName: '',
                    fields: []
                }
            ]
        });
    }

    const removeStruct = (idx) => {
        setValues({
            ...values,
            structs: [
                ...values.structs.slice(0, idx),
                ...values.structs.slice(idx + 1, values.structs.length)
            ]
        });
    }

    const addField = (type, structIdx) => {
        const structs = [
            ...values.structs
        ];

        structs[structIdx].fields.push({
            type,
            ...(type === 'condition' ? { cases: [] }
                : type === 'field' ? { fieldType: '', fieldName: '' }
                    : type === 'bitField' ?? { fieldType: '', fieldName: '', bitMask: '' })
        });

        setValues({
            ...values,
            structs
        });

        console.log(values)
    }

    const removeField = (structIdx, fieldIdx) => {
        const structs = [
            ...values.structs
        ];

        structs[structIdx].fields.splice(fieldIdx, 1);

        setValues({
            ...values,
            structs
        });
    }

    const addCase = (structIdx, fieldIdx) => {
        const structs = [
            ...values.structs
        ];

        structs[structIdx].fields[fieldIdx].cases.push({
            case: '',
            fieldType: '',
            fieldName: ''
        });

        setValues({
            ...values,
            structs
        });
    }

    const removeCase = (structIdx, fieldIdx, caseIdx) => {
        const structs = [
            ...values.structs
        ];

        structs[structIdx].fields[fieldIdx].cases.splice(caseIdx, 1);

        setValues({
            ...values,
            structs
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(values);
    };

    return (
        <ThemeProvider theme={theme} >
            <Container component="main" maxWidth="md">
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
                        Create Dissector
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
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

                            {
                                values.structs.map((struct, idx) => {
                                    return (
                                        <Fragment key={idx}>
                                            <Grid item xs={12} sm={10}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    name={`struct${idx}Name`}
                                                    label="Struct Name"
                                                    id={`struct${idx}Name`}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={1}>
                                                <StructMenu
                                                    addField={() => addField('field', idx)}
                                                    addBitField={() => addField('bitField', idx)}
                                                    addCondition={() => addField('condition', idx)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={1}>
                                                <IconButton
                                                    size="large"
                                                    aria-controls="menu-appbar"
                                                    aria-haspopup="true"
                                                    onClick={() => removeStruct(idx)}
                                                    color="inherit">
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Grid>

                                            {
                                                struct.fields.map((field, fieldIdx) => {
                                                    return (
                                                        <Fragment key={fieldIdx}>
                                                            {
                                                                field.type === 'field' ?
                                                                    <>
                                                                        <Grid item xs={12} sm={5}>
                                                                            <TextField
                                                                                required
                                                                                fullWidth
                                                                                name="fieldType"
                                                                                label="Field Type"
                                                                                id="fieldType"
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6}>
                                                                            <TextField
                                                                                required
                                                                                fullWidth
                                                                                name="fieldName"
                                                                                label="Field Name"
                                                                                id="fieldName"
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={1}>
                                                                            <IconButton
                                                                                size="large"
                                                                                aria-controls="menu-appbar"
                                                                                aria-haspopup="true"
                                                                                onClick={() => removeField(idx, fieldIdx)}
                                                                                color="inherit">
                                                                                <DeleteOutlineIcon />
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </>
                                                                    : field.type === 'bitField' ?
                                                                        <>
                                                                            <Grid item xs={12} sm={3}>
                                                                                <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    name="fieldType"
                                                                                    label="Field Type"
                                                                                    id="fieldType"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={4}>
                                                                                <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    name="fieldName"
                                                                                    label="Field Name"
                                                                                    id="fieldName"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={4}>
                                                                                <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    name="fieldMask"
                                                                                    label="Field Mask"
                                                                                    id="fieldMask"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={1}>
                                                                                <IconButton
                                                                                    size="large"
                                                                                    aria-controls="menu-appbar"
                                                                                    aria-haspopup="true"
                                                                                    onClick={() => removeField(idx, fieldIdx)}
                                                                                    color="inherit">
                                                                                    <DeleteOutlineIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </>
                                                                        : field.type === 'condition' &&
                                                                        <>
                                                                            <Grid item xs={12} sm={10}>
                                                                                <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    name="conditionField"
                                                                                    label="Condition Field"
                                                                                    id="conditionField"
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={1}>
                                                                                <IconButton
                                                                                    size="large"
                                                                                    aria-controls="menu-appbar"
                                                                                    aria-haspopup="true"
                                                                                    onClick={() => addCase(idx, fieldIdx)}
                                                                                    color="inherit">
                                                                                    <AddIcon />
                                                                                </IconButton>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={1}>
                                                                                <IconButton
                                                                                    size="large"
                                                                                    aria-controls="menu-appbar"
                                                                                    aria-haspopup="true"
                                                                                    onClick={() => removeField(idx, fieldIdx)}
                                                                                    color="inherit">
                                                                                    <DeleteOutlineIcon />
                                                                                </IconButton>
                                                                            </Grid>

                                                                            {
                                                                                field.cases?.map((fieldCase, caseIdx) => {
                                                                                    return (
                                                                                        <Fragment key={caseIdx}>
                                                                                            <Grid item xs={12} sm={3}>
                                                                                                <TextField
                                                                                                    required
                                                                                                    fullWidth
                                                                                                    name="case"
                                                                                                    label="Case"
                                                                                                    id="case"
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <TextField
                                                                                                    required
                                                                                                    fullWidth
                                                                                                    name="fieldType"
                                                                                                    label="Field Type"
                                                                                                    id="fieldType"
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <TextField
                                                                                                    required
                                                                                                    fullWidth
                                                                                                    name="fieldName"
                                                                                                    label="Field Name"
                                                                                                    id="fieldName"
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={1}>
                                                                                                <IconButton
                                                                                                    size="large"
                                                                                                    aria-controls="menu-appbar"
                                                                                                    aria-haspopup="true"
                                                                                                    onClick={() => removeCase(idx, fieldIdx, caseIdx)}
                                                                                                    color="inherit">
                                                                                                    <DeleteOutlineIcon />
                                                                                                </IconButton>
                                                                                            </Grid>
                                                                                        </Fragment>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </>
                                                            }

                                                        </Fragment>
                                                    );
                                                })
                                            }

                                        </Fragment>
                                    )
                                })
                            }

                            <Grid item xs={12} sm={1}>
                                <IconButton
                                    size="large"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={addStruct}
                                    color="inherit">
                                    <AddIcon />
                                </IconButton>
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