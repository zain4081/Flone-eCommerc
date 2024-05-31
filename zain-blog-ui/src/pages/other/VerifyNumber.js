import { Fragment, useEffect, useRef, useState } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { Breadcrumb } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useSendOtpMutation, useVerifyOtpMutation } from "../../services/userAuthApi";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../store/slices/userInfo-slice";

const VerifyNumber = () => {
    const [otp, setOTP] = useState(['', '', '', '']);
    const [isOtpGenerated, setIsOtpGenerated] = useState(0);
    const [serverSuccess, setServerSuccess] = useState(null);
    const [serverError, setServerError] = useState();
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const [sendOtp] = useSendOtpMutation();
    const [ verifyOtp] = useVerifyOtpMutation();
    let { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user_info = useSelector((state) => state.user);

    


    console.log("user_info ",user_info.phone_number ? user_info : "null")
    
    const handlerSendOtp = async (e) => {
      e.preventDefault();
      const res = await sendOtp(user_info.id)
      console.log("send otp resposne", res)
      if(res.error){
        setIsOtpGenerated(0)
          setServerSuccess()
          setServerError(res.error.data)
      }
      if(res.data){
        setIsOtpGenerated(1)
        setServerError(null)
        setServerSuccess(res.data)
        console.log("send otp resposne", res.data)
      }
    };
  


    const handleChange = (index, value) => {
      if (!isNaN(value) && value !== '') {
        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);
        if (index < 3 && value !== '') {
          inputRefs[index + 1].current.focus();
        }
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const enteredOTP = otp.join('');
      const data = {
        "otp": enteredOTP,
      }
      const response = await verifyOtp({"data": data, "user_id": user_info.id})
      console.log("verify otp response", response)
      if(response.data){
        setServerError()
        
        dispatch(
          setUserInfo({
            is_phone_verified: true,
          })
        );
        console.log("User info", user_info)
        window.location.reload()
        setServerSuccess(response.data)
      }
      if(response.error){
        console.log("response error otp",response.error)
        setServerSuccess()
        setOTP(['', '', '', '']);
        setServerError(response.error.data)
        if(response.error.data === "Otp is Expired"){
          setIsOtpGenerated(1)
        }
      }
    };
  
    return (
        <Fragment>
        <SEO
          titleTemplate="VerifyEmail"
          description="EmailVerification page of flone react minimalist eCommerce template."
        />
        <LayoutOne headerTop="visible">
          {/* breadcrumb */}
          <Breadcrumb 
            pages={[
              {label: "Home", path: process.env.PUBLIC_URL + "/" },
              {label: "Phone Verification", path: process.env.PUBLIC_URL + pathname }
            ]} 
          />
          <div className="error-area pt-40 pb-100">
            <div className="container">
              <div className="row justify-content-center">
              
                <div className="col-xl-7 col-lg-8 text-center">
                
                {isOtpGenerated == 1 ?
                <>
                    <h2>Enter Your Otp Recieved on Register Phone Number</h2>
                  
                  <form onSubmit={handleSubmit}>
                      <div>
                          {otp.map((digit, index) => (
                          <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleChange(index, e.target.value)}
                              ref={inputRefs[index]}
                              style={{ margin: '5px', width: '30px', textAlign: 'center' }}
                          />
                          ))}
                      </div>
                      <button type="submit">Submit OTP</button>
                  </form>
                </>
                :(
                  <>
                    {user_info.is_phone_verified == true ?  (<h2>Your Number is verified</h2>) :
                      (
                        <>
                        <h2>Verify Phone Number</h2>
                        <button type="submit" onClick={handlerSendOtp}>Send Otp</button>
                        </>
                      )
                    }
                  </>
                  )}
                <div className="errors-success">
                <span 
                  className="error" 
                >
                  {serverError ? serverError: null}
                </span>
                <span 
                  className="success" 
                >
                  {serverSuccess && serverSuccess.length > 0 ? serverSuccess: null}
                </span>
                </div>
                </div>
                
              </div>
            </div>
          </div>
        </LayoutOne>
      </Fragment>
    );
};

export default VerifyNumber;


