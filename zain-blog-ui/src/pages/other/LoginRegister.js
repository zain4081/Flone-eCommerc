import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import { useRegisterUserMutation, useLoginUserMutation } from "../../services/userAuthApi";
import { getToken, storeToken } from "../../services/localStorageService";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { setUserToken } from "../../store/slices/auth-slice";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

const LoginRegister = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [serverError, setServerError] = useState({});
  const [success, setSuccess] = useState();
  const [capVal, setCapVal] = useState(null);
  const [registerCapVal, setRegisterCapVal] = useState(null);
  const clientId = '944391205578-jftpodvt0g39nb19q6loat2n0rv6s6hf.apps.googleusercontent.com';

  const responseGoogle = async (response) => {
    console.log("google response", response.credential)
    try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/account/google-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: response.credential }),
        });
        if (res.ok) {
            const data = await res.json();
            // console.log("data is ", res.data);
            if(data){
              storeToken(data);
              let { access_token } = getToken();
              console.log("google token is ", access_token);
              dispatch(setUserToken({ access_token }));
              navigate('/');
              console.log("data from google-login endpoint", data);
            }
        } else {
            console.error('Failed to authenticate with Google', res);
        }
    } catch (error) {
        console.error('Error authenticating with Google:', error);
    }
  };

  const onFailure = (error) => {
    console.error('Error during Google login:', error);
  };

  
  // facebook login


    const handleFacebookResponse = (response) => {
      console.log(response);
      // Here you can send the access token to your backend server
      fetch(`${process.env.REACT_APP_API_URL}/account/facebook-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: response.accessToken,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Backend response:', data);
          // Handle the response from your backend
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const handleLoginChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(loginFormData);
    if (res.error) {
      setServerError(res.error.data.errors);
      console.log("errors are", res.error.data.errors);
    }
    if (res.data) {
      console.log("data from normal-login endpoint", res.data.token);
      storeToken(res.data.token);
      let { access_token } = getToken();
      dispatch(setUserToken({ access_token }));
      navigate('/');
      console.log("data from normal-login endpoint", res.data.token);
    }  
  };
  let { access_token } = getToken();
  useEffect(() => {
      dispatch(setUserToken({ access_token }));
  }, [access_token, dispatch]);

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    role: "creator",
    password: "",
    password2: "",
    phone_number: "+92"
  });

  const handleRegisterChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(registerFormData);
    if (res.error) {
      setServerError(res.error.data.errors);
      console.log("errors are", res.error.data.errors);
    }
    if (res.data) {
      console.log("data is ", res.data.msg);
      setRegisterFormData({
        name: "",
        email: "",
        role: "",
        password: "",
        password2: "",
      });
      setSuccess(res.data.msg);
      navigate('/login-register');
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb 
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Login Register", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLoginSubmit}>
                              <span className="error">
                                {serverError.email ? serverError.email[0] : null}
                              </span>
                              <input
                                type="email"
                                name="email"
                                placeholder="User Email*"
                                value={loginFormData.email}
                                onChange={handleLoginChange}
                              />
                              <span className="error">
                                {serverError.password ? serverError.password[0] : null}
                              </span>
                              <input
                                type="password"
                                name="password"
                                placeholder="Password*"
                                value={loginFormData.password}
                                onChange={handleLoginChange}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <ReCAPTCHA
                                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                  onChange={(val) => setCapVal(val)}
                                />
                                <button disabled={capVal == null || capVal == {}} type="submit">
                                  Login
                                </button>
                              </div>
                              <span className="error">
                                {serverError.non_field_errors ? serverError.non_field_errors[0] : null}
                              </span>
                            </form>
                          </div>
                        </div>
                        <div className="Auth-form-container">
                          <GoogleOAuthProvider clientId={clientId}>
                            <GoogleLogin
                              onSuccess={responseGoogle}
                              onFailure={onFailure}
                              cookiePolicy="single_host_origin"
                              useOneTap
                            />
                          </GoogleOAuthProvider>
                          </div>
                          <div className="Auth-form-container">
                            <FacebookLogin
                                appId={process.env.REACT_APP_FACEBOOK_APP_ID} // Replace with your Facebook app ID
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={handleFacebookResponse}
                                render={(renderProps) => (
                                  <button 
                                    onClick={renderProps.onClick}
                                    style={{
                                      backgroundColor: '#4267b2',
                                      color: '#fff',
                                      fontSize: '16px',
                                      padding: '12px 24px',
                                      border: 'none',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    Login with Facebook
                                  </button>
                                )}
                      
                              />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleRegisterSubmit}>
                              <span className="error">
                                {serverError.name ? serverError.name[0] : null}
                              </span>
                              <input
                                type="text"
                                name="name"
                                placeholder="Username"
                                value={registerFormData.name}
                                onChange={handleRegisterChange}
                              />
                              <span className="error">
                                {serverError.phone_number ? serverError.phone_number[0] : null}
                              </span>
                              <input
                                type="text"
                                name="phone_number"
                                placeholder="+92XXXXXXXXXX"
                                value={registerFormData.phone_number}
                                onChange={handleRegisterChange}
                              />
                              <span className="error">
                                {serverError.password ? serverError.password[0] : null}
                              </span>
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerFormData.password}
                                onChange={handleRegisterChange}
                              />
                              <span className="error">
                                {serverError.password2 ? serverError.password2[0] : null}
                              </span>
                              <input
                                type="password"
                                name="password2"
                                placeholder="Password Confirmation"
                                value={registerFormData.password2}
                                onChange={handleRegisterChange}
                              />
                              <span className="error">
                                {serverError.email ? serverError.email[0] : null}
                              </span>
                              <input
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={registerFormData.email}
                                onChange={handleRegisterChange}
                              />
                              <span className="error">
                                {serverError.role ? serverError.role[0] : null}
                              </span>
                              <select
                                name="role"
                                value={registerFormData.role}
                                onChange={handleRegisterChange}
                              >
                                <option value="creator" active>Creator</option>
                                <option value="editor">Editor</option>
                              </select>
                              <div className="button-box">
                                <ReCAPTCHA
                                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                  onChange={(val) => setRegisterCapVal(val)}
                                />
                                <button disabled={registerCapVal == null || registerCapVal == {}} type="submit">
                                  <span>Register</span>
                                </button>
                              </div>
                              <span className="error">
                                {serverError.non_field_errors ? serverError.non_field_errors[0] : null}
                              </span>
                              <span className="success">
                                {success ? success : null}
                              </span>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
