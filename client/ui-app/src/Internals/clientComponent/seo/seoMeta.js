import React from "react";
import { Helmet } from "react-helmet-async";

const SeoMeta = ({ seoData, fallback }) => {
  if (!seoData && !fallback) return null;

  const meta = seoData ?? fallback;

  return (
    <Helmet>

      <title key="title">{meta.title}</title>

      <meta
        key="description"
        name="description"
        content={meta.description}
      />

      {meta.keywords && (
        <meta
          key="keywords"
          name="keywords"
          content={meta.keywords}
        />
      )}

      <meta
        key="robots"
        name="robots"
        content={meta.robots || "index, follow"}
      />

      {meta.canonical && (
        <link
          key="canonical"
          rel="canonical"
          href={meta.canonical}
        />
      )}

      <meta key="author" name="author" content="Massclick" />
      <meta key="publisher" name="publisher" content="Massclick" />

      <meta key="language" httpEquiv="content-language" content="en" />
      <meta key="charset" charSet="utf-8" />
    </Helmet>
  );
};

export default SeoMeta;
