import { buttonVariants } from "@/components/ui/button";

function Home() {
  return (
    <>
      <div>Hiiii :3</div>
      <div>
        <a href="/create" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Create Review
        </a>
        <a href="/saved" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Saved Reviews
        </a>
      </div>
    </>
  );
}

export default Home;
