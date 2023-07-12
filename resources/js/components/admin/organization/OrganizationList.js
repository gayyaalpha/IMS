import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";
import setActiveComponent from "../../../redux/actions/setActiveComponent";


function OrganizationList(){
    const myDispatch = useDispatch();
    const {organizations} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        loadOrganizations();
    },[])

    useEffect(()=>{
        document.title = 'Organization List';
        myDispatch(setActiveComponent('OrganizationList'));
    },[])

    const loadOrganizations = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/organizations/getList', {
            params: {
                api_token: authUser.api_token,
                query:name
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('organizations',response.data.result));
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
                loadOrganizations(value)
            }else if(value===''){
                loadOrganizations('')
            }
        }
      console.log({value});
    }
    const deleteOrganization = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/organizations/deleteOrganization', {
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
                                    loadOrganizations();
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
                            <th>Registration Number</th>
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
                        {organizations && organizations.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.registration_number}</td> {/* Add your action here */}
                                <td>
                                    <Link className="btn-edit" to={'/organization/edit/'+item.id}>Edit</Link>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteOrganization(item.id)}} className="btn-delete" >Delete</Link>
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

export default OrganizationList
