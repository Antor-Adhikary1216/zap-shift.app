import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";

import { RouterProvider } from "react-router";
import { router } from "./Routes/Route.jsx";

import AuthProvider from "./Context/AuthContext/AuthProvider/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalLoadingOverlay from "./Components/LoadingIndicator/GlobalLoadingOverlay.jsx";
import "./Utilities/configureGlobalAxiosLoading.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalLoadingOverlay />
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
