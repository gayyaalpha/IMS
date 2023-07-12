import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";



function CodeList(){
    const myDispatch = useDispatch();
    const {codes} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        loadCodes();

    },[])

    useEffect(()=>{
        document.title = 'Code List';
        myDispatch(setActiveComponent('CodeList'));
    },[])

    const loadCodes = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/code/list', {
            params: {
                api_token: authUser.api_token,
                name:name
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('codes',response.data.result));
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
                loadCodes(value)
            }else if(value===''){
                loadCodes('')
            }
        }
      console.log({value});
    }

    const deleteCode = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/code/destroy', {
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
                                    loadCodes();
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
                            {/*<th><input autoComplete="off" name={'searchByName'} onChange={onChangeHandle} className={'form-control form-control-sm'} type={'text'} placeholder={'Search By Name'}/></th>*/}
                            <td> <Link className="btn-add" style={{marginLeft:10}} to={'/code/new/'}>New</Link>  </td>
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
                        {codes && codes.map(code => (
                            <tr key={code.id}>
                                <td>{code.name}</td>
                                <td>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteCode(code.id)}} className="btn-delete" >Delete</Link>
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

export default CodeList;
