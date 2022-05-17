import React, { useState } from "react";
import { TokenAnnotator, TextAnnotator } from "react-text-annotate";

function Annotator(props) {

    const i = [
        {
          start: 19,
          end: 22,
          tokens: ["that", "mean", "the"],
          color: "#84d2ff",
        },
        {
          start: 5,
          end: 12,
          tokens: [
            "Belimumab",
            "expiration",
            "date.",
            "It",
            "stated",
            "as",
            "'03/2022'",
          ],
          color: "#84d2ff",
        },
      ]
  const [state, setState] = useState(props.content.annotation||[]);
  const [content, setContent] = useState(props.content.text||'');


  const handleChange = (value) => {
    setState(value);
  };

  return (
    <>
      <TokenAnnotator
        style={{
          fontFamily: "IBM Plex Sans",
          maxWidth: 500,
          lineHeight: 1.5,
        }}
        tokens={content.split(" ")}
        value={state}
        onChange={handleChange}
        getSpan={(span) => ({
          ...span,
          // tag: this.state.tag,
          color: "#84d2ff",
        })}
      />
    {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </>
  );
}

export default Annotator;
