import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductImageGallerySlider from "../../components/product/ProductImageGallerySlider";
import ProductDescriptionInfoSlider from "../../components/product/ProductDescriptionInfoSlider";
import { useEffect, useState } from "react";

const ProductImageDescription = ({ spaceTopClass, spaceBottomClass, product }) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const wishlistItem = wishlistItems.find(item => item.id === product.id);
  const compareItem = compareItems.find(item => item.id === product.id);

  const [productPrice, setProductPrice] = useState(product.price)

  const currenyConverter = () =>{
    console.log("currency converter runned")
    if(currency.currencyName== 'EUR'){
      console.log("currency name eur", currency.name)
      setProductPrice(product.pricedict.EUR)
    }else if(currency.currencyName == 'GBP'){
      console.log("currency name gbp", currency.name)
      setProductPrice(product.pricedict.GBP)
    }else if(currency.currencyName == 'USD'){
      console.log("currency name usd", currency.name)
      setProductPrice(product.pricedict.USD)
    }
  };

  useEffect(() => {
    currenyConverter()
    console.log("product price", productPrice)
  }, [currency]);
  
  const discountedPrice = getDiscountPrice(productPrice, product.discount);
  const finalProductPrice = +(productPrice).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice
  ).toFixed(2);

  return (
    <div className={clsx("shop-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            {/* product description info */}
            <ProductDescriptionInfoSlider
              product={product}
              discountedPrice={discountedPrice}
              currency={currency}
              finalDiscountedPrice={finalDiscountedPrice}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProductImageDescription.propTypes = {
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default ProductImageDescription;
