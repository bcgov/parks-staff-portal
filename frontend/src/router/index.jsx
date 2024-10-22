import { createBrowserRouter } from "react-router-dom";
import ApiTest from "./pages/ApiTest";
import EditAndReview from "./pages/EditAndReview";
import PublishPage from "./pages/PublishPage";
import ExportPage from "./pages/ExportPage";
import PageDetails from "./pages/PageDetails";
import SubmitDates from "./pages/SubmitDates";
import MainLayout from "./layouts/MainLayout";
import LandingPageTabs from "./layouts/LandingPageTabs";
import ErrorPage from "./pages/Error";
import ProtectedRoute from "./ProtectedRoute";

const RouterConfig = createBrowserRouter(
  [
    {
      path: "/",
      // Protect the entire app with the AuthProvider
      element: <ProtectedRoute component={MainLayout} />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          // Tabbed navigation for the landing page
          element: <LandingPageTabs />,
          children: [
            // Edit & Review table / landing page
            {
              path: "",
              element: <EditAndReview />,
            },
            // Export
            {
              path: "export",
              element: <ExportPage />,
            },
            // Publish
            {
              path: "publish",
              element: <PublishPage />,
            },
          ],
        },

        // API endpoint test page
        {
          path: "/test",
          element: <ApiTest />,
        },

        // view park details
        {
          path: "/park/:parkId",
          element: <PageDetails />,
        },

        // edit/submit dates for a season
        {
          path: "/park/:parkId/edit/:seasonId",
          element: <SubmitDates />,
        },

        // review changes
        {
          path: "/park/:parkId/edit/:seasonId/review",
          element: <div>Review changes page</div>,
        },
      ],
    },
  ],
  { basename: "/v2/" },
);

export default RouterConfig;
