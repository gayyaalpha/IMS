import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {saveInternalSupervisorStateAttr} from "../../redux/actions/internalSupervisorAction";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../Helpers";


function SupervisorList(){
    const myDispatch = useDispatch();
    const {supervisors} = useSelector(state => state.internalSupervisorReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)
    const [active_org,setActive_org]=useState(null)

    useEffect(()=>{
        loadSupervisors();

    },[])

    useEffect(()=>{
        document.title = 'External Supervisor List';
        myDispatch(setActiveComponent('ExternalSupervisorList'));
    },[])

    const loadSupervisors = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/student/supervisor/studentExternalList', {
            params: {
                api_token: authUser.api_token,
                name:name
            }
        })
            .then(response => {
                myDispatch(saveInternalSupervisorStateAttr('supervisors',response.data.result));
                setActive_org(response.data?.active_org)
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    const setAsActive=(id)=>{
        axios.get('/api/v1/student/setStudentSupervisorActive', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                loadSupervisors();
            })
            .catch((error) => {

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

                        axios.post('/api/v1/student/deleteStudentSupervisor', {
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

    return (  <React.Fragment>
        <div className="card animated fadeIn">
            <div className="card animated fadeIn">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Organization name</th>
                            <th>is Active </th>
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
                                <td>{supervisor.name}</td>
                                <td>{supervisor.email}</td>
                                <td>{supervisor?.organization_name}</td>
                                <td>{supervisor?.is_supervisor_active===1?'Active':'Inactive'}</td> {/* Add your action here */}
                                <td>
                                    <Link className="btn-edit" to={'/supervisor/edit/'+supervisor.id}>Edit</Link>
                                    {supervisor?.is_supervisor_active===1?'': supervisor?.organization_name===active_org?.name?<span style={{marginLeft:10}}><Link onClick={()=>{setAsActive(supervisor.id)}} className="btn-edit" >Active</Link></span>:''}
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteSup(supervisor.id)}} className="btn-delete" >Delete</Link>
                                </td>
                            </tr>
                        ))}
                            </tbody>}
                    </table>
                </div>
            </div>
        </div>
    </React.Fragment>)
}

export default SupervisorList
