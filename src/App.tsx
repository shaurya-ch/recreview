import { useState, type Dispatch, type SetStateAction } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/toast";

export type Review = {
  releaseGroupId: string;
  releaseGroupTitle: string;
  releaseGroupArtist: string;
  rating: number;
  remarks: string;
};

export type ReviewContextType = [reviews: Review[], setReviews: Dispatch<SetStateAction<Review[]>>];

function App() {
  const getInitialReviews = () => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      return JSON.parse(storedReviews);
    } else {
      return [];
    }
  };
  const [reviews, setReviews] = useState<Review[]>(getInitialReviews);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <main className="h-dvh flex flex-col">
          <div className="flex-1">
            <Outlet context={[reviews, setReviews] satisfies ReviewContextType} />
          </div>
          <footer className="text-center font-mono text-gray-600 text-xs">
            Made with ❤ by Shaurya Chaturvedi
          </footer>
        </main>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
