export const saveStudentStateAttr = (attr, value) => {
    return {
        type: 'SAVE_STATE_ATTR',
        [attr]: value
    }
};
