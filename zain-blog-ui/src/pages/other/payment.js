import React, { Fragment, useEffect } from "react";
import { useParams, useLocation, Navigate, useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { usePaymentSuccessMutation } from "../../services/commerceApi";

const Payment = () => {
  const { session_id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const payment = queryParams.get("payment");
  const success = queryParams.get("success");
  const { access_token } = getToken();
  const [addPayment, { isLoading, isError, isSuccess, data, error }] = usePaymentSuccessMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (success === 'true' && payment === 'checkout' && session_id) {
      const data = {
        method: 'checkout',
        session_id: session_id,
      };

      // Make sure access_token and session_id are available before making the API call
      if (access_token && session_id) {
        addPayment({'data': data, 'access_token': access_token});
      }
    }
  }, [success, payment, session_id, access_token, addPayment]);

  useEffect(() => {
    // If payment was successfully verified and isSuccess is true, navigate after 5 seconds
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 8000);

      return () => clearTimeout(timer); // Clean up timer on component unmount
    }
  }, [isSuccess, navigate]);

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout"
        description="Checkout page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Checkout", path: process.env.PUBLIC_URL + "/checkout" }, // Adjust pathname as needed
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {/* Display additional content based on payment and success statuses */}
            {isLoading && <h1>Verifying your payment...</h1>}
            {isError && <h1>Error verifying payment {error.message}</h1>}
            {isSuccess && (
              <div className="container">
                <h1>Payment successfully verified!</h1>
                <button className="btn btn-secondary" onClick={navigate("/")}>Go to Shopping Page</button>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Payment;
