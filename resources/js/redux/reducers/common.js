
const defaultState = {
    types:[],
    codes:[],
    designations:[],
    departments:[],
    clusters:[],
    organizations: [],
    organization: null,
    newss: [],
    news: null,
    students: [],
    users: [],
    user: {},
    student: null,
    dropdowns:{},
    studentOrganizations:[],
};


const commonReducer = (state = defaultState, action) => {
        if (action) {
        switch (action?.type) {
            case 'SAVE_COMMON_STATE_ATTR':
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

export default commonReducer;
