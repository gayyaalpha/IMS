import React, {Component, useEffect, useState} from 'react'
import moment from 'moment';
import {Link, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {saveStudentStateAttr} from "../../redux/actions/studentAction";

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
                console.log(response.data.result);
                myDispatch(saveStudentStateAttr('studentOrganizations',response.data.result?.studendt_organization));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };
        return (
            <React.Fragment>
                <div style={{display:'flex',justifyContent: 'space-between',paddingRight: '1rem'}}>
                    <span className={'org-title'}> Details of the training organization</span>
                </div>
                <div style={{paddingTop:10,paddingRight: '1rem'}} >
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Registration number</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Records</th>
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
                                    <td>{item?.is_active==1?'Active':'Inactive'}</td>
                                    <td>{item.date_of_inception}</td>
                                    <td>{item.records}</td>
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
