import * as React from "react";
import {
  d2s,
  reduceDihedral,
  parseDihedral,
  parsePoly,
  euclidieanAlgo,
  fmtEuclid,
  fmtPoly,
  irreducable
} from "~data";
import { Section } from "./Section";
import { Code } from "./Code";
import { PolyF } from "./Poly";

export const PolyIrre = () => {
  const [sidesText, setSidesText] = React.useState("5");
  const sides = Math.max(parseInt(sidesText) || 2, 2);

  const [p1Src, setP1] = React.useState("x^3");
  const p1 = parsePoly(p1Src);

  return (
    <Section
      title="Irreducable Polynimial"
      description={
        <>
          Reduce dihedrals to their smallest form. Syntax is type of operation (
          <Code>r</Code>, <Code>s</Code>), followed by their number of
          applications. Adjust the number of sides of the <Code>n</Code>-gon on
          the right. Most operators are optional, including parenthesis and{" "}
          <Code>^</Code>. Ex: <Code>r(-4) s3 r r^2 = r-4 s3 r r2</Code>
        </>
      }
    >
      <div className="text-center text-gray-200 border flex rounded-t mx-2">
        <input
          className="bg-gray-900 text-center pl-12 p-2 flex-1 rounded-t"
          type="text"
          value={p1Src}
          onChange={e => setP1(e.target.value)}
        />
        <input
          className="bg-gray-900 text-center p-2 rounded-t w-12"
          type="number"
          value={sidesText}
          onChange={e => setSidesText(e.target.value)}
        />
      </div>
      <div className="text-center text-gray-500 border border-t-0 p-2 select-all rounded-b mx-2">
        (
        {irreducable(p1, sides)
          .map(a => <PolyF p={a} />)
          .reduce((a, b) => (
            <>
              {a})({b}
            </>
          ))}
        )
      </div>
    </Section>
  );
};
