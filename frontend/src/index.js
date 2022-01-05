//components
import App from "./App";

import React from "react";
import ReactDOM from "react-dom";

//theme
import "./index.css";

//antd
import { ConfigProvider } from 'antd';
import itIT from 'antd/lib/locale/it_IT';


//redux
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider locale={itIT}>
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);