import React, { Component } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';

class SupervisorCard extends Component {
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
                    <span className={'org-title'}>External supervisor</span>
                    <div className="szn-widget__action">
                        <Link to={{
                            pathname: `/student/supervisor/new`,
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
                            <th>Designation</th>
                            <th>Status</th>
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
                                    <td>
                                        <Link className="btn-edit" to={'/student/supervisor/edit/123'}>Edit</Link>
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

export default SupervisorCard
