import * as React from "react";
import {
  reducePermutation,
  Permutation,
  p2s,
  parsePermutation,
  range,
  mapPermutation
} from "~data";
import { Section } from "./Section";
import { Code } from "./Code";

export const HomomorphismSection = () => {
  const [sidesText, setSidesText] = React.useState("6");
  const [xText, setXText] = React.useState("1");
  const [snText, setSnText] = React.useState("6");
  const [doSort, setDoSort] = React.useState(false);
  const [src, setSrc] = React.useState("(3 4 5)");
  const sides = parseInt(sidesText) || 1;
  const x = parseInt(xText) || 1;
  const sn = parseInt(snText) || 1;

  const s = parsePermutation(src);

  const computed = range(0, sides - 1).reduce<[number, Permutation][]>(
    (acc, p) => [
      ...acc,
      [(acc[p][0] + x) % sides, acc[p][1].concat(s) as Permutation]
    ],
    [[x, s]]
  );
  const result = doSort ? computed.sort((a, b) => a[0] - b[0]) : computed;
  const fixed = result.map(
    ([_, p]) => range(1, sn).filter(n => mapPermutation(n, p) == n).length
  );

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
          Computes all the permutations given by the homomorphism, starting with
          the given base case. The syntax is inherited by the permutations. On
          the left is the <Code>Z mod n</Code> base case, followed by the
          permutation, lastly the <Code>n</Code> in{" "}
          <Code>
            S<sub>n</sub>
          </Code>
          . In the right most column is the number of fixed elements in the
          given permutation. The last row contains Burnsides Lemma, computing
          the number of orbits, found in the center column.
        </>
      }
    >
      <div className="text-center text-gray-200 border flex rounded-t mx-2">
        <div className="text-center p-2 w-32 flex items-center">
          φ(
          <input
            className="bg-gray-900 text-center w-8"
            type="number"
            value={xText}
            onChange={e => setXText(e.target.value)}
          />
          <span className="text-xs">mod</span>
          <input
            className="bg-gray-900 text-center w-8"
            type="number"
            value={sidesText}
            onChange={e => setSidesText(e.target.value)}
          />
          )=
        </div>
        <div className="flex-1">
          <input
            className="bg-gray-900 text-center p-2 w-full"
            type="text"
            value={src}
            onChange={e => setSrc(e.target.value)}
          />
        </div>
        <input
          className="bg-gray-900 text-center p-2 w-32 text-right pr-4"
          type="number"
          value={snText}
          onChange={e => setSnText(e.target.value)}
        />
      </div>
      <div className="text-center text-gray-500 border border-t-0 p-2 mx-2 flex justify-start">
        <label className="cursor-pointer select-none">
          Sort{" "}
          <input
            className="bg-gray-900 cursor-pointer"
            type="checkbox"
            checked={doSort}
            onChange={e => setDoSort(e.target.checked)}
          />
        </label>
        <div className="flex-1"></div>
        <div># of fixed</div>
      </div>
      <div className="text-center text-gray-500 border border-t-0 p-2 mx-2 flex flex-col relative">
        {result.map(([n, p], i) => (
          <div className="flex" key={i}>
            <div className="text-center p-2 w-20 flex">φ({n})=</div>
            <div className="text-center p-2 flex-1 select-all">
              {p2s(reducePermutation(p))}
            </div>
            <div className="text-center p-2 w-20 text-right pr-4">
              #{fixed[i]}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center border border-t-0 p-2 rounded-b mx-2 flex flex relative">
        <div className="text-center p-2 w-64 flex">Burnsides Lemma</div>
        <div className="text-center p-2 flex-1">
          {fixed.reduce((a, b) => a + b, 0) / sides}
        </div>
        <div className="text-center p-2 w-64 text-right pr-4">
          #{fixed.reduce((a, b) => a + b, 0)}
        </div>
      </div>
    </Section>
  );
};
