import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";


function UserList(){
    const myDispatch = useDispatch();
    const {users} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        loadUser();

    },[])

    useEffect(()=>{
        document.title = 'User List';
        myDispatch(setActiveComponent('UserList'));
    },[])

    const loadUser = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/user/list', {
            params: {
                api_token: authUser.api_token,
                name:name
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('users',response.data.result));
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
                loadUser(value)
            }else if(value===''){
                loadUser('')
            }
        }
      console.log({value});
    }

    // const deleteUser = (id) => {
    //
    //     confirmAlert({
    //         title: 'Confirm to delete',
    //         message: 'Are you sure to do this.',
    //         buttons: [
    //             {
    //                 label: 'Yes',
    //                 onClick: () => {
    //                     setIsLoading(true);
    //
    //                     axios.post('/api/v1/user/destroy', {
    //                         api_token: authUser.api_token,
    //                         id: id
    //                     })
    //                         .then(response => {
    //                             setIsLoading(false);
    //                             if (response.data.status == 'error') {
    //                                 showSznNotification({
    //                                     type : 'error',
    //                                     message : response.data.message
    //                                 });
    //                             } else if (response.data.status == 'success') {
    //                                 showSznNotification({
    //                                     type : 'success',
    //                                     message : response.data.message
    //                                 });
    //                                 loadUser();
    //                             }
    //                         })
    //                         .catch((error) => {
    //                             console.log(error);
    //
    //                             setIsLoading(false);
    //
    //                             if (error.response.data.status == 'error') {
    //                                 showSznNotification({
    //                                     type : 'error',
    //                                     message : error.response.data.message
    //                                 });
    //                             }
    //                         });
    //                 }
    //             },
    //             {
    //                 label: 'No',
    //                 //do nothing
    //             }
    //         ]
    //     });
    // };

    return (  <React.Fragment>
        <div className="card animated fadeIn">
            <div className="card animated fadeIn">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
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
                        {users && users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role_name}</td>
                                <td>
                                    <Link className="btn-edit" to={'/user/edit/'+user.id}>Edit</Link>
                                    {/*<Link style={{marginLeft:10}} onClick={()=>{deleteUser(user.id)}} className="btn-delete" >Delete</Link>*/}
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

export default UserList
