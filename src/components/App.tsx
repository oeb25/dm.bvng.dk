import * as React from "react";

import {
  reducePermutation,
  Permutation,
  p2s,
  parsePermutation,
  d2s,
  reduceDihedral,
  parseDihedral,
  range
} from "../data";

const Code: React.FC = ({ children }) => (
  <code className="bg-gray-800">{children}</code>
);

const Section: React.FC<{
  title: React.ReactNode;
  description: JSX.Element;
}> = ({ title, description, children }) => {
  const [showInfo, setShowInfo] = React.useState(true);
  return (
    <section className="flex flex-col mt-3">
      <div className="border-b flex items-baseline">
        <h3 className="text-xl flex-1">{title}</h3>
        <a
          className="text-gray-600 underline hover:text-gray-400"
          href="#"
          onClick={e => {
            e.preventDefault();
            setShowInfo(!showInfo);
          }}
        >
          {showInfo ? "Hide" : "Show"} info
        </a>
      </div>
      {showInfo ? <p className="text-gray-500 mx-2">{description}</p> : null}
      <div className="flex flex-col mt-6">{children}</div>
    </section>
  );
};

const PermutationSection = () => {
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
        className="text-center bg-gray-900 text-gray-200 border p-2 shadow-xl rounded-t mx-2"
        type="text"
        value={src}
        onChange={e => setSrc(e.target.value)}
      />
      <div className="text-center bg-gray-900 text-gray-500 border border-t-0 p-2 shadow-xl select-all rounded-b mx-2">
        {p2s(reducePermutation(parsePermutation(src)))}
      </div>
    </Section>
  );
};

const DihedralSection = () => {
  const [sidesText, setSidesText] = React.useState("5");
  const [src, setSrc] = React.useState("r-4 s3 r r^25");
  const sides = parseInt(sidesText) || 1;

  return (
    <Section
      title="Dihedral group"
      description={
        <>
          Reduce dihedrals to their smallest form. Type out operation (
          <Code>r</Code>, <Code>s</Code>), followed by their number of
          applications. Adjust the number of sides of the <Code>n</Code>-gon on
          the right. Most operators are optional, including parenthesis and{" "}
          <Code>^</Code>. Ex: <Code>r-4 s3 r r^25</Code>
        </>
      }
    >
      <div className="text-center text-gray-200 border flex shadow-xl rounded-t mx-2">
        <input
          className="text-center pl-12 bg-gray-900 p-2 flex-1 shadow-xl rounded-t"
          type="text"
          value={src}
          onChange={e => setSrc(e.target.value)}
        />
        <input
          className="text-center bg-gray-900 p-2 shadow-xl rounded-t w-12"
          type="number"
          value={sidesText}
          onChange={e => setSidesText(e.target.value)}
        />
      </div>
      <div className="text-center bg-gray-900 text-gray-500 border border-t-0 p-2 shadow-xl select-all rounded-b mx-2">
        {d2s(reduceDihedral(parseDihedral(src.toLowerCase()), sides))}
      </div>
    </Section>
  );
};

const HomomorphismSection = () => {
  const [sidesText, setSidesText] = React.useState("5");
  const [xText, setXText] = React.useState("3");
  const [src, setSrc] = React.useState("(1 3 5 7 9)");
  const sides = parseInt(sidesText) || 1;
  const x = parseInt(xText) || 1;

  const s = parsePermutation(src);

  return (
    <Section
      title={
        <>
          Homomorphism of <Code>Z mod n</Code> to{" "}
          <Code>
            S<sub>n</sub>
          </Code>
        </>
      }
      description={
        <>
          Computes all the groups given by the homomorphism, starting with the
          given base case. The syntax is inherited by the permutations.
        </>
      }
    >
      <div className="text-center text-gray-200 border flex shadow-xl rounded-t mx-2">
        <div className="text-center bg-gray-900 p-2 shadow-xl rounded-t w-20 flex">
          y(
          <input
            className="text-center bg-gray-900 w-8"
            type="number"
            value={xText}
            onChange={e => setXText(e.target.value)}
          />
          )=
        </div>
        <input
          className="text-center bg-gray-900 p-2 flex-1 shadow-xl rounded-t"
          type="text"
          value={src}
          onChange={e => setSrc(e.target.value)}
        />
        <input
          className="text-center bg-gray-900 p-2 shadow-xl rounded-t w-20"
          type="number"
          value={sidesText}
          onChange={e => setSidesText(e.target.value)}
        />
      </div>
      <div className="text-center bg-gray-900 text-gray-500 border border-t-0 p-2 shadow-xl select-all rounded-b mx-2 flex flex-col">
        {range(0, sides - 1)
          .reduce((acc, p) => [...acc, acc[p].concat(s)], [s])
          .map((p, n) => (
            <div className="flex" key={n}>
              <div className="text-center bg-gray-900 p-2 shadow-xl rounded-t w-20 flex">
                y({(x * (n + 1)) % sides})=
              </div>
              <div className="text-center bg-gray-900 p-2 flex-1 shadow-xl rounded-t pr-20 mr-2">
                {p2s(reducePermutation(p))}
              </div>
            </div>
          ))}
      </div>
    </Section>
  );
};

export const App = () => {
  return (
    <div className="max-w-lg w-screen min-h-screen flex flex-col mx-auto pb-3">
      <header className="py-6">
        <h1 className="text-4xl text-center font-thin">
          Tools for discrete mathematics
        </h1>
        <p className="italic text-gray-500 mx-6">
          A collection of small tools to ease the manual labor, so you can focus
          on the important parts.
        </p>
      </header>

      <div className="flex flex-col flex-1">
        <PermutationSection />
        <DihedralSection />
        <HomomorphismSection />
      </div>

      <div className="bg-gray-900 text-gray-600 pt-6 flex items-center justify-center">
        <p>
          Created by{" "}
          <a
            href="https://github.com/oeb25"
            target="_blank"
            className="underline hover:text-gray-400"
          >
            Oliver Bøving
          </a>
        </p>
        <a
          className="absolute right-0 mr-4 hover:text-gray-400"
          target="_blank"
          href="https://github.com/oeb25/dm.bvng.dk"
        >
          <GitHubLogo />
        </a>
      </div>
    </div>
  );
};

const GitHubLogo = () => (
  <svg
    height="32"
    viewBox="0 0 16 16"
    version="1.1"
    width="32"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    ></path>
  </svg>
);
