import React, {useEffect, useRef, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";
import {showSznNotification} from "../../../Helpers";
import SimpleReactValidator from "simple-react-validator";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
import rootAction from "../../../redux/actions";
import connect from "react-redux/es/connect/connect";

function NewsForm(props){
    let { id } = useParams();
    let history = useHistory();
    const myDispatch = useDispatch();
    const {news,dropdowns} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)
    const [state, setState] = useState({
        data:  news,
        loading: false,
        authUser: authUser,
        title: '',
        description: '',
        author:'',

    });


    useEffect(()=>{
        if(props.isEdit){
            getNewsById();
        }

        return ()=>{
            // myDispatch(saveStudentStateAttr('student',{}));
        }
    },[])

    useEffect(() => {
        if(props.isEdit){
            document.title = 'Edit News';

            props.setActiveComponentProp('EditNews');
        }else{
            document.title = 'Add News';

            props.setActiveComponentProp('AddNews');
        }
    }, []);

    useEffect(()=>{
        if(news){
            setState({
                ...state,
                data:news,
                ...news,
                // supervisor: {value:student?.supervisor?.id,label:student?.supervisor?.name,item:student?.supervisor}
            })
        }
    },[news])



    const getNewsById = () => {
        axios.get('/api/v1/news/getNewsById', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log(response.data.result);
                myDispatch(saveCommonStateAttr('news',response.data.message));
            })
            .catch((error) => {
                console.log(error);
            });
    };


    //validator
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
        autoForceUpdate: {forceUpdate: forceUpdate},
        className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        setState({
            ...state,
            [name] : value
        });
    }

    const onSubmitHandle = (e) =>{
        e.preventDefault();

        if(props.isEdit){
            onUpdateNews(e)

        }else{
            onCreateNews(e)
            //  console.log("edit working")
        }

    }


    const onUpdateNews=(e)=>{
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/news/update', $(e.target).serialize())
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
                        history.push('/news/list')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
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
        } else {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        }
    }

    const onCreateNews=(e)=>{
        if (simpleValidator.current.allValid()) {
            setState({
                ...state,
                loading: true
            });

            axios.post('/api/v1/news/create', $(e.target).serialize())
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
                        history.push('/news/list')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
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
        } else {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        }
    }

    return (  <React.Fragment>
        <div style={{width:'100%'}}>
            <div className="card animated fadeIn">
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
                                        <input type="hidden" name="id" value={state?.id} />
                                        {/*<pre> {JSON.stringify(state)}</pre>*/}
                                        <div className="form-group">
                                            <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                                                <li className="nav-item">
                                                    <span className="nav-link btn btn-gradient-primary btn-block active">News</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clock"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="title" name="title" placeholder="Title"
                                                       value={state?.title} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('title', state?.title, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-comment"></i>
                                                    </span>
                                                </div>
                                                <textarea rows={5} className="form-control form-control-sm" id="description" name="description" placeholder="Description"
                                                          value={state?.description} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('description', state?.description, 'required')}
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <label>Author</label>
                                            <div className="input-group input-group-sm">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-clock"></i>
                                                    </span>
                                                </div>
                                                <input type="text" className="form-control form-control-sm" id="author" name="author" placeholder="Author"
                                                       value={state?.author} onChange={onChangeHandle}/>
                                            </div>
                                            {simpleValidator.current.message('author', state?.author, 'required')}
                                        </div>
                                        <div className="form-group text-center">
                                            <button type="submit" className="btn btn-gradient-primary btn-md mr-2">Add</button>
                                            <Link to='/student/training-diary' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                                        </div>
                                    </form>
                                </LoadingOverlay>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*    <div style={{marginTop:10}} className="card animated fadeIn">*/}
            {/*        <div className="card animated fadeIn">*/}
            {/*            <div className="card-body">*/}
            {/*                <div style={{marginLeft:'16%',marginRight:'16%'}}>*/}
            {/*                <OrganizationCard/>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
        </div>

    </React.Fragment>)
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

export default connect(mapStateToProps, mapDispatchToProps)(NewsForm)


//export default OrganizationForm
