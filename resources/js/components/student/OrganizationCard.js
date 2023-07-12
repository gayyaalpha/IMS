import React, { Component } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';

class OrganizationCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

    }

    render() {
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
                            <th>Name</th>
                            <th>Registration number</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Records</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        {/*{loading &&*/}
                        {/*    <tbody>*/}
                        {/*    <tr>*/}
                        {/*        <td colSpan="5" className="text-center">*/}
                        {/*            Loading...*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*    </tbody>*/}
                        {/*}*/}
                        {/*{!loading &&*/}
                            <tbody>
                            {/*{users.map(u => (*/}
                                <tr key={123}>
                                    <td>1</td>
                                    <td>test1</td>
                                    <td>sfsdf@d</td>
                                    <td>233322</td>
                                    <td>233322</td>
                                    <td>
                                        <Link className="btn-edit" to={'/student/organization/edit/123'}>Edit</Link>
                                        &nbsp;
                                        <button className="btn-delete" onClick={ev => console.log('sd')}>Delete</button>
                                    </td>
                                </tr>
                            {/*))}*/}
                            </tbody>
                        {/*}*/}
                    </table>
                </div>
            </React.Fragment>
        )
    }
}

export default OrganizationCard
