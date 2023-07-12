import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";



function DepartmentList(){
    const myDispatch = useDispatch();
    const {departments} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        loadDepartments();

    },[])

    useEffect(()=>{
        document.title = 'Department List';
        myDispatch(setActiveComponent('DepartmentList'));
    },[])

    const loadDepartments = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/department/list', {
            params: {
                api_token: authUser.api_token,
                name:name
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('departments',response.data.result));
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
                loadDepartments(value)
            }else if(value===''){
                loadDepartments('')
            }
        }
      console.log({value});
    }

    const deleteDepartment = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/department/destroy', {
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
                                    loadDepartments();
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
                            <th>Action</th>
                        </tr>
                        <tr>
                            <th style={{width:1000}}></th>
                            {/*<th><input autoComplete="off" name={'searchByName'} onChange={onChangeHandle} className={'form-control form-control-sm'} type={'text'} placeholder={'Search By Name'}/></th>*/}
                            <td> <Link className="btn-add" to={'/department/new/'} style={{marginLeft:10}}>New</Link>  </td>
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
                        {departments && departments.map(department => (
                            <tr key={department.id}>
                                <td>{department.name}</td>
                                <td>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteDepartment(department.id)}} className="btn-delete" >Delete</Link>
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

export default DepartmentList;
