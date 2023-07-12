import React, {Component, useEffect, useState} from 'react'
import moment from 'moment';
import {Link, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {saveStudentStateAttr} from "../../../redux/actions/studentAction";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";

function OrganizationCard() {
    let { id } = useParams();
    const myDispatch = useDispatch();
    const {student,studentOrganizations} = useSelector(state => state.studentReducer);
    const authUser = useSelector(state => state.authUserReducer);
    const [isLoading,setIsLoading]=useState(false)


    useEffect(()=>{
        getStudentOrg();
    },[])

    const getStudentOrg = () => {
        setIsLoading(true);
        axios.get('/api/v1/student/getStudentOrganizations', {
            params: {
                api_token: authUser.api_token,
                id:id
            }
        })
            .then(response => {
                console.log('student_organization',response.data.result);
                myDispatch(saveStudentStateAttr('studentOrganizations',response.data.result?.student_organization));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };


    const deleteOrg=(org_id)=>{
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.delete('/api/v1/student/deleteStudentOrganization', {
                            params: {
                                api_token: authUser.api_token,
                                id:org_id
                            }
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
                                    //history.push(`/student/edit/${student.id}`)
                                    getStudentOrg();
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

        return (
            <React.Fragment>
                <div style={{display:'flex',justifyContent: 'space-between',paddingRight: '1rem'}}>
                    <span className={'org-title'}> Details of the training organization</span>
                    <div className="szn-widget__action">
                        <Link to={{
                            pathname: `/student/organization/new`,
                            state: {
                                data: ''
                            }
                        }} type="button" className="btn btn-outline-success btn-sm btn-upper">New</Link>&nbsp;
                    </div>
                </div>
                <div style={{paddingTop:10,paddingRight: '1rem'}} >
                    <table>
                        <thead>
                        <tr>
                            <th>Name122</th>
                            <th>Registration number</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Records</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        {isLoading &&
                            <tbody>
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                            </tbody>
                        }
                        {!isLoading &&
                            <tbody>
                           {studentOrganizations && studentOrganizations.map(item => (
                                <tr key={item.id}>
                                    <td>{item?.organization?.name}</td>
                                    <td>{item?.organization?.registration_number}</td>
                                    <td>{item.is_active==1?'Active':'Inactive'}</td>
                                    <td>{item.date_of_inception}</td>
                                    <td>{item.records}</td>
                                    <td>
                                        <Link className="btn-edit" to={`/student/organization/edit/${item.id}`}>Edit</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={ev => deleteOrg(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        }
                    </table>
                </div>
            </React.Fragment>
        )

}

export default OrganizationCard
