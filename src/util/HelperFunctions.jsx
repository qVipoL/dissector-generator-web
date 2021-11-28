const HelperFunctions = {
    trimAndRemoveSpaces(string) {
        return string.trim().replace(/\s/g, '_');
    }
};

export default HelperFunctions;