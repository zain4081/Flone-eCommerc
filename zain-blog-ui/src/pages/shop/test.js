import { Fragment, useState, useEffect } from 'react';
import Paginator from 'react-hooks-paginator';
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom"
import { getSortedProducts } from '../../helpers/product';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { useGetProductsMutation } from '../../services/commerceApi';

const ShopGridStandard = () => {
    const [products, setProducts] = useState([]);
    const [ getProducts] = useGetProductsMutation();

    const fetchData = async () => {
        try {
          const response = await getProducts();
          if (response.data) {
            setProducts(response.data);
            console.log("response_products", response.data);
          }
         
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    let { pathname } = useLocation();


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Fragment>
            <SEO
                titleTemplate="Shop Page"
                description="Shop page of flone react minimalist eCommerce template."
            />

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb 
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "Shop", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 order-1 order-lg-2">
                                {/* shop page content default */}
                                <ShopProducts products={products} layout={'grid two-column'}/>

                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    {/* <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}


export default ShopGridStandard;