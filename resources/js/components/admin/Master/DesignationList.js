import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";



function DesignationList(){
    const myDispatch = useDispatch();
    const {designations} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        loadDesignations();

    },[])

    useEffect(()=>{
        document.title = 'Designation List';
        myDispatch(setActiveComponent('DesignationList'));
    },[])

    const loadDesignations = (designation='') => {
        setIsLoading(true);
        axios.get('/api/v1/designation/list', {
            params: {
                api_token: authUser.api_token,
                designation:designation
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('designations',response.data.result));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    const onChangeHandle = (e) =>{
        const { designation, value } = e.target;
        if(designation==='searchByName'){
            if(value.length>2){
                loadDesignations(value)
            }else if(value===''){
                loadDesignations('')
            }
        }
      console.log({value});
    }

    const deleteDesignation = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/designation/destroy', {
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
                                    loadDesignations();
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
                            <th style={{width:1000}}>Name</th>
                            <th>Action</th>
                        </tr>
                        <tr>
                            <th></th>
                            {/*<th><input autoComplete="off" designation={'searchByName'} onChange={onChangeHandle} className={'form-control form-control-sm'} type={'text'} placeholder={'Search By Name'}/></th>*/}
                            <td> <Link className="btn-add" style={{marginLeft:10}} to={'/designation/new'}>New</Link>  </td>
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
                        {designations && designations.map(designation => (
                            <tr key={designation.id}>
                                <td>{designation.designation}</td>
                                <td>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteDesignation(designation.id)}} className="btn-delete" >Delete</Link>
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

export default DesignationList;
