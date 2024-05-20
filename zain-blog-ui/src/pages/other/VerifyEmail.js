import { Fragment, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useVerifyUserMutation } from "../../services/userAuthApi";

const VerifyEmail = () => {
  const [verifyUser, { data, error }] = useVerifyUserMutation();
  let { pathname } = useLocation();
  const { token } = useParams();

  useEffect(() => {
    verifyUser(token);
  }, [verifyUser, token]);

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
            {label: "Email Verification", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="error-area pt-40 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 text-center">
                <div className="error">
                  <h4>Email Verification</h4>
                  {data && <h2>Successfully Verified Email</h2>}
                  {error && <h2>Verification Failed</h2>}
                  <p>
                    {data ? "Your email has been verified successfully." : ""}
                    {error ? "There was an error verifying your email. Please try again." : ""}
                  </p>
                  <Link to={process.env.PUBLIC_URL + (data ? '/login-register' : '/')} className="error-btn">
                    Go to {data ? 'Login' : 'Home' } Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default VerifyEmail;
