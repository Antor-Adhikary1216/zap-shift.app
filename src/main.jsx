import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";

import { RouterProvider } from "react-router";
import { router } from "./Routes/Route.jsx";

import AuthProvider from "./Context/AuthContext/AuthProvider/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalLoadingOverlay from "./Components/LoadingIndicator/GlobalLoadingOverlay.jsx";
import FirstTimeFeatureGuide from "./Components/FirstTimeFeatureGuide/FirstTimeFeatureGuide.jsx";
import "./Utilities/configureGlobalAxiosLoading.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalLoadingOverlay />
        <FirstTimeFeatureGuide />
        <Suspense
          fallback={(
            <div className="flex min-h-screen items-center justify-center bg-[#F6F8F8] px-4" role="status" aria-live="polite">
              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-[#03373D] shadow-sm">
                <span className="loading loading-spinner loading-md" aria-hidden="true" />
                Loading page...
              </div>
            </div>
          )}
        >
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
