import React, { Component } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import ProfileImage from "../shared/profileImage/profileImage";

class ProfileCard extends Component {
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
                <div className="szn-portlet">
                    <div className="szn-portlet__body">
                        <div className="szn-widget szn-widget--user-profile-3">
                            <div className="szn-widget__top">
                                { true ?
                                    <ProfileImage  imagePath={authUser?.img}/> :
                                <div
                                    className="szn-widget__pic szn-widget__pic--danger szn-font-danger szn-font-boldest szn-font-light ">
                                    {this.props.obj.name.split(' ').map(function(str) { return str ? str[0].toUpperCase() : "";}).join('')}
                                </div> }
                                <div className="szn-widget__content">
                                    <div className="szn-widget__head">
                                        <Link to={{
                                            pathname: `/external-supervisor/edit/${this.props.obj.id}`,
                                            state: {
                                                lead: this.props.obj
                                            }
                                        }} className="szn-widget__username">
                                            {this.props.obj.name}
                                            { this.props.obj.status == 0 ? <i className="mdi mdi-close-circle-outline szn-font-danger"></i>
                                            : <i className="mdi mdi-checkbox-marked-circle szn-font-success"></i> }
                                        </Link>
                                        <div className="szn-widget__action">
                                            <Link to={{
                                                pathname: `/external-supervisor/edit/${this.props.obj.id}`,
                                                state: {
                                                    data: this.props.obj
                                                }
                                            }} type="button" className="btn btn-outline-success btn-sm btn-upper">Edit</Link>&nbsp;
                                         </div>
                                    </div>
                                    <div className="szn-widget__subhead d-flex flex-column flex-md-row">
                                        <a href={void(0)}><i className="mdi mdi-email"></i>{this.props.obj.email}</a>
                                        <a href={void(0)}><i className="mdi mdi-phone"></i>{this.props.obj.phone} </a>
                                        { this.props.obj.address ? <a href={void(0)}><i className="mdi mdi-home"></i>{this.props.obj.address}</a> : '' }
                                    </div>
                                    <div className="szn-widget__info">
                                        <div className="szn-widget__desc">
                                            {this.props.obj.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ProfileCard
