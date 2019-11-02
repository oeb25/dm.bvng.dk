import * as React from "react";
import { Section } from "./Section";
import { Code } from "./Code";
import { p2s, reducePermutation, parsePermutation } from "~data";

export const PermutationSection = () => {
  const [src, setSrc] = React.useState("(1 2 3)(4 5)(3 6)");

  return (
    <Section
      title="Permutations"
      description={
        <>
          Reduce permutations to their smallest form. Seperate entries by{" "}
          <Code>.</Code>, <Code>,</Code> or <Code>spaces</Code>, and cycles by{" "}
          <Code>)</Code>, <Code>(</Code> or <Code>-</Code>.
        </>
      }
    >
      <input
        className="bg-gray-900 text-center text-gray-200 border p-2 rounded-t mx-2"
        type="text"
        value={src}
        onChange={e => setSrc(e.target.value)}
      />
      <div className="text-center text-gray-500 border border-t-0 p-2 select-all rounded-b mx-2">
        {p2s(reducePermutation(parsePermutation(src)))}
      </div>
    </Section>
  );
};
