import React from "react";
import { storiesOf } from "@storybook/react";
import * as Scroller from "../src/scroller";

const ScrollerDemo = ({ n, selected, height }) => {
  const elements = [...Array(n).keys()];
  const isSelected = i => selected.includes(i);
  return (
    <div style={{ height: height || "100px" }}>
      <Scroller.Container
        style={{ border: "1px solid #222", margin: "15px 0" }}
      >
        <Scroller.Content>
          {elements.map((element, i) => (
            <Scroller.Element
              key={i}
              selected={isSelected(i)}
              style={{ background: isSelected(i) && "lightblue" }}
            >
              {element}
            </Scroller.Element>
          ))}
        </Scroller.Content>
      </Scroller.Container>
    </div>
  );
};

storiesOf("Scroller", module).add("static", () => (
  <div>
    <ScrollerDemo n={3} selected={[1]} />
    <ScrollerDemo n={20} selected={[9, 10]} />
    <ScrollerDemo n={20} selected={[10, 15]} />
    <ScrollerDemo n={20} selected={[1, 18]} />
  </div>
));
