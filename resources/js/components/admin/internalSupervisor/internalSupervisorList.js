import React, {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {saveInternalSupervisorStateAttr} from "../../../redux/actions/internalSupervisorAction";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {showSznNotification} from "../../../Helpers";
import SimpleReactValidator from 'simple-react-validator';
import {confirmAlert} from "react-confirm-alert";
import Modal from "../../shared/modal/modal";
import {saveStudentStateAttr} from "../../../redux/actions/studentAction";
import {Button} from "react-bootstrap";
import MultiSelect from "../../shared/formInput/MultiSelect";

function InternalSupervisorList(){

    let { id } = useParams();
    const myDispatch = useDispatch();
    const {supervisors} = useSelector(state => state.internalSupervisorReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)
    const [isOpenStudentModal,setIsOpenStudentModal]=useState(false)
    const [selectedSupervisor,setSelectedSupervisor]=useState({})
    const [selectedStudents,setSelectedStudents]=useState([])
    const [reviews, setStudents] = useState({});
    const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
    const simpleValidator = useRef(new SimpleReactValidator({
        autoForceUpdate: {forceUpdate: forceUpdate},
        className: 'small text-danger mdi mdi-alert pt-1 pl-1'
    }));

    useEffect(()=>{
        loadSupervisors();

    },[])

    useEffect(()=>{
        document.title = 'Internal Supervisor List';
        myDispatch(setActiveComponent('InternalSupervisorList'));
    },[])

    const loadSupervisors = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/supervisor/getInternalList', {
            params: {
                api_token: authUser.api_token,
                name:name,
                id:id
            }
        })
            .then(response => {
                myDispatch(saveInternalSupervisorStateAttr('supervisors',response.data.result));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };


    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        if(name==='searchByName'){
            if(value.length>2){
                loadSupervisors(value)
            }else if(value===''){
                loadSupervisors('')
            }
        }
        console.log({value});
    }

    const deleteSup = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/supervisor/destroy', {
                            api_token: authUser.api_token,
                            id: id
                        })
                            .then(response => {
                                setIsLoading(false);
                                if (response.data.status == 'error') {
                                    showSznNotification({
                                        type : 'error',
                                        message : response.data.message
                                    });
                                } else if (response.data.status == 'success') {
                                    showSznNotification({
                                        type : 'success',
                                        message : response.data.message
                                    });
                                    loadSupervisors();
                                }
                            })
                            .catch((error) => {
                                console.log(error);

                                setIsLoading(false);

                                if (error.response.data.status == 'error') {
                                    showSznNotification({
                                        type : 'error',
                                        message : error.response.data.message
                                    });
                                }
                            });
                    }
                },
                {
                    label: 'No',
                    //do nothing
                }
            ]
        });
    };


    const openStudentModal=(supervisor)=>{
        setSelectedSupervisor(supervisor)
        setIsOpenStudentModal(true)
    };

    const submitStudents=()=>{
        let studentIds= selectedStudents.map((student)=>{
            return student?.value
        })
        axios.post('/api/v1/admin/internalSupervisorAddStudent', {
            api_token: authUser.api_token,
            supervisor_id:selectedSupervisor?.id,
            studentIds:studentIds
        })
            .then(response => {
                if (response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : response.data.message
                    });
                } else if (response.data.status == 'success') {
                    setSelectedSupervisor({})
                    setSelectedStudents([])
                    setIsOpenStudentModal(false)
                    showSznNotification({
                        type : 'success',
                        message : response.data.message
                    });

                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.data.status == 'error') {
                    showSznNotification({
                        type : 'error',
                        message : error.response.data.message
                    });
                }
            });
    }

    return (  <React.Fragment>
        <div className="card animated fadeIn">
            <div className="card animated fadeIn">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                        <tr>
                            <th><input autoComplete="off" name={'searchByName'} onChange={onChangeHandle} className={'form-control form-control-sm'} type={'text'} placeholder={'Search By Name'}/></th>
                            <th></th>
                            <th></th>
                        </tr>
                        {isLoading &&
                        <tbody>
                        <tr>
                            <td colSpan="3" className="text-center">
                                Loading...
                            </td>
                        </tr>
                        </tbody>
                        }
                        {!isLoading &&
                        <tbody>
                        {supervisors && supervisors.map(supervisor => (
                            <tr key={supervisor.id}>
                                <td>{supervisor.name} </td>
                                <td>{supervisor.email}</td> {/* Add your action here */}
                                <td>
                                    <Link style={{marginRight:10,textDecoration:'none'}} className="btn-edit"  onClick={()=>{openStudentModal(supervisor)}} >Add Student</Link>
                                    <Link className="btn-edit" to={'/internal-supervisor/edit/'+supervisor.id}>Edit</Link>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteSup(supervisor.id)}} className="btn-delete" >Delete</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>}
                    </table>
                </div>
                <Modal title={`Add Students`} isOpen={isOpenStudentModal} onModalClose={()=>{ setSelectedStudents(null); setIsOpenStudentModal(false)}}>

                    <div className="form-group">
                        <div className="form-group">
                            <label>Students</label>
                            <div className="input-group input-group-sm">
                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-gradient-success text-white">
                                                        <i className="mdi mdi-account"></i>
                                                    </span>
                                </div>
                                <div style={{width:'95%'}}>
                                    {isOpenStudentModal &&  <MultiSelect
                                        endpoint={'/api/v1/student/list'}
                                        onChange={(item)=>{
                                            console.log({item})
                                            if(item){
                                                setSelectedStudents(item)
                                            }else{
                                                setSelectedStudents(null)
                                            }
                                        }}
                                        value={selectedStudents}
                                    />}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button id="save-button" onClick={()=>{submitStudents()}} className="save-button">Submit</button>
                    </div>
                </Modal>
            </div>
        </div>
    </React.Fragment>)
}
export default InternalSupervisorList
