import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      , div
    </Provider>
  );
  ReactDOM.unmountComponentAtNode(div);
});
