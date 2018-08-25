import { configure } from "@storybook/react";

function loadStories() {
  require("./code-surfer.story.js");
  require("./scroller.story.js");
}

configure(loadStories, module);
