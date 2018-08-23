import React from "react";
import { storiesOf } from "@storybook/react";
import CodeSurfer from "../src/code-surfer";

const code = `<div>
  <span>Hi</span>
</div>`;

const code2 = `<Scroller.Container type="pre" height={100}>
<Scroller.Content type="code">
	{hightlightLines(code).map((line, index) => (
		<Scroller.Element
			key={index}
			dangerouslySetInnerHTML={{
				__html: line
			}}
			style={{ opacity: index + 1 in tokensPerLine ? 1 : 0.3 }}
		/>
	))}
</Scroller.Content>
</Scroller.Container>`;

storiesOf("CodeSurfer", module).add("test hi", () => (
  <div>
  <h1>Hi!</h1>
  <div style={{height: "100px"}}>
    <CodeSurfer code={code} step={{ lines: [1] }} />
    </div>
    <CodeSurfer code={code} step={{ lines: [1, 3] }} />
    <CodeSurfer
      code={code2}
      step={{ tokens: { 9: [1, 2, 3, 7, 8], 1: null } }}
    />
  </div>
));
