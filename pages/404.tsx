import Link from "next/link";

export default function Custom404Page() {
  return (
    <main className={"container flex justify-center"}>
      <div>
        <h1 className={"text-2xl"}>
          404 - That page does not seem to exist...
        </h1>
        <div
          className={"my-6"}
          style={{
            width: "100%",
            height: "0",
            paddingBottom: "75%",
            position: "relative",
          }}
        >
          <iframe
            src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
            width="100%"
            height="100%"
            style={{ position: "absolute" }}
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen
          />
        </div>
        <Link href="/">
          <button className={"btn btn-primary"}>Go home</button>
        </Link>
      </div>
    </main>
  );
}
