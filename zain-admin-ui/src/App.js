import React, { Suspense } from "react";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// ** Router Import
import Router from "./router/Router";
import GoogleTranslate from "./views/translate";

const App = () => {
  return (
    <Suspense fallback={null}>
      <Router />
      <GoogleTranslate />
      <ToastContainer />
    </Suspense>
  );
};

export default App;
