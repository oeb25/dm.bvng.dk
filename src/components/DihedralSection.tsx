import * as React from "react";
import { d2s, reduceDihedral, parseDihedral } from "~data";
import { Section } from "./Section";
import { Code } from "./Code";

export const DihedralSection = () => {
  const [sidesText, setSidesText] = React.useState("5");
  const [src, setSrc] = React.useState("r-4 s3 r r^25");
  const sides = parseInt(sidesText) || 1;

  return (
    <Section
      title="Dihedral group"
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
          value={src}
          onChange={e => setSrc(e.target.value)}
        />
        <input
          className="bg-gray-900 text-center p-2 rounded-t w-12"
          type="number"
          value={sidesText}
          onChange={e => setSidesText(e.target.value)}
        />
      </div>
      <div className="text-center text-gray-500 border border-t-0 p-2 select-all rounded-b mx-2">
        {d2s(reduceDihedral(parseDihedral(src.toLowerCase()), sides))}
      </div>
    </Section>
  );
};
