import { buttonVariants } from "@/components/ui/button";

function Home() {
  return (
    <div className="h-full flex flex-col gap-2 justify-center items-center">
      <div className="text-3xl font-extrabold font-mono">recreview</div>
      <div className="flex flex-row gap-2">
        <a href="/create" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Create Review
        </a>
        <a href="/saved" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Saved Reviews
        </a>
      </div>
    </div>
  );
}

export default Home;
