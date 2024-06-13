import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
} from "reactstrap";
import { useGetLoggedUserMutation } from "../services/userAuthApi";
import { batch, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserInfo, unsetUserInfo } from "../redux/slices/userInfo-slice";
import { getToken, removeToken } from "../services/localStorageService";
import { useEffect } from "react";

const Home = () => {
  const { access_token } = getToken();
  const [getLoggedUser, { data, isSuccess, isError }] = useGetLoggedUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("access token: ", localStorage.getItem("access_token"));

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
        dispatch(
          unsetUserInfo({
            name: null,
            email: null,
            role: null,
          })
        );
      });
      navigate('/login')
    } else if (data && isSuccess) {
      console.log("Authcomponent data is set", data);
      batch(() => { // Wrap dispatch calls in batch
        dispatch(
          setUserInfo({
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          })
        );
      });
    }
  }, [data, isSuccess, isError, dispatch]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Kick start your project 🚀</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>All the best for your new project.</CardText>
          <CardText>
            Please make sure to read our{" "}
            <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/"
              target="_blank"
            >
              Template Documentation
            </CardLink>{" "}
            to understand where to go from here and how to use our template.
          </CardText>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Want to integrate JWT? 🔒</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            We carefully crafted JWT flow so you can implement JWT with ease and
            with minimum efforts.
          </CardText>
          <CardText>
            Please read our{" "}
            <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/docs/development/auth"
              target="_blank"
            >
              JWT Documentation
            </CardLink>{" "}
            to get more out of JWT authentication.
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
