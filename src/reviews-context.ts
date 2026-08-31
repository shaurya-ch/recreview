import { useOutletContext } from "react-router";
import { type ReviewContextType } from "@/App.tsx";

export function useReviewContext() {
  return useOutletContext<ReviewContextType>();
}
