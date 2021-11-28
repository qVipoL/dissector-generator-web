class Converter {
    constructor(data) {
        this.data = data;
        this.typeToField = {
            'field': this.createField,
            'bitField': this.createBitField,
            'condition': this.createCondition
        }
    }

    createDissector() {
        return `endian=${this.data.endianType};

${this.createStructs(this.data.structs)}

details = {"${this.data.dissectorName}", "${this.data.description}"};
dissector ${this.data.dissectorName} = ${this.data.structs[0].structName};
dissectorTable["${this.data.connectionType}", "${this.data.port}"] = ${this.data.dissectorName};`;
    }

    createStructs(structs) {
        return structs.map((struct) => this.createStruct(struct)).join(``);
    }

    createStruct(struct) {
        return `struct ${struct.structName} {
    ${this.createFields(struct.fields)}
};
`;
    }

    createFields(fields) {
        return fields.map((field) => this.typeToField[field.type](field)).join(``);
    }

    createField(field) {
        return `
    ${field.fieldType} ${field.fieldName};
`;
    }

    createBitField(field) {
        return `
    ${field.fieldType}:${field.bitMask} ${field.fieldName};
`;
    }

    createCondition(field) {
        return `
    switch(${field.conditionField}) {
        ${field.cases.map((caseField) => `
        ${caseField.case}:
            ${caseField.fieldType} ${caseField.fieldName};
`).join(``)}
    };
`;
    }
}

export default Converter;