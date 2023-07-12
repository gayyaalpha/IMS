export const saveCommonStateAttr = (attr, value) => {
    return {
        type: 'SAVE_COMMON_STATE_ATTR',
        [attr]: value
    }
};
