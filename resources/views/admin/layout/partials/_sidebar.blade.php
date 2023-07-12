<nav class="sidebar sidebar-offcanvas" id="sidebar">
    <div style="position: fixed">
          <ul class="nav">
            <li class="nav-item nav-profile">
              <a href="#" class="nav-link">
                <div class="nav-profile-image">
                    <img id="profileImage" style="width: 100%; height: 100%" src="{{ Auth::user()->img?asset(Auth::user()->img):asset('assets/images/faces/face1.jpg') }}" alt="profile">
                  <span class="login-status online"></span>
                  <!--change to offline or busy as needed-->
                </div>
                <div class="nav-profile-text d-flex flex-column">
                  <span class="font-weight-bold mb-2">{{Auth::user()->name}}</span>
                  {{-- <span class="text-secondary text-small">Project Manager</span> --}}
                </div>
                <i class="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="{{ route('Dashboard') }}">
                <span class="menu-title">Dashboard</span>
                <i class="mdi mdi-home menu-icon"></i>
              </a>
            </li>
              <li class="nav-item">
                  <a class="nav-link" data-toggle="collapse" href="#user-routes" aria-expanded="false" aria-controls="user-routes">
                      <span class="menu-title">Users</span>
                      <i class="menu-arrow"></i>
                      <i class="mdi mdi-account-group menu-icon"></i>
                  </a>
                  <div class="collapse" id="user-routes">
                      <ul class="nav flex-column sub-menu">
                          <li class="nav-item"> <a class="nav-link" href="{{ route('UserList') }}">All</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('NewUser') }}">New</a></li>
                      </ul>
                  </div>
              </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#student-routes" aria-expanded="false" aria-controls="student-routes">
                <span class="menu-title">Students</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-account-multiple menu-icon"></i>
              </a>
              <div class="collapse" id="student-routes">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="{{ route('StudentsList') }}">All</a></li>
                  <li class="nav-item"> <a class="nav-link" href="{{ route('NewStudent') }}">New</a></li>
                </ul>
              </div>
            </li>
              <li class="nav-item">
                  <a class="nav-link" data-toggle="collapse" href="#organization-routes" aria-expanded="false" aria-controls="organization-routes">
                      <span class="menu-title">Organizations</span>
                      <i class="menu-arrow"></i>
                      <i class="mdi mdi-domain menu-icon"></i>
                  </a>
                  <div class="collapse" id="organization-routes">
                      <ul class="nav flex-column sub-menu">
                          <li class="nav-item"> <a class="nav-link" href="{{ route('OrganizationsList') }}">All</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('NewOrganization') }}">New</a></li>
                      </ul>
                  </div>
              </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#internal-supervisor-routes" aria-expanded="false" aria-controls="internal-supervisor-routes">
                <span class="menu-title">Internal Supervisor</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-account-supervisor-circle menu-icon"></i>
              </a>
              <div class="collapse" id="internal-supervisor-routes">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="{{ route('InternalSupervisorList') }}">All</a></li>
                  <li class="nav-item"> <a class="nav-link" href="{{ route('NewInternalSupervisor') }}">New</a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="collapse" href="#supervisor-routes" aria-expanded="false" aria-controls="supervisor-routes">
                    <span class="menu-title">External Supervisors</span>
                    <i class="menu-arrow"></i>
                    <i class="mdi mdi-account-supervisor menu-icon"></i>
                </a>
                <div class="collapse" id="supervisor-routes">
                    <ul class="nav flex-column sub-menu">
                        <li class="nav-item"> <a class="nav-link" href="{{ route('SupervisorList') }}">All</a></li>
                        <li class="nav-item"> <a class="nav-link" href="{{ route('NewSupervisor') }}">New</a></li>
                    </ul>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="collapse" href="#coordinator-routes" aria-expanded="false" aria-controls="coordinator-routes">
                    <span class="menu-title">Coordinator</span>
                    <i class="menu-arrow"></i>
                    <i class="mdi mdi-account-tie menu-icon"></i>
                </a>
                <div class="collapse" id="coordinator-routes">
                    <ul class="nav flex-column sub-menu">
                        <li class="nav-item"> <a class="nav-link" href="{{ route('CoordinatorList') }}">All</a></li>
                        <li class="nav-item"> <a class="nav-link" href="{{ route('NewCoordinator') }}">New</a></li>
                    </ul>
                </div>
            </li>
              <li class="nav-item">
                  <a class="nav-link" data-toggle="collapse" href="#news-routes" aria-expanded="false" aria-controls="news-routes">
                      <span class="menu-title">News</span>
                      <i class="menu-arrow"></i>
                      <i class="mdi mdi-newspaper menu-icon"></i>
                  </a>
                  <div class="collapse" id="news-routes">
                      <ul class="nav flex-column sub-menu">
                          <li class="nav-item"> <a class="nav-link" href="{{ route('NewsList') }}">All</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('NewsForm') }}">New</a></li>
                      </ul>
                  </div>
              </li>
              <li class="nav-item">
                  <a class="nav-link" data-toggle="collapse" href="#master-routes" aria-expanded="false" aria-controls="master-routes">
                      <span class="menu-title">Master</span>
                      <i class="menu-arrow"></i>
                      <i class="mdi mdi-database menu-icon"></i>
                  </a>
                  <div class="collapse" id="master-routes">
                      <ul class="nav flex-column sub-menu">
                          <li class="nav-item"> <a class="nav-link" href="{{ route('ClusterList') }}">Clusters</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('DepartmentList') }}">Departments</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('DesignationList') }}">Designations</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('CodeList') }}">Codes</a></li>
                          <li class="nav-item"> <a class="nav-link" href="{{ route('TypeList') }}">Types</a></li>
                      </ul>
                  </div>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="{{ route('ChangePassword') }}">
                      <span class="menu-title">Change Password</span>
                      <i class="mdi mdi-textbox-password menu-icon"></i>
                  </a>
              </li>
          </ul>
    </div>

{{--            <div style="position: fixed;width: 13.6%; bottom: 0;">--}}
{{--                <ul class="nav">--}}

{{--                    <li class="nav-item">--}}
{{--                        <a class="nav-link" href="https://www.wyb.ac.lk/" target="_blank">--}}
{{--                            <span class="menu-title">WUSL</span>--}}
{{--                            <i class="mdi mdi-web menu-icon"></i>--}}
{{--                        </a>--}}
{{--                    </li>--}}
{{--                    <li class="nav-item">--}}
{{--                        <a class="nav-link" href="https://facebook.com/wuslofficial/?_rdc=1&_rdr" target="_blank">--}}
{{--                            <span class="menu-title">WUSL</span>--}}
{{--                            <i class="mdi mdi-facebook menu-icon"></i>--}}
{{--                        </a>--}}
{{--                    </li>--}}
{{--                </ul>--}}
{{--            </div>--}}
        </nav>
