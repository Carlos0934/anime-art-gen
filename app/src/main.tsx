import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Route, Switch } from "wouter";
import { HomePage } from "./pages/home-page.tsx";
import { SignInPage } from "./pages/sign-in-page.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/auth-context.tsx";
import { ImagesPage } from "./pages/images-page.tsx";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/images" component={ImagesPage} />
          <Route path="/sign-in" component={SignInPage} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
    <Toaster />
  </React.StrictMode>
);
