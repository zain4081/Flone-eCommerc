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
import ReCAPTCHA from "react-google-recaptcha"

const LoginRegister = () => {
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [ server_error, setServerError ] = useState({});
  const [ success, setSuccess ] = useState();
  const [ capVal, setCapVal ] = useState(1);
  const [ registerCapVal, setRegisterCapVal ] = useState(null);
  // REACT_APP_RECAPTCHA_SECRET_KEY
  console.log("SITE KEY",process.env.REACT_APP_RECAPTCHA_SITE_KEY)
  
  // login handle
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
    const res = await loginUser(loginFormData)
    if(res.error){
      setServerError(res.error.data.errors)
      console.log("errors are", res.error.data.errors)
    }
    if(res.data){
      console.log("data is ", res.data)
      storeToken(res.data.token)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
      navigate('/')
    }  
  };
  let { access_token } = getToken()
  useEffect(() => {
      dispatch(setUserToken({ access_token: access_token }))
  },[access_token, dispatch])

// Register Handle
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
    const res = await registerUser(registerFormData)
    if(res.error){
      setServerError(res.error.data.errors)
      console.log("errors are", res.error.data.errors)
    }
    if(res.data){
      console.log("data is ", res.data.msg)
      
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
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Login Register", path: process.env.PUBLIC_URL + pathname }
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
                              <span 
                                className="error" 
                              >
                                {server_error.email ? server_error.email[0]: null}
                              </span>
                              <input
                                type="email"
                                name="email"
                                placeholder="User Email*"
                                value={loginFormData.email}
                                onChange={handleLoginChange}
                              />
                              <span 
                                className="error" 
                              >
                                {server_error.password ? server_error.password[0]: null}
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
                                  sitekey= {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                  onChange={(val)=> setCapVal(val)}
                                />
                                  {/* <button disabled={capVal==null || capVal=={}} type="submit"> */}
                                  <button  type="submit">
                                    <span>Login</span>
                                  </button>
                              </div>
                              <span 
                                className="error" 
                              >
                                {server_error.non_field_errors ? server_error.non_field_errors[0]: null}
                              </span>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                          
                            <form onSubmit={handleRegisterSubmit}>
                              <span 
                                className="error" 
                              >
                                {server_error.name ? server_error.name[0]: null}
                              </span>
                              <input
                                type="text"
                                name="name"
                                placeholder="Username"
                                value={registerFormData.name}
                                onChange={handleRegisterChange}
                              />
                              <span 
                                className="error" 
                              >
                                {server_error.phone_number ? server_error.phone_number[0]: null}
                              </span>
                              <input
                                type="text"
                                name="phone_number"
                                placeholder="+92XXXXXXXXXX"
                                value={registerFormData.phone_number}
                                onChange={handleRegisterChange}
                              />
                              <span 
                                className="error" 
                              >
                                {server_error.password ? server_error.password[0]: null}
                              </span>
                              <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerFormData.password}
                                onChange={handleRegisterChange}
                              />
                              <span 
                                className="error" 
                              >
                                {server_error.password2 ? server_error.password2[0]: null}
                              </span>
                              <input
                                type="password"
                                name="password2"
                                placeholder="Password Confirmation"
                                value={registerFormData.password2}
                                onChange={handleRegisterChange}
                              />
                              <span 
                                className="error" 
                              >
                                {server_error.email ? server_error.email[0]: null}
                              </span>
                              <input
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={registerFormData.email}
                                onChange={handleRegisterChange}
                              />
                              <span 
                                className="error" 
                              >
                                {server_error.role ? server_error.role[0]: null}
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
                                  sitekey= {process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                  onChange={(val)=> setRegisterCapVal(val)}
                                />
                                  <button disabled={registerCapVal==null || registerCapVal=={}} type="submit">
                                    <span>Register</span>
                                  </button>
                              </div>
                              <span 
                                className="error" 
                              >
                                {server_error.non_field_errors ? server_error.non_field_errors[0]: null}
                              </span>
                              <span 
                                className="success" 
                                >
                                  {success ? success: null}
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
