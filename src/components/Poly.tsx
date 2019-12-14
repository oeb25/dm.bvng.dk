import * as React from "react";
import { Poly, fmtPoly, simplify, degree } from "~data";

export const PolyF: React.FC<{ p: Poly }> = ({ p }) => {
  return (
    <span>
      {degree(p) == 0
        ? p[0]
        : p
            .map((f, i) => {
              if (f == 0) {
                return null;
              }
              if (i == 0) {
                return <span key={i}>{f}</span>;
              }
              if (i == 1) {
                return <span key={i}>{f > 1 ? f : ""}x</span>;
              }
              if (f == 1) {
                return (
                  <span key={i}>
                    x<sup>{i}</sup>
                  </span>
                );
              }
              return (
                <span key={i}>
                  {f}x<sup>{i}</sup>
                </span>
              );
            })
            .filter(a => a)
            .reduce((a, b) => (
              <>
                {a} + {b}
              </>
            ))}
    </span>
  );
};
