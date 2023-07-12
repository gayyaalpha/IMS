export const saveExternalSupervisorStateAttr = (attr, value) => {
    return {
        type: 'SAVE_STATE_ATTR',
        [attr]: value
    }
};
