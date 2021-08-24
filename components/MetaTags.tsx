import Head from "next/head";

export default function MetaTags({
  title = "Nextfire Blog",
  description = "Blogging website demo built with Next.js + Firebase",
  image = "https://assets.vercel.com/image/upload/v1607554385/repositories/next-js/next-logo.png/",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="noindex" />
      <meta name="twitter:card" content="summary" />
      {/*<meta name="twitter:site" content="@tag" />*/}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
