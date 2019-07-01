import React from "react";
import { storiesOf } from "@storybook/react";
import { Button } from "@storybook/react/demo";
import { Component as CodeSurfer } from "code-surfer/dist/standalone.esm";

storiesOf("Button", module)
  .add("with text", () => <Button>Hello Button</Button>)
  .add("code surfer", () => <CodeSurfer />);
