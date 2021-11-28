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
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import Converter from '../util/Converter';
import StructMenu from './StructMenu';
import DissectorModal from './DissectorModal';
import Auth from '../util/Auth';
import HelperFunctions from '../util/HelperFunctions';

const { trimAndRemoveSpaces } = HelperFunctions;

const theme = createTheme();

async function requestConversion(data) {
    const response = await fetch('http://localhost/dissector-generator-api/api/routes/dissectors/convert.php', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    return await response.json();
}

async function requestCreate(action, data) {
    const actionUrl = `http://localhost/dissector-generator-api/api/routes/dissectors/${action}.php`;
    const response = await fetch(actionUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    return await response.json();
}

export default function DissectorForm(props) {
    const [values, setValues] = useState({
        id: props.data?.id || '',
        formType: props.formType,
        endianType: props.data?.endianType || 'big',
        dissectorName: props.data?.dissectorName || '',
        description: props.data?.description || '',
        connectionType: props.data?.connectionType || '',
        port: props.data?.port || '',
        structs: props.data?.structs || [],
        mainStruct: props.data?.mainStruct || '',
        luaCode: props.data?.luaCode || ''
    });

    const [isOpen, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleStructChange = (prop, structIdx, fieldIdx = null, caseIdx = null) => (event) => {
        const structs = [
            ...values.structs
        ];

        if (fieldIdx === null && caseIdx === null)
            structs[structIdx][prop] = event.target.value;
        else if (fieldIdx !== null && caseIdx === null)
            structs[structIdx].fields[fieldIdx][prop] = event.target.value;
        else
            structs[structIdx].fields[fieldIdx].cases[caseIdx][prop] = event.target.value;

        setValues({
            ...values,
            structs
        })
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

    const isDisabled = values.structs.length < 1
        || !!values.structs.find((struct) => struct.fields?.length < 1
            || !!struct.fields.find((field => field.type === 'condition' && field.cases.length < 1)))

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedValues = {
            ...values,
            dissectorName: trimAndRemoveSpaces(values.dissectorName),
            connectionType: trimAndRemoveSpaces(values.connectionType),
            structs: values.structs.map((struct) => {
                return {
                    ...struct,
                    structName: trimAndRemoveSpaces(struct.structName),
                    fields: struct.fields?.map((field) => {
                        console.log(trimAndRemoveSpaces(field.fieldName))
                        return {
                            ...field,
                            fieldName: trimAndRemoveSpaces(field.fieldName),
                            ...(field.fieldType ? { fieldType: trimAndRemoveSpaces(field.fieldType) } : null),
                            ...(field.bitMask ? { bitMask: trimAndRemoveSpaces(field.bitMask) } : null),
                            ...(field.cases ? {
                                cases: field.cases.map((caseField) => {
                                    return {
                                        ...caseField,
                                        fieldName: trimAndRemoveSpaces(caseField.fieldName),
                                        fieldType: trimAndRemoveSpaces(caseField.fieldType)
                                    };
                                })
                            } : null)
                        };
                    })
                };
            })
        }

        const converter = new Converter(formattedValues);
        setValues({ ...formattedValues })
        console.log(converter.createDissector());

        const response = await requestConversion({
            code: converter.createDissector()
        });

        if (!response.success) {
            Auth.logout();
            navigate('/dissector-generator-web/login');
        } else {
            setValues({ ...values, luaCode: response.luaCode });
            setOpen(true);
        }
    };

    const createDissector = async (event) => {
        event.preventDefault();

        const action = values.formType === 'update' ? `${values.formType}?id=${values.id}` : values.formType;

        const dissector = {
            ...values
        };

        delete dissector.formType;

        const response = await requestCreate(action, {
            name: values.dissectorName,
            description: values.description,
            code: values.luaCode,
            fields: dissector
        });

        setOpen(false);

        if (!response.success) {
            Auth.logout();
            navigate('/dissector-generator-web/login');
        } else {
            navigate('/dissector-generator-web');
        }
    }

    return (
        <ThemeProvider theme={theme} >
            <DissectorModal
                handleClose={handleClose}
                open={isOpen}
                luaCode={values.luaCode}
                handleChange={handleChange}
                createDissector={createDissector} />
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
                        {values.formType[0].toUpperCase() + values.formType.slice(1)} Dissector
                    </Typography>
                    <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    name="dissectorName"
                                    required
                                    fullWidth
                                    id="dissectorName"
                                    value={values.dissectorName}
                                    label="Dissector Name"
                                    onChange={handleChange('dissectorName')}
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
                                    value={values.description}
                                    label="Dissector Description"
                                    name="description"
                                    onChange={handleChange('description')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    required
                                    fullWidth
                                    name="connectionType"
                                    label="Connection Type"
                                    id="connectionType"
                                    value={values.connectionType}
                                    onChange={handleChange('connectionType')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    name="port"
                                    label="Port"
                                    value={values.port}
                                    id="port"
                                    type="number"
                                    onChange={handleChange('port')}
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
                                                    name="structName"
                                                    label="Struct Name"
                                                    value={values.structs[idx].structName}
                                                    id="structName"
                                                    onChange={handleStructChange('structName', idx)}
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
                                                <Tooltip title="Delete Struct">
                                                    <IconButton
                                                        size="large"
                                                        aria-controls="menu-appbar"
                                                        aria-haspopup="true"
                                                        onClick={() => removeStruct(idx)}
                                                        color="inherit">
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
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
                                                                                value={values.structs[idx].fields[fieldIdx].fieldType}
                                                                                id="fieldType"
                                                                                onChange={handleStructChange('fieldType', idx, fieldIdx)}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6}>
                                                                            <TextField
                                                                                required
                                                                                fullWidth
                                                                                name="fieldName"
                                                                                label="Field Name"
                                                                                id="fieldName"
                                                                                value={values.structs[idx].fields[fieldIdx].fieldName}
                                                                                onChange={handleStructChange('fieldName', idx, fieldIdx)}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={1}>
                                                                            <Tooltip title="Delete field">
                                                                                <IconButton
                                                                                    size="large"
                                                                                    aria-controls="menu-appbar"
                                                                                    aria-haspopup="true"
                                                                                    onClick={() => removeField(idx, fieldIdx)}
                                                                                    color="inherit">
                                                                                    <DeleteOutlineIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
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
                                                                                    value={values.structs[idx].fields[fieldIdx].fieldType}
                                                                                    onChange={handleStructChange('fieldType', idx, fieldIdx)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={4}>
                                                                                <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    name="fieldName"
                                                                                    label="Field Name"
                                                                                    id="fieldName"
                                                                                    value={values.structs[idx].fields[fieldIdx].fieldName}
                                                                                    onChange={handleStructChange('fieldName', idx, fieldIdx)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={4}>
                                                                                <TextField
                                                                                    required
                                                                                    fullWidth
                                                                                    name="bitMask"
                                                                                    label="Bit Mask"
                                                                                    id="bitMask"
                                                                                    type="number"
                                                                                    value={values.structs[idx].fields[fieldIdx].bitMask}
                                                                                    onChange={handleStructChange('bitMask', idx, fieldIdx)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={1}>
                                                                                <Tooltip title="Delete bit field">
                                                                                    <IconButton
                                                                                        size="large"
                                                                                        aria-controls="menu-appbar"
                                                                                        aria-haspopup="true"
                                                                                        onClick={() => removeField(idx, fieldIdx)}
                                                                                        color="inherit">
                                                                                        <DeleteOutlineIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>
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
                                                                                    value={values.structs[idx].fields[fieldIdx].conditionField}
                                                                                    onChange={handleStructChange('conditionField', idx, fieldIdx)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={1}>
                                                                                <Tooltip title="Add case">
                                                                                    <IconButton
                                                                                        size="large"
                                                                                        aria-controls="menu-appbar"
                                                                                        aria-haspopup="true"
                                                                                        onClick={() => addCase(idx, fieldIdx)}
                                                                                        color="inherit">
                                                                                        <AddIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={1}>
                                                                                <Tooltip title="Delete condition">
                                                                                    <IconButton
                                                                                        size="large"
                                                                                        aria-controls="menu-appbar"
                                                                                        aria-haspopup="true"
                                                                                        onClick={() => removeField(idx, fieldIdx)}
                                                                                        color="inherit">
                                                                                        <DeleteOutlineIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>
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
                                                                                                    type="number"
                                                                                                    value={values.structs[idx].fields[fieldIdx].cases[caseIdx].case}
                                                                                                    onChange={handleStructChange('case', idx, fieldIdx, caseIdx)}
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <TextField
                                                                                                    required
                                                                                                    fullWidth
                                                                                                    name="fieldType"
                                                                                                    label="Field Type"
                                                                                                    id="fieldType"
                                                                                                    value={values.structs[idx].fields[fieldIdx].cases[caseIdx].fieldType}
                                                                                                    onChange={handleStructChange('fieldType', idx, fieldIdx, caseIdx)}
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <TextField
                                                                                                    required
                                                                                                    fullWidth
                                                                                                    name="fieldName"
                                                                                                    label="Field Name"
                                                                                                    id="fieldName"
                                                                                                    value={values.structs[idx].fields[fieldIdx].cases[caseIdx].fieldName}
                                                                                                    onChange={handleStructChange('fieldName', idx, fieldIdx, caseIdx)}
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={1}>
                                                                                                <Tooltip title="Delete case">
                                                                                                    <IconButton
                                                                                                        size="large"
                                                                                                        aria-controls="menu-appbar"
                                                                                                        aria-haspopup="true"
                                                                                                        onClick={() => removeCase(idx, fieldIdx, caseIdx)}
                                                                                                        color="inherit">
                                                                                                        <DeleteOutlineIcon />
                                                                                                    </IconButton>
                                                                                                </Tooltip>
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
                                <Tooltip title="Add struct">
                                    <IconButton
                                        size="large"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={addStruct}
                                        color="inherit">
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            {
                                isDisabled && (
                                    <Grid item xs={12} sm={1}>
                                        <Tooltip title="You must create at least one struct with fields and conditional fields must have at least one field...">
                                            <IconButton
                                                size="large"
                                                aria-haspopup="true"
                                                color="inherit">
                                                <QuestionMarkIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )
                            }
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isDisabled}
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