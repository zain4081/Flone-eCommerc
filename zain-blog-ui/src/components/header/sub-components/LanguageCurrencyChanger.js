import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCurrency } from "../../../store/slices/currency-slice";

const LanguageCurrencyChanger = ({ defaultCurrency = "USD" }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const currency = useSelector(state => state.currency); // Adjust selector according to your Redux state structure
  const [userCountry, setUserCountry] = useState(null);

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) {
        throw new Error('Failed to fetch user location');
      }
      const data = await response.json();
      setUserCountry(data.country);
      // Dispatch action to set currency based on user's country
      dispatch(setCurrency(getCurrencyForCountry(data.country)));
    } catch (error) {
      console.error('Error fetching user location:', error);
      // Fallback to default currency/language on error
      setUserCountry(null); // or handle specific error case
    }
  };

  useEffect(() => {
    // Set default language to English
    i18n.changeLanguage("en");
  }, [i18n]);

  const changeLanguageTrigger = (e) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
  };

  const setCurrencyTrigger = (e) => {
    const currencyName = e.target.value;
    dispatch(setCurrency(currencyName));
  };

  const getInitialCurrency = () => {
    // Default to USD if user's country is not detected or mapped
    return currency.currencyName || defaultCurrency;
  };

  const getCurrencyForCountry = (countryCode) => {
    // Add logic to map user's country to currency
    switch (countryCode) {
      case "US":
        return "USD";
      case "FR":
        return "EUR";
      case "DE":
        return "EUR";
      default:
        return defaultCurrency; // Default currency passed as prop
    }
  };

  return (
    <div className="language-currency-wrap">
      <div className="same-language-currency language-style">
        <span>
          {i18n.resolvedLanguage === "en"
            ? "English"
            : i18n.resolvedLanguage === "fr"
            ? "French"
            : i18n.resolvedLanguage === "de"
            ? "German"
            : "Unknown Language"}{" "}
          <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="en" onClick={(e) => changeLanguageTrigger(e)}>
                English
              </button>
            </li>
            <li>
              <button value="fr" onClick={(e) => changeLanguageTrigger(e)}>
                French
              </button>
            </li>
            <li>
              <button value="de" onClick={(e) => changeLanguageTrigger(e)}>
                German
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency use-style">
        <span>
          {getInitialCurrency()} <i className="fa fa-angle-down" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button
                value="USD"
                onClick={(e) => setCurrencyTrigger(e)}
                className={getInitialCurrency() === "USD" ? "active" : ""}
              >
                USD
              </button>
            </li>
            <li>
              <button
                value="EUR"
                onClick={(e) => setCurrencyTrigger(e)}
                className={getInitialCurrency() === "EUR" ? "active" : ""}
              >
                EUR
              </button>
            </li>
            <li>
              <button
                value="GBP"
                onClick={(e) => setCurrencyTrigger(e)}
                className={getInitialCurrency() === "GBP" ? "active" : ""}
              >
                GBP
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency">
        <p>Call Us 3965410</p>
      </div>
    </div>
  );
};

LanguageCurrencyChanger.propTypes = {
  defaultCurrency: PropTypes.string.isRequired,
};

export default LanguageCurrencyChanger;
