import App from "./app";
import React from "react";
import express from "express";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import inline from "glamor/inline";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  // .get("/oembed/*", (req, res) => {})
  .get("/*", (req, res) => {
    const markup = inline(renderToStaticMarkup(<App />));
    res.status(200).send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Code Surfer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="alternate" type="application/json+oembed"
          href="https://code-surfer.now.sh/oembed?url=${req.url}&format=json"
          title="Code Surfer oEmbed" />
        <link rel="alternate" type="text/xml+oembed"
          href="https://code-surfer.now.sh/oembed?url=${req.url}&format=xml"
          title="Code Surfer oEmbed" />
        <style>
          html, body, #root { 
            height: 100%;
            padding: 0;
            margin: 0;
          }
        </style>
        ${
          "" && assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          "" && process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
    );
  });

export default server;
