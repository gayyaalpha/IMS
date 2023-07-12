//
const defaultState = {
    students: [],
    student: null,
    dropdowns:{},
    studentOrganizations:[],
    studentOrganization:{},
    trainingDiariesList:[],
};

const studentReducer = (state = defaultState, action) => {
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

export default studentReducer;
