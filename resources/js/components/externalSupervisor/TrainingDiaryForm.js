import React, {useState, useEffect, useRef, createRef} from 'react'
import {connect, useDispatch, useSelector} from 'react-redux';
import rootAction from '../../redux/actions/index'
import { fadeIn } from 'animate.css'
import BeatLoader from 'react-spinners/BeatLoader'
import { showSznNotification} from '../../Helpers'
import LoadingOverlay from 'react-loading-overlay';
import SimpleReactValidator from 'simple-react-validator';
import {Link, useHistory, useParams} from 'react-router-dom';
import {saveStudentStateAttr} from "../../redux/actions/studentAction";

function TrainingDiaryForm(props) {
    let { id } = useParams();
    const reviewRef = createRef();
    const myDispatch = useDispatch();
    const {student,dropdowns,trainingDiaryData} = useSelector(state => state.studentReducer);
    const {externalSupervisor} = useSelector(state => state.externalSupervisorReducer);
    const [state, setState] = useState({
        data:  '',
        loading: false,
        authUser: props.authUserProp,
        isEdit: props.isEdit,
        status:'',
        date:'',
        training_type:'',
        code:'',
        comments:'',
        additional_hours:'',
        standard_hours:'',
        actual_hours:'',
        day_type:'',
        isWorkday:false,
        isPublicHoliday:false,
        isMercantileHoliday:false,
        isOnLeave:false,
    });

    let history = useHistory();

    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
            autoForceUpdate: {forceUpdate: forceUpdate},
            className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    useEffect(() => {
        loadTrainingDiaryData();
        loadDropdownData();
        if(props.isEdit){
            document.title = 'Edit Review';

            props.setActiveComponentProp('EditReview');
        }else{
            document.title = 'Add Review';

            props.setActiveComponentProp('AddReview');
        }
    }, []);

    const loadDropdownData = () => {
        axios.get('/api/v1/student/dropdown', {
            params: {
                api_token: authUser.api_token,
            }
        })
            .then(response => {
                myDispatch(saveStudentStateAttr('dropdowns',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(()=>{
        if(trainingDiaryData){
            setState({
                ...state,
                ...trainingDiaryData,
            })
        }
    },[trainingDiaryData])


    const loadTrainingDiaryData=()=>{
        axios.get('/api/v1/student/getStudentTrainingDiariesById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveStudentStateAttr('trainingDiaryData',response.data.result));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

    const onSubmitHandle = (e) =>{
        e.preventDefault();

            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/externalSupervisor/submitDayReview', $(e.target).serialize())
            .then(response => {
                setState({
                    ...state,
                    loading: false
                });
                if (response.data.status == 'validation-error') {
                    var errorArray = response.data.message;
                    $.each( errorArray, function( key, errors ) {
                        $.each( errors, function( key, errorMessage ) {
                            showSznNotification({
                                type : 'error',
                                message : errorMessage
                            });
                        });
                    });
                } else if (response.data.status == 'error') {
                        showSznNotification({
                            type : 'error',
                            message : response.data.message
                        });
                } else if (response.data.status == 'success') {
                    showSznNotification({
                        type : 'success',
                        message : response.data.message
                    });
                    history.push(`/student/training-diary/${student.id}`)
                }
            })
            .catch((error) => {
                console.log(error);

                setState({
                    ...state,
                    loading: false
                });
                if (error.response.data.status == 'validation-error') {
                    var errorArray = error.response.data.message;
                    $.each( errorArray, function( key, errors ) {
                        $.each( errors, function( key, errorMessage ) {
                            showSznNotification({
                                type : 'error',
                                message : errorMessage
                            });
                        });
                    });
                } else if (error.response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
                }
            });


    }
    // debugger;
    return (
        <React.Fragment>

                <div className="card animated fadeIn">
                    <div className="card-body">
                        <div className="row new-lead-wrapper d-flex justify-content-center">
                            <div className="col-md-8 ">
                                <LoadingOverlay
                                    active={state.loading}
                                    spinner={<BeatLoader />}
                                    styles={{
                                        overlay: (base) => ({
                                            ...base,
                                            opacity: '0.5',
                                            filter: 'alpha(opacity=50)',
                                            background: 'white'
                                        })
                                    }}
                                >
                                    <form className="edit-lead-form border" onSubmit={onSubmitHandle}>
                                        <input type="hidden" name="api_token" value={state.authUser.api_token} />
                                        <input type="hidden" name="training_diary_id" value={state?.id} />
                                        <input type="hidden" name="student_id" value={student?.id} />
                                        <input type="hidden" name="supervisor_id" value={externalSupervisor?.id} />
                                      {/*<pre> {JSON.stringify(state)}</pre>*/}
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">{state?.isEdit? 'EDIT':'Add'} Review</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Date </label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-calendar"></i>
                                                    </span>
                                                </div>
                                                <input disabled={true} type="date" className="form-control form-control-sm" id="date" name="date" placeholder="Date"
                                                       value={state?.date} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('date', state?.date, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Status</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-bank"></i>
                                                    </span>
                                                </div>
                                                <select className="form-control form-control-sm" disabled={true} id="status" name="status" value={state.status?.id} onChange={onChangeHandle}>
                                                    <option   value={''}>Select</option>
                                                    {dropdowns?.trainingDiaryStatus && dropdowns?.trainingDiaryStatus.map((item)=>{
                                                        return  <option   value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                            {simpleValidator.current.message('status', state?.status, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Training Type</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clipboard-alert"></i>
                                                    </span>
                                                </div>
                                                <select disabled={true} className="form-control form-control-sm" id="training_type" name="training_type" value={state.training_type} onChange={onChangeHandle}>
                                                      <option   value={''}>Select </option>
                                                    {dropdowns?.trainingTypes && dropdowns?.trainingTypes.map((item)=>{
                                                        return  <option   selected={state.training_type?.id===item.id?true:false} value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Code</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                                </div>
                                                <select disabled={true} className="form-control form-control-sm" id="code" name="code" value={state.code?.id} onChange={onChangeHandle}>
                                                    <option   value={''}>Select</option>
                                                    {dropdowns?.trainingDiaryCodes && dropdowns?.trainingDiaryCodes.map((item)=>{
                                                        return  <option   value={item.id}>{item.name}</option>
                                                    })}
                                                </select>
                                            </div>
                                            {simpleValidator.current.message('code', state?.code, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Comment</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-comment"></i>
                                                    </span>
                                                </div>
                                                <textarea disabled={true} rows={5} className="form-control form-control-sm" id="comments" name="comments" placeholder="Comments"
                                                       value={state?.comments} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('code', state?.code, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <div style={{display:'flex',flexDirection:'column'}}>
                                                <div style={{display:'flex',flexDirection:'row'}}> <input disabled={true} onChange={onChangeHandle} type="radio" checked={state?.day_type==='1'} value={'1'} name="day_type"/>&nbsp;&nbsp;&nbsp; Work day<br/></div>
                                                <div style={{display:'flex',flexDirection:'row'}}> <input disabled={true} onChange={onChangeHandle} type="radio" checked={state?.day_type==='2'} value={'2'} name="day_type"/>&nbsp;&nbsp;&nbsp; Public holiday<br/></div>
                                                <div style={{display:'flex',flexDirection:'row'}}> <input disabled={true} onChange={onChangeHandle} type="radio" checked={state?.day_type==='3'} value={'3'} name="day_type"/>&nbsp;&nbsp;&nbsp; Mercantile holiday<br/></div>
                                                <div style={{display:'flex',flexDirection:'row'}}> <input disabled={true} onChange={onChangeHandle} type="radio" checked={state?.day_type==='4'} value={'4'} name="day_type"/>&nbsp;&nbsp;&nbsp; On leave<br/></div>
                                            </div>

                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <label>Time</label>
                                        </div>
                                        <div className="form-group">
                                            <label>Actual Hours</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clock"></i>
                                                    </span>
                                                </div>
                                                <input disabled={true} type="text" className="form-control form-control-sm" id="actual_hours" name="actual_hours" placeholder="Actual Hours"
                                                       value={state?.actual_hours} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('actual_hours', state?.actual_hours, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Standard Hours</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clock"></i>
                                                    </span>
                                                </div>
                                                <input disabled={true} type="text" className="form-control form-control-sm" id="standard_hours" name="standard_hours" placeholder="Standard Hours"
                                                       value={state?.standard_hours} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('standard_hours', state?.standard_hours, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Additional Hours</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clock"></i>
                                                    </span>
                                                </div>
                                                <input disabled={true} type="text" className="form-control form-control-sm" id="additional_hours" name="additional_hours" placeholder="Additional Hours"
                                                       value={state?.additional_hours} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('additional_hours', state?.additional_hours, 'required')}
                                        </div>


                                        <div className="form-group">
                                            <label>Review</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-comment"></i>
                                                    </span>
                                                </div>
                                                <textarea ref={reviewRef} rows={5} className="form-control form-control-sm" id="review" name="review" placeholder="Add Review"  />
                                            </div>
                                        </div>


                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">{state?.isEdit? 'Submit':'Submit'} </button>
                                            <Link to={`/student/training-diary/${student.id}`} className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                        </div>
                                    </form>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </div>

        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    return {
        authUserProp: state.authUserReducer,
        activeComponentProp: state.activeComponentReducer,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setAuthUserProp: (user) => dispatch(setAuthUser(user)),
        setActiveComponentProp: (component) => dispatch(rootAction.setActiveComponent(component))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingDiaryForm)
