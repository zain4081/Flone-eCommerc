import { Fragment, useEffect } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderOne from "../../wrappers/hero-slider/HeroSliderOne";
import FeatureIcon from "../../wrappers/feature-icon/FeatureIcon";
import TabProduct from "../../wrappers/product/TabProduct";
import BlogFeatured from "../../wrappers/blog-featured/BlogFeatured";
import { getToken, removeToken } from "../../services/localStorageService";
import { useGetLoggedUserMutation } from "../../services/userAuthApi";
import { unsetUserToken } from "../../store/slices/auth-slice";
import { setUserInfo, unsetUserInfo } from "../../store/slices/userInfo-slice";
import { useDispatch } from "react-redux";

const HomeFashion = () => {
  const { access_token } = getToken();
  const [getLoggedUser, { data, isSuccess, isError, error }] = useGetLoggedUserMutation();
  const dispatch = useDispatch()

  useEffect(() => {
    if (access_token) {
      getLoggedUser(access_token);
    }
  }, [access_token, getLoggedUser]);


  if (data && access_token && isSuccess){
    console.log(data)
    console.log(isSuccess)
    dispatch(setUserInfo({
      name: data.name,
      email:  data.email,
      role: data.role,
    }))
  }
  console.log("isError", isError)
    if(isError){
    removeToken();
    dispatch(unsetUserToken({access_token: null}));
    dispatch(unsetUserInfo({
      name: null,
      email: null,
      role: null,
    }))
    console.log("logout");
    }

  

  return (
    <Fragment>
      <SEO
        titleTemplate="Fashion Home"
        description="Fashion home of flone react minimalist eCommerce template."
      />
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        {/* hero slider */}
        <HeroSliderOne />

        {/* featured icon */}
        <FeatureIcon spaceTopClass="pt-100" spaceBottomClass="pb-60" />

        {/* tab product */}
        <TabProduct spaceBottomClass="pb-60" category="fashion" />

        {/* blog featured */}
        <BlogFeatured spaceBottomClass="pb-55" />

        {/* error handling */}
        {isError && <div>Error: {error.message}</div>}
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
