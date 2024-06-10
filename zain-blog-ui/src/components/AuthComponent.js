import { useEffect } from "react";
import { useDispatch, batch } from "react-redux"; // Import batch
import { useGetLoggedUserMutation } from "../services/userAuthApi";
import { getToken, removeToken } from "../services/localStorageService";
import { setUserInfo, unsetUserInfo } from "../store/slices/userInfo-slice";
import { unsetUserToken } from "../store/slices/auth-slice";
import { useNavigate } from "react-router-dom";

const AuthComponent = () => {
  const { access_token } = getToken();
  const [getLoggedUser, { data, isSuccess, isError }] = useGetLoggedUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("access token: ", access_token)


  

  useEffect(() => {
    if (access_token) {
      getLoggedUser(access_token);
    }
  }, [access_token, getLoggedUser, dispatch]);

  useEffect(() => {
    if (isError) {
      // Handle unauthorized token here
      console.log("Token is unauthorized. Logging out...");
      removeToken();
      batch(() => { // Wrap dispatch calls in batch
        dispatch(unsetUserToken({ access_token: null }));
        dispatch(
          unsetUserInfo({
            name: null,
            email: null,
            role: null,
            is_phone_verified: null,
          })
        );
      });
      navigate('/login-register')
    } else if (data && isSuccess) {
      console.log("Authcomponent data is set", data);
      batch(() => { // Wrap dispatch calls in batch
        dispatch(
          setUserInfo({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            is_phone_verified: data.is_phone_verified,
          })
        );
      });
    }
  }, [data, isSuccess, isError, dispatch, navigate]);

  useEffect(() => {
    if (data && access_token) {
      console.log("data", data);
      dispatch({ type: 'auth/loginSuccess', payload: { data } });
    } else {
      dispatch({ type: 'auth/logoutSuccess' });
    }
  }, [data, access_token, dispatch]);

  return null; // This component doesn't render anything visible
};

export default AuthComponent;