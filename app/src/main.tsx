import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Route, Switch } from "wouter";
import { HomePage } from "./pages/home-page.tsx";
import { SignInPage } from "./pages/sign-in.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/sign-in" component={SignInPage} />
      </Switch>
    </QueryClientProvider>
  </React.StrictMode>
);
