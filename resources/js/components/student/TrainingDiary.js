import React, {  useState, useEffect } from 'react'
import {useSelector, connect, useDispatch} from 'react-redux';
import rootAction from '../../redux/actions/index'
import ContentLoader from "react-content-loader"
import { fadeIn } from 'animate.css'
import { showSznNotification} from '../../Helpers'
import 'react-confirm-alert/src/react-confirm-alert.css';
import ProfileCard from "./ProfileCard";
import OrganizationCard from "./OrganizationCard";
import {Link, useHistory} from "react-router-dom";
import WeekTable from "./WeekTable";
import {saveStudentStateAttr} from "../../redux/actions/studentAction";

function TrainingDiary(props) {
    const myDispatch = useDispatch();
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {student} = useSelector(state => state.studentReducer);

    //get reducer
    const authUser = useSelector(state => state.authUserReducer);

    //get authUser/reducer alternative
    //const authUser = props.authUserProp;

    useEffect(() => {
        document.title = 'TrainingDiary';

        props.setActiveComponentProp('TrainingDiary');

    }, []);

    useEffect(() => {
        if(student){
            loadData();
        }
    }, [student]);


    const skeletonLoader = () => {
        return <div className="content-loader-wrapper">
            <ContentLoader
                speed={2}
                viewBox="0 0 945 500"
                backgroundColor="#f3f3f3"
                foregroundColor="#dad8d8"
            >
                <rect x="33" y="36" rx="0" ry="0" width="92" height="90" />
                <rect x="144" y="41" rx="0" ry="0" width="196" height="15" />
                <rect x="144" y="69" rx="0" ry="0" width="353" height="12" />
                <rect x="143" y="92" rx="0" ry="0" width="399" height="18" />
                <rect x="143" y="116" rx="0" ry="0" width="51" height="14" />
                <rect x="205" y="118" rx="0" ry="0" width="298" height="12" />
                <rect x="517" y="116" rx="0" ry="0" width="26" height="15" />
                <rect x="0" y="10" rx="0" ry="0" width="13" height="487" />
                <rect x="-29" y="2" rx="0" ry="0" width="1001" height="11" />
                <rect x="930" y="7" rx="0" ry="0" width="66" height="490" />
                <rect x="6" y="358" rx="0" ry="0" width="2" height="15" />
                <rect x="5" y="484" rx="0" ry="0" width="935" height="13" />
                <rect x="797" y="32" rx="0" ry="0" width="44" height="28" />
                <rect x="854" y="32" rx="0" ry="0" width="56" height="28" />
                <rect x="43" y="186" rx="0" ry="0" width="100" height="47" />
                <rect x="255" y="186" rx="0" ry="0" width="100" height="47" />
                <rect x="476" y="185" rx="0" ry="0" width="100" height="47" />
                <rect x="693" y="184" rx="0" ry="0" width="100" height="47" />
                <rect x="7" y="242" rx="0" ry="0" width="952" height="17" />
                <rect x="33" y="281" rx="0" ry="0" width="92" height="90" />
                <rect x="144" y="286" rx="0" ry="0" width="196" height="15" />
                <rect x="144" y="314" rx="0" ry="0" width="353" height="12" />
                <rect x="143" y="337" rx="0" ry="0" width="399" height="18" />
                <rect x="143" y="361" rx="0" ry="0" width="51" height="14" />
                <rect x="205" y="363" rx="0" ry="0" width="298" height="12" />
                <rect x="517" y="361" rx="0" ry="0" width="26" height="15" />
                <rect x="797" y="277" rx="0" ry="0" width="44" height="28" />
                <rect x="854" y="277" rx="0" ry="0" width="56" height="29" />
                <rect x="43" y="431" rx="0" ry="0" width="100" height="47" />
                <rect x="255" y="431" rx="0" ry="0" width="100" height="47" />
                <rect x="476" y="430" rx="0" ry="0" width="100" height="47" />
                <rect x="693" y="429" rx="0" ry="0" width="100" height="47" />
            </ContentLoader>
        </div>
    };


    const loadData = () => {
        setIsLoading(true);
        axios.get('/api/v1/student/getStudentTrainingDiariesList', {
            params: {
                api_token: authUser.api_token,
                id:student?.id
            }
        })
            .then(response => {
                myDispatch(saveStudentStateAttr('trainingDiariesList',response.data.result));
                setIsLoading(false);
            })
            .catch((error) => {
                showSznNotification({
                    type : 'error',
                    message : error.response.data.message
                });
                setIsLoading(false);
            });
    };



    return (
        <React.Fragment>
            <div className="card animated fadeIn">
                <div className="card animated fadeIn">
                    <div className="card-body">
                        <div style={{padding: '1rem'}} >
                            <div style={{paddingTop:10,paddingRight: '1rem'}} >
                                {isLoading?skeletonLoader():<WeekTable/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


//redux state can be accessed as props in this component(Optional)
const mapStateToProps = (state) => {
    return {
        authUserProp: state.authUserReducer,
        activeComponentProp: state.activeComponentReducer,
    }
}

/**
 * redux state can be change by calling 'props.setAuthUserProp('demo user');' when
 * applicable(Optional to )
 *
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setAuthUserProp: (user) => dispatch(rootAction.setAuthUser(user)),
        setActiveComponentProp: (component) => dispatch(rootAction.setActiveComponent(component))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingDiary)
