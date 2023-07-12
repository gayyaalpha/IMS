import authUserReducer from './authUser'
import activeComponentReducer from './activeComponent'
import { combineReducers } from 'redux'
import studentReducer from "./student";
import internalSupervisorReducer from "./internalSupervisor";
import commonReducer from "./common";
import externalSupervisorReducer from "./externalSupervisor";
import coordinatorReducer from "./coordinator";
//other reducers

const rootReducer = combineReducers({
    authUserReducer: authUserReducer,
    activeComponentReducer: activeComponentReducer,
    studentReducer: studentReducer,
    internalSupervisorReducer: internalSupervisorReducer,
    commonReducer: commonReducer,
    externalSupervisorReducer: externalSupervisorReducer,
    coordinatorReducer: coordinatorReducer,
});

export default rootReducer;
