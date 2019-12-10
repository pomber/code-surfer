// @ts-check

const reqs = require.context(".", true, /\.story\.js$/, "sync");
reqs.keys().forEach(filename => reqs(filename));
