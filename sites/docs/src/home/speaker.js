import React from "react";
import s0 from "./speakers/0.png";
import s1 from "./speakers/1.png";
import s2 from "./speakers/2.png";
import s3 from "./speakers/3.png";
import s4 from "./speakers/4.png";
import s5 from "./speakers/5.png";
import s6 from "./speakers/6.png";
import s7 from "./speakers/7.png";
import s8 from "./speakers/8.png";
import s9 from "./speakers/9.png";

const speakers = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];

const speaker = speakers[Math.floor(Math.random() * speakers.length)];

export default () => (
  <img src={speaker} alt="speaker" style={{ width: "100%", height: "auto" }} />
);
