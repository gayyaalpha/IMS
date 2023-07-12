//
const defaultState = {
    students: [],
    student: null,
    dropdowns:{},
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

const externalSupervisorReducer = (state = defaultState, action) => {
        if (action) {
        switch (action?.type) {
            case 'SAVE_STATE_ATTR':
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

export default externalSupervisorReducer;
