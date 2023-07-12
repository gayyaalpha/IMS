export const saveCoordinatorStateAttr = (attr, value) => {
    return {
        type: 'SAVE_COORDINATOR_STATE_ATTR',
        [attr]: value
    }
};
