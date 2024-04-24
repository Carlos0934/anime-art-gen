import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Route, Switch } from "wouter";
import { HomePage } from "./pages/home-page.tsx";
import { SignInPage } from "./pages/sign-in.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sign-in" component={SignInPage} />
    </Switch>
  </React.StrictMode>
);
