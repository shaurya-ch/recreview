import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import CreateReview from "@/CreateReview";
import SavedReviews from "@/SavedReviews";
import Home from "@/Home";

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
