import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {saveStudentStateAttr} from "../../../redux/actions/studentAction";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";
import FileUploader from "../../shared/formInput/fileUploader";
import * as XLSX from "xlsx";
import {Button} from "react-bootstrap";


function StudentList(){
    const myDispatch = useDispatch();
    const {students} = useSelector(state => state.studentReducer);
    const authUser = useSelector(state => state.authUserReducer);   //
    const [isLoading,setIsLoading]=useState(false)
    const [studentBulkData,setStudentBulkData]=useState([])
    const _excelFile = useRef(null);
    useEffect(()=>{
        loadStudents();

    },[])

    useEffect(()=>{
        document.title = 'Student List';
        myDispatch(setActiveComponent('Student List'));
    },[])

    const loadStudents = (name='') => {
        setIsLoading(true);
        axios.get('/api/v1/student/list', {
            params: {
                api_token: authUser.api_token,
                name:name
            }
        })
            .then(response => {                                                                 //save the api response to the redux store
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

    const deleteStudent = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/student/destroy', {
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
                                    loadStudents();
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

    const uploadStudents=(e)=>{
        setIsLoading(true);
        const f = e.target.files[0];
        const reader = new FileReader();
        // const result= {};
        let formattedData= [];

        reader.onload = (e) => {
            const binaryData = e.target.result;
            const workbook = XLSX.read(binaryData, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // const sheetData = XLSX.utils.sheet_to_json(sheet);
           let sheetData=[];
            workbook.SheetNames.forEach((sheetName, index) => {
                const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                if (roa.length) {
                    sheetData[index] = roa;
                }
            });

            if(sheetData[0]){
                let data=sheetData[0];
                let firstItem = data.shift();
                formattedData=data.map((item)=>{
                    return {
                        registration_number:item[0],
                        name_with_initials:item[1],
                        full_name:item[2],
                        email:item[3],
                        contact_number_home:item[4],
                        contact_number_mobile:item[5],
                        address:item[6],
                        city:item[7],
                    }
                });
                setStudentBulkData(formattedData);
                _excelFile.current = f;
                const formData = new FormData();
                formData.append('api_token', authUser.api_token);
                formData.append('file', f);
                formData.append('studentBulkData', JSON.stringify(formattedData));

                axios.post('/api/v1/student/bulkUpload', formData,{headers: {
                        "Content-Type": "multipart/form-data",
                    },})
                    .then(response => {
                        console.log('response then',response)
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
                            loadStudents();
                        }else{
                            console.log({response});
                        }
                    })
                    .catch((error) => {
                        console.log('response catch',error)
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
            setIsLoading(false);
        };
        reader.readAsBinaryString(f);
        console.log({studentBulkData})
    }

    return (  <React.Fragment>
        <div className="card animated fadeIn">
            <div className="card animated fadeIn">
                <div className="card-body">
                    {/*<table>*/}
                    {/*    <tbody>*/}
                    {/*    {studentBulkData.map((row, index) => (*/}
                    {/*        <tr key={index}>*/}
                    {/*            {Object.values(row).map((cell, index) => (*/}
                    {/*                <td key={index}>{cell}</td>*/}
                    {/*            ))}*/}
                    {/*        </tr>*/}
                    {/*    ))}*/}
                    {/*    </tbody>*/}
                    {/*</table>*/}
                    {/*{JSON.stringify(studentBulkData)}*/}
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <div style={{paddingBottom:10}}>
                            <a className={'btn-edit'} download={true} href={'/uploads/studentBulkUploads/studens-upload-template.xlsx'} style={{marginRight:10,color:'white',textDecoration:'none'}}>Download Template File </a>
                        </div>
                        <div style={{paddingBottom:10}}>
                            <FileUploader
                                label={'Upload Students '}
                                accept={'.xls, .xlsx, .xlsm, .xltx, .xltm,.csv'}
                                onUpload={(file)=>{uploadStudents(file)}}
                            />
                        </div>
                    </div>

                    <table className="table table-striped table-bordered">
                        <tr>
                            <th>Name</th>
                            <th>email</th>
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
                                <td>{student.email}</td>
                                <td>{student.status==1?'Active':'Inactive'}</td> {/* Add your action here */}
                                <td>
                                    <Link className="btn-edit" to={'/student/edit/'+student.id}>Edit</Link>
                                    <Link style={{marginLeft:10}} onClick={()=>{deleteStudent(student.id)}} className="btn-delete" >Delete</Link>
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
