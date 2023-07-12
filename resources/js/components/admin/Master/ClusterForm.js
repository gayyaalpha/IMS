import React, {useEffect, useRef, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {saveStudentStateAttr} from "../../../redux/actions/studentAction";
import {useDispatch, useSelector} from "react-redux";
import {showSznNotification} from "../../../Helpers";
import SimpleReactValidator from "simple-react-validator";
import EditProfile from "../../student/EditProfile";
import LoadingOverlay from "react-loading-overlay";
import BeatLoader from "react-spinners/BeatLoader";
// import OrganizationCard from "./OrganizationCard";
import SelectInput from "../../shared/formInput/Select";
import CreatableSelectInput from "../../shared/formInput/CreatableSelect";
import setActiveComponent from "../../../redux/actions/setActiveComponent";


function ClusterForm(props) {
  let {id} = useParams();
  const myDispatch = useDispatch();
  const {cluster, dropdowns} = useSelector(state => state.commonReducer);
  const authUser = useSelector(state => state.authUserReducer);
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState({
    data: cluster,
    loading: false,
    authUser: authUser,
    name: ''
  });

  let history = useHistory();


  useEffect(() => {
    document.title =  'New Cluster';
    myDispatch(setActiveComponent( 'NewCluster'));
  }, [])

  useEffect(() => {
    if (cluster) {
      setState({
        ...state,
        data: cluster,
        ...cluster,
        // supervisor: {value: cluster?.supervisor?.id, label: cluster?.supervisor?.name, item: cluster?.supervisor}
      })
    }
  }, [cluster])



  //validator
  const [, forceUpdate] = useState() //this is a dummy state, when form submitted, change the state so that message is rendered
  const simpleValidator = useRef(new SimpleReactValidator({
    autoForceUpdate: {forceUpdate: forceUpdate},
    className: 'small text-danger mdi mdi-alert pt-1 pl-1'
  }));

  const onChangeHandle = (e) => {
    const {name, value} = e.target;
    setState({
      ...state,
      [name]: value
    });
  }

  const onSubmitHandle = (e) => {
    e.preventDefault();
      onCreateCluster(e)

  }



  const onCreateCluster = (e) => {
    if (simpleValidator.current.allValid()) {
      setState({
        ...state,
        loading: true
      });

      axios.post('/api/v1/cluster/create', $(e.target).serialize())
        .then(response => {
          setState({
            ...state,
            loading: false
          });
          if (response.data.status == 'validation-error') {
            var errorArray = response.data.message;
            $.each(errorArray, function (key, errors) {
              $.each(errors, function (key, errorMessage) {
                showSznNotification({
                  type: 'error',
                  message: errorMessage
                });
              });
            });
          } else if (response.data.status == 'error') {
            showSznNotification({
              type: 'error',
              message: response.data.message
            });
          } else if (response.data.status == 'success') {
            showSznNotification({
              type: 'success',
              message: response.data.message
            });
            history.push('/cluster/list')
          }
        })
        .catch((error) => {
          console.log(error);
          showSznNotification({
            type: 'error',
            message: error.response.data.message
          });
          setState({
            ...state,
            loading: false
          });
          if (error.response.data.status == 'validation-error') {
            var errorArray = error.response.data.message;
            $.each(errorArray, function (key, errors) {
              $.each(errors, function (key, errorMessage) {
                showSznNotification({
                  type: 'error',
                  message: errorMessage
                });
              });
            });
          } else if (error.response.data.status == 'error') {
            showSznNotification({
              type: 'error',
              message: error.response.data.message
            });
          }
        });
    } else {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    }
  }

  return (<React.Fragment>
    <div style={{width: '100%'}}>
      <div className="card animated fadeIn">
        <div className="card animated fadeIn">
          <div className="card-body">
            <div className="row new-lead-wrapper d-flex justify-content-center">
              <div className="col-md-8 ">
                <LoadingOverlay
                  active={state.loading}
                  spinner={<BeatLoader/>}
                  styles={{
                    overlay: (base) => ({
                      ...base,
                      opacity: '0.5',
                      filter: 'alpha(opacity=50)',
                      background: 'white'
                    })
                  }}
                >
                  <form className="edit-lead-form border" onSubmit={onSubmitHandle}>
                    <input type="hidden" name="api_token" value={state.authUser.api_token}/>
                    <input type="hidden" name="id" value={state.data?.id}/>
                    {/*<input type="hidden" name="user_id" value={state.authUser?.id} />*/}
                    <div className="form-group">
                      <ul className="nav nav-tabs nav-pills c--nav-pills nav-justified">
                        <li className="nav-item">
                          <span className="nav-link btn btn-gradient-primary btn-block active">{'Add Cluster'}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="form-group">
                      <label>Name</label>
                      <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-gradient-success text-white">
                              <i className="mdi mdi-account"></i>
                          </span>
                        </div>
                        <input type="text" className="form-control form-control-sm" id="name"
                               name="name" placeholder="Name"
                               value={state.name} onChange={onChangeHandle}/>
                      </div>
                    </div>


                    <div className="form-group text-center">
                      <button type="submit"
                              className="btn btn-gradient-primary btn-md mr-2">{'Add'}</button>
                      <Link to='/cluster/list' className="btn btn-inverse-secondary btn-md">Cancel</Link>
                    </div>
                  </form>
                </LoadingOverlay>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </React.Fragment>)
}

export default ClusterForm;
