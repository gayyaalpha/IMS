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
                  {{--<li class="nav-item">--}}
                      {{--<a class="nav-link" href="{{ route('ExternalSupervisorProfile') }}">--}}
                          {{--<span class="menu-title">My Profile</span>--}}
                          {{--<i class="mdi mdi-account menu-icon"></i>--}}
                      {{--</a>--}}
                  {{--</li>--}}
                  <li class="nav-item">
                      <a class="nav-link" href="{{ route('StudentsList') }}">
                          <span class="menu-title">Students</span>
                          <i class="mdi mdi-account-multiple menu-icon"></i>
                      </a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="{{ route('ChangePassword') }}">
                          <span class="menu-title">Change Password</span>
                          <i class="mdi mdi-textbox-password menu-icon"></i>
                      </a>
                  </li>
              </ul>
         </div>

            <div style="position: fixed;width: 13.6%; bottom: 0;">
                <ul class="nav">

                    <li class="nav-item">
                        <a class="nav-link" href="https://www.wyb.ac.lk/" target="_blank">
                            <span class="menu-title">WUSL</span>
                            <i class="mdi mdi-web menu-icon"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://facebook.com/wuslofficial/?_rdc=1&_rdr" target="_blank">
                            <span class="menu-title">WUSL</span>
                            <i class="mdi mdi-facebook menu-icon"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
