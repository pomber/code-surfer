import { configure } from "@storybook/react";

function loadStories() {
  require("./story.js");
  require("./scroller-stories.js");
}

configure(loadStories, module);
