import * as React from "react";
import {
  d2s,
  reduceDihedral,
  parseDihedral,
  parsePoly,
  euclidieanAlgo,
  fmtEuclid,
  fmtPoly,
  divPoly,
  order
} from "~data";
import { Section } from "./Section";
import { Code } from "./Code";
import { PolyF } from "./Poly";

export const PolyOrder = () => {
  const [sidesText, setSidesText] = React.useState("2");
  const [src, setSrc] = React.useState("r-4 s3 r r^25");
  const sides = Math.max(parseInt(sidesText) || 2, 2);

  const [p1Src, setP1] = React.useState("x");
  const [p2Src, setP2] = React.useState("x^3 + 1");

  const p1 = parsePoly(p1Src);
  const p2 = parsePoly(p2Src);

  let o = null;
  try {
    o = order(p1, p2, sides);
  } catch (o) {}

  return (
    <Section
      title="Order of Polynomial"
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
      <div className="text-center border border-t-0 p-2 rounded-b mx-2 flex flex relative">
        <div className="text-center p-2 w-64 flex">&lt;</div>
        <div className="text-center p-2 flex">
          <input
            className="bg-gray-900 text-center flex-1"
            type="text"
            value={p2Src}
            onChange={e => setP2(e.target.value)}
          />
        </div>
        <div className="text-right justify-end p-2 w-64 flex">&gt;</div>
      </div>
      <div className="text-center text-gray-500 border border-t-0 p-2 rounded-b mx-2">
        {o
          ? o.map((a, i) => (
              <div className="flex" key={i}>
                <div className="text-center p-2 w-32 flex">
                  <span>
                    (<PolyF p={p1} />)<sup>{i + 1}</sup> =
                  </span>
                </div>
                <div className="text-center p-2 flex flex-1 justify-center">
                  <PolyF p={a} />
                </div>
                <div className="text-center p-2 w-32 flex"></div>
              </div>
            ))
          : "Not possible"}
      </div>
    </Section>
  );
};
