import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";
import {saveCommonStateAttr} from "../../../redux/actions/commonAction";


function NewsList(){
    const myDispatch = useDispatch();
    const {newss} = useSelector(state => state.commonReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        loadNews();

    },[])

    useEffect(()=>{
        document.title = 'News List';
        myDispatch(setActiveComponent('NewsList'));
    },[])

    const loadNews = (title='') => {
        setIsLoading(true);
        axios.get('/api/v1/news/list', {
            params: {
                api_token: authUser.api_token,
                name:title
            }
        })
            .then(response => {
                myDispatch(saveCommonStateAttr('newss',response.data.result));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    const onChangeHandle = (e) =>{
        const { name, value } = e.target;
        if(name ==='searchByTitle'){
            if(value.length>2){
                loadNews(value)
            }else if(value===''){
                loadNews('')
            }
        }
      console.log({value});
    }

    const deleteUser = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/news/destroy', {
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
                                    loadNews();
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
                            <th>Title</th>
                            <th>Description</th>
                            <th>Author</th>
                            <th>Action</th>
                        </tr>
                        <tr>
                            <th><input autoComplete="off" name={'searchByTitle'} onChange={onChangeHandle} className={'form-control form-control-sm'} type={'text'} placeholder={'Search By Title'}/></th>
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
                        {newss && newss.map(news => (
                            <tr key={news.id}>
                                <td>{news.title}</td>
                                <td>{news.description}</td>
                                <td>{news.author}</td>
                                <td>
                                    <Link className="btn-edit" to={'/news/edit/'+news.id}>Edit</Link>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteUser(news.id)}} className="btn-delete" >Delete</Link>
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

export default NewsList
