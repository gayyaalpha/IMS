export const saveInternalSupervisorStateAttr = (attr, value) => {
    return {
        type: 'SAVE_INT_SUP_STATE_ATTR',
        [attr]: value
    }
};
