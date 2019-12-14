import * as React from "react";
import {
  d2s,
  reduceDihedral,
  parseDihedral,
  parsePoly,
  euclidieanAlgo,
  fmtEuclid,
  fmtPoly,
  divPoly
} from "~data";
import { Section } from "./Section";
import { Code } from "./Code";
import { PolyF } from "./Poly";

export const PolyEuclid = () => {
  const [sidesText, setSidesText] = React.useState("5");
  const [src, setSrc] = React.useState("r-4 s3 r r^25");
  const sides = Math.max(parseInt(sidesText) || 2, 2);

  const [p1Src, setP1] = React.useState("x^3");
  const [p2Src, setP2] = React.useState("x + x^2");

  const p1 = parsePoly(p1Src);
  const p2 = parsePoly(p2Src);

  let e = null;
  try {
    e = euclidieanAlgo(p1, p2, sides);
  } catch (e) {}

  return (
    <Section
      title="Polynomial Euclid"
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
        <div className="text-center p-2 w-64 flex">/</div>
        <div className="text-center p-2 flex">
          <input
            className="bg-gray-900 text-center flex-1"
            type="text"
            value={p2Src}
            onChange={e => setP2(e.target.value)}
          />
        </div>
        <div className="text-center p-2 w-64 flex"></div>
      </div>
      <div className="text-center border border-t-0 p-2 text-gray-500 rounded-b mx-2 flex relative">
        <div className="text-center p-2 w-12 flex">=</div>
        <div className="text-center p-2 flex flex-1 justify-center">
          {e ? <PolyF p={divPoly(p1, p2, sides)!} /> : ""}
        </div>
        <div className="text-center p-2 w-12 flex"></div>
      </div>
      <div className="text-center text-gray-500 border border-t-0 p-2 rounded-b mx-2">
        {e
          ? e.steps.map((e, i) => (
              // <div key={i} className="border">
              //   {fmtEuclid(e)
              //     .split("\n")
              //     .map((a, i) => (
              //       <p key={i}>{a}</p>
              //     ))}
              // </div>
              <div key={i} className="border flex flex-col text-left p-2">
                {e.map((e, i) => (
                  <div className="flex" key={i}>
                    {e.map((r, i) => (
                      <div className="flex-1 select-all" key={i}>
                        <PolyF p={r} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          : "Can't be solved"}
      </div>
    </Section>
  );
};
