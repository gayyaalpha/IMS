import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {saveStudentStateAttr} from "../../redux/actions/studentAction";
import {useDispatch, useSelector} from "react-redux";
import externalSupervisorReducer from "../../redux/reducers/externalSupervisor";
import setActiveComponent from "../../redux/actions/setActiveComponent";


function StudentList(){
    const myDispatch = useDispatch();
    const {students} = useSelector(state => state.studentReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const {externalSupervisor,test} = useSelector(state => state.externalSupervisorReducer);
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        if(externalSupervisor){
            loadStudents();
        }
    },[])

    useEffect(()=>{
        document.title = 'Student List';
        myDispatch(setActiveComponent('StudentList'));
    },[])

    useEffect(()=>{
        if(externalSupervisor){
            loadStudents();
        }
    },[externalSupervisor])

    const loadStudents = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/supervisor/getExternalSupervisorStudentList', {
            params: {
                api_token: authUser.api_token,
                name:name,
                id:externalSupervisor?.id
            }
        })
            .then(response => {
                myDispatch(saveStudentStateAttr('students',response.data.result));
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
                loadStudents(value)
            }else if(value===''){
                loadStudents('')
            }
        }
        console.log({value});
    }

    return (  <React.Fragment>
        <div className="card animated fadeIn">
            <div className="card animated fadeIn">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
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
                            {students && students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.name_with_initials}</td>
                                    <td>{student.status}</td> {/* Add your action here */}
                                    <td>
                                        <Link className="btn-edit" to={'/student/edit/'+student.id}>View</Link>
                                        <Link style={{marginLeft:10}} className="btn-edit" to={'/student/training-diary/'+student.id}>Training diary</Link>
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

export default StudentList
