import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import setActiveComponent from "../../../redux/actions/setActiveComponent";
import {saveCoordinatorStateAttr} from "../../../redux/actions/coordinatorAction";
import {confirmAlert} from "react-confirm-alert";
import {showSznNotification} from "../../../Helpers";


function CoordinatorList() {
  const myDispatch = useDispatch();
  const {coordinator} = useSelector(state => state.coordinatorReducer);
  const authUser = useSelector(state => state.authUserReducer);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadCoordinators();

  }, [])

  useEffect(() => {
    document.title = 'Coordinator List';
    myDispatch(setActiveComponent('CoordinatorList'));
  }, [])

  const loadCoordinators = (name = '') => {
    setIsLoading(true);
    axios.get('/api/v1/coordinator/list', {
      params: {
        api_token: authUser.api_token,
        name: name
      }
    })
      .then(response => {
        myDispatch(saveCoordinatorStateAttr('coordinator', response.data.result));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const onChangeHandle = (e) => {
    const {name, value} = e.target;
    if (name === 'searchByName') {
      if (value.length > 2) {
        loadCoordinators(value)
      } else if (value === '') {
        loadCoordinators('')
      }
    }
    console.log({value});
  }

    const deleteCoordinator = (id) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setIsLoading(true);

                        axios.post('/api/v1/coordinator/destroy', {
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
                                    loadCoordinators();
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

  return (<React.Fragment>
    <div className="card animated fadeIn">
      <div className="card animated fadeIn">
        <div className="card-body">
          <table className="table table-striped table-bordered">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
            <tr>
              <th><input autoComplete="off" name={'searchByName'} onChange={onChangeHandle}
                         className={'form-control form-control-sm'} type={'text'} placeholder={'Search By Name'}/></th>
              {/*<th></th>*/}
              {/*<th></th>*/}
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
              {coordinator && coordinator.length > 0 && coordinator.map(coordinator => (
                <tr key={coordinator.id}>
                  <td>{coordinator.name}</td>
                  <td>{coordinator.email}</td>
                  {/* Add your action here */}
                  <td>
                    <Link className="btn-edit" to={'/coordinator/edit/' + coordinator.id}>Edit</Link>
                      <Link style={{marginLeft:10}} onClick={()=>{deleteCoordinator(coordinator.id)}} className="btn-delete" >Delete</Link>
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

export default CoordinatorList;
