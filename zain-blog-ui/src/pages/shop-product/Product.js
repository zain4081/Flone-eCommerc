import React, { Fragment, useEffect, useState } from "react"; 
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import { useGetProductMutation } from "../../services/commerceApi";

const Product = () => {
  let { pathname } = useLocation();

  let { id } = useParams();
  const [ getProduct ] = useGetProductMutation();
  const [product, setProduct] = useState();
  const fetchdata= async (productId) => {
    try{
      const response = await getProduct(productId);
      
      if(response.data){

        setProduct(response.data)

        
      }else{
        console.log("response error", response);
      }
    }
    catch(error){
      console.error(error);
  }
  
}
useEffect(() => {
  fetchdata(id);
}, [id]);
console.log("response product page id", product);

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product Page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Shop Product", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        {product && typeof product !== 'undefined' ? (
          <>
          {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />
        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product.description}
        />
        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.category}
        />
          </>
        ): ""}
        

        
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
