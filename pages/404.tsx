import Link from "next/link";

export default function Custom404Page() {
  return (
    <main className={"container py-4 flex justify-center"}>
      <div>
        <h1 className={"text-2xl"}>
          404 - That page does not seem to exist...
        </h1>
        <iframe
          src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
          width="480"
          height="362"
          frameBorder="0"
          allowFullScreen
          className={"my-4"}
        />
        <Link href="/">
          <button className={"btn btn-primary"}>Go home</button>
        </Link>
      </div>
    </main>
  );
}
