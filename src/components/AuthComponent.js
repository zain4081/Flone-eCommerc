import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetLoggedUserMutation } from "../services/userAuthApi";
import { getToken, removeToken } from "../services/localStorageService";
import { setUserInfo, unsetUserInfo } from "../store/slices/userInfo-slice";
import { unsetUserToken } from "../store/slices/auth-slice";




const AuthComponent = () => {
    const { access_token } = getToken();
    const [getLoggedUser, { data, isSuccess, isError }] = useGetLoggedUserMutation();
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (access_token) {
        getLoggedUser(access_token);
      }
    }, [access_token, getLoggedUser, dispatch]);
  
    useEffect(() => {
      if (data && access_token && isSuccess) {
        console.log("Authcomponent data is set", data);
        dispatch(
          setUserInfo({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          })
        );
      }
  
      if (isError) {
        removeToken();
        dispatch(unsetUserToken({ access_token: null }));
        dispatch(
          unsetUserInfo({
            name: null,
            email: null,
            role: null,
          })
        );
      }
    }, [data, access_token, isSuccess, isError, dispatch]);
  
    return null; // This component doesn't render anything visible
  };
  
  export default AuthComponent;
