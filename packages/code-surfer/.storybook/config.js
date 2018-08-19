import { configure } from "@storybook/react";

function loadStories() {
  require("./story.js");
}

configure(loadStories, module);
