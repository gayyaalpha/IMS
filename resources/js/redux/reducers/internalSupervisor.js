//
const defaultState = {
    supervisors: [],
    internalSupervisor: null,
    test: "test",
    dropdowns:{},
    internalSupervisors: [],
};
// const studentReducer = (state = defaultState, action) => {
//     if (action) {
//         switch (action?.type) {
//             case 'SAVE_STATE_ATTR':
//                 const attr = Object.keys(action)[1];
//                 const value = Object.values(action)[1];
//                 return {
//                     ...state,
//                     [attr]: value
//                 };
//         }
//     }
// }
//
// export default studentReducer();
//

const internalSupervisorReducer = (state = defaultState, action) => {
        if (action) {
        switch (action?.type) {
            case 'SAVE_INT_SUP_STATE_ATTR':
                const attr = Object.keys(action)[1];
                const value = Object.values(action)[1];
                return {
                    ...state,
                    [attr]: value
                };

            default:
                return state;
        }
    }
}

export default internalSupervisorReducer;
