import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import CreateReview from "@/pages/CreateReview";
import SavedReviews from "@/pages/SavedReviews";
import Home from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreateReview },
      { path: "saved", Component: SavedReviews },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
