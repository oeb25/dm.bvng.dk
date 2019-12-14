/* PERMUTATIONS */

export type Cycle = number[];

export type Permutation = Cycle[];

export const mapCycle = (a: number, c: Cycle) => {
  const i = c.indexOf(a);
  return i == -1 ? a : c[(i + 1) % c.length];
};

export const mapPermutation = (a: number, p: Permutation) =>
  p.reduceRight((b, c) => mapCycle(b, c), a);

export const maxInCycle = (c: Cycle) => Math.max(...c);
export const maxInPermutation = (p: Permutation) =>
  Math.max(...p.map(maxInCycle));

export const range = (a: number, b: number) => {
  const xs = [];
  for (let i = a; i < b; i++) xs.push(i);
  return xs;
};

export const reducePermutation = (p: Permutation) => {
  const taken = new Set();

  const p2 = [];

  for (let i = 1; i <= maxInPermutation(p); i++) {
    if (taken.has(i)) continue;
    taken.add(i);
    const c = [i];
    let j = i;
    for (;;) {
      j = mapPermutation(j, p);
      if (c.indexOf(j) != -1) break;

      taken.add(j);
      c.push(j);
    }
    if (c.length > 1) p2.push(c);
  }
  return p2;
};

export const concatPermutations = (p1: Permutation, p2: Permutation) =>
  p1.concat(p2);

export const c2s = (c: Cycle) => `(${c.join(" ")})`;
export const p2s = (p: Permutation) =>
  p.length == 0 ? "id" : p.map(c2s).join("");

export const parsePermutation = (src: string) =>
  src
    .split(/[\(\)\-]/g)
    .filter(x => x.trim())
    .map(x => x.split(/[ ,.]+/g))
    .map(xs => xs.filter(x => x.trim()).map(x => parseInt(x)));

/* DIHEDRAL GROUPS */

export type Op = ["r" | "s", number];

export type Dihedral = Op[];

export const reduceDihedral = (d: Dihedral, n: number): Dihedral => {
  let [r, s] = d.reduceRight(
    ([r, s], [t, n]) => {
      return t == "r" ? [r + n, s] : [n % 2 == 0 ? r : -r, s + n];
    },
    [0, 0]
  );

  const p: Dihedral = [];
  if (r < 0) {
    r += n * Math.ceil(-r / n);
  }
  if (s < 0) {
    s += 2 * Math.ceil(-s / 2);
  }
  r = r % n;
  s = s % 2;
  if (r > 0) p.push(["r", r]);
  if (s > 0) p.push(["s", s]);

  return p;
};

export const parseDihedral = (src: string): Dihedral =>
  (src.match(/([sr]\^?\(?-?\d*\)?)/g) || []).map(x => {
    const t = x[0] as "r" | "s";
    const s = x.substring(1).replace(/[\^\(\)]/g, "");
    const n = parseInt((s == "-" ? "-1" : s) || "1");
    return [t, n];
  });

export const d2s = (d: Dihedral) => {
  d = d.filter(x => x[1]);
  return d.length == 0
    ? "id"
    : d.map(x => (x[1] == 1 ? x[0] : x[0] + x[1])).join(" ");
};

/* POLYNOMIAL */

export type Poly = number[];

export const coef = (a: Poly, i: number) => (a.length <= i ? 0 : a[i]);

export const mulC = (a: Poly, n: number) => a.map(x => x * n);
export const add = (a: Poly, b: Poly): Poly =>
  a.length < b.length ? add(b, a) : a.map((x, i) => x + coef(b, i));
export const sub = (a: Poly, b: Poly): Poly => add(a, mulC(b, -1));
export const mulX = (a: Poly) => [0, ...a];
export const mul = (xs: Poly, ys: Poly): Poly =>
  xs.length == 0 || ys.length == 0
    ? []
    : add(mulC(ys, xs[0]), mulX(mul(xs.slice(1), ys)));
export const mod = (a: Poly, b: number) => a.map(x => x % b);
export const mulMod = (xs: Poly, ys: Poly, base: number): Poly =>
  mod(mul(xs, ys), base);
export const isZero = (a: Poly) => a.length == 0 || a.every(x => x == 0);
export const degree = (a: Poly) => {
  for (let i = a.length - 1; i > 0; i--) {
    if (a[i] != 0) return i;
  }
  return 0;
};
export const polyEq = (a: Poly, b: Poly): boolean =>
  degree(a) == degree(b) &&
  simplify(a).reduce((ok, x, i) => ok && x == b[i], true as boolean);
export const invMod = (a: Poly, base: number) =>
  a.map(f => (f ? (base - f) % base : 0)) as Poly;
export const simplify = (a: Poly) => a.slice(0, degree(a));

export const polyMod = (a: Poly, b: Poly, base: number): Poly => {
  let degA = degree(a);
  const degB = degree(b);
  let i = 10;
  while (degA >= degB && i-- != 0) {
    if (i <= 0) throw "faaak";
    const delta = degA - degB;
    const q = new Array(delta).fill(0).concat(b);

    a = mod(add(a, q), base);
    degA = degree(a);
    // const deltaDegree = degA - degB;
    // const m = new Array(deltaDegree).fill(0).concat(b);
    // const r = coef(m, degA);
    // const s = coef(a, degA);

    // // solve r * q + s = 0 mod base

    // let i;
    // for (i = 1; i < base; i++) {
    //   if ((r * i + s) % base == 0) break;
    // }

    // if (i == base) {
    //   // TODO: WRONG
    //   throw "fuck";
    // }

    // const p = new Array(deltaDegree).fill(0).concat([i]);
    // return mod(add(a, invMod(mul(p, b), base)), base);
  }
  return a;
};

export const order = (a: Poly, g: Poly, base: number) => {
  const samps = [];

  samps.push(a);

  let next = polyMod(mul(a, a), g, base);

  let i = 20;

  while (!polyEq(a, next) && i-- > 0) {
    samps.push(next);
    next = polyMod(mul(a, next), g, base);
  }

  return samps;
};

export const applyPoly = (a: Poly, n: number) =>
  a.map((f, i) => f * Math.pow(n, i)).reduce((a, b) => a + b, 0);

export const findRoots = (a: Poly, base: number): number[] => {
  const roots = [];
  for (let i = 0; i < base; i++) {
    if (applyPoly(a, i) % base == 0) roots.push(i);
  }
  return roots;
};

export const fmtPoly = (a: Poly) =>
  isZero(a)
    ? "0"
    : [...a]
        .reverse()
        .map((n, j) => {
          const i = a.length - j - 1;
          return n == 1 && i >= 1
            ? `x^${i}`
            : n == 0
            ? ""
            : i == 1
            ? `${n}x`
            : i == 0
            ? n + ""
            : `${n}x^${i}`;
        })
        .filter(a => a)
        .join(" + ")
        .replace(/\^1(\s*)/, "$1");

export const parsePoly = (src: string) => {
  const parts = src
    .replace(/\s+/g, "")
    .replace(/\^/g, "")
    .replace(/\*/g, "")
    .split(/\s*\+\s*/g)
    .map(s => /(\d*)(x?)(\d*)/g.exec(s))
    .filter(a => a);

  let p: Poly = [];

  for (const part of parts as RegExpExecArray[]) {
    const coef = part[1] ? parseInt(part[1], 10) : 1;
    const x = part[2];
    const power = part[3] ? parseInt(part[3], 10) : x ? 1 : 0;

    const q = new Array(power).fill(0);
    q[power] = coef;
    p = add(p, q);
  }

  return p;
};

export type EuclidRow = [Poly, Poly, Poly];
export type Euclid = [EuclidRow, EuclidRow];

export const swap = (e: Euclid): Euclid => [e[1], e[0]];
export const rowOp = (e: Euclid, n: Poly): Euclid => [
  e[0].map((r, i) => add(r, mul(n, e[1][i]))) as EuclidRow,
  e[1]
];
export const modEuclid = (e: Euclid, base: number) =>
  e.map(r => r.map(p => mod(p, base))) as Euclid;

export const fmtEuclid = (e: Euclid) =>
  e.map(r => r.map(fmtPoly).join(" | ")).join("\n");

const p1 = (e: Euclid) => e[0][0];
const p2 = (e: Euclid) => e[1][0];

export const euclidieanAlgo = (a: Poly, b: Poly, base: number) => {
  const one: Poly = [1];
  const zero: Poly = [];
  let e: Euclid = [
    [a, one, zero],
    [b, zero, one]
  ];

  let iter = 15;

  const steps = [e];

  let flipped = false;

  while (!isZero(e[0][0]) && iter-- > 0) {
    const degA = degree(p1(e));
    const degB = degree(p2(e));
    if (degA >= degB) {
      const deltaDegree = degA - degB;
      const m = new Array(deltaDegree).fill(0).concat(p2(e));
      const r = coef(m, degA);
      const s = coef(p1(e), degA);

      // solve r * q + s = 0 mod base

      let i;
      for (i = 1; i < base; i++) {
        if ((r * i + s) % base == 0) break;
      }

      if (i == base) {
        // TODO: WRONG
        throw "fuck";
      }

      const p = new Array(deltaDegree).fill(0).concat([i]);
      e = modEuclid(rowOp(e, p), base);
    } else {
      flipped = !flipped;
      e = swap(e);
    }
    steps.push(e);
  }

  const result = invMod(steps[steps.length - 1][flipped ? 1 : 0][2], base);

  return { steps, result };
};

export const divPoly = (a: Poly, b: Poly, base: number) => {
  try {
    return euclidieanAlgo(a, b, base).result;
  } catch (e) {
    return null;
  }
};

export const irreducable = (a: Poly, base: number) => {
  const roots = findRoots(a, base);
  const parts = [];
  for (const root of roots) {
    const r = [(base - root) % base, 1] as Poly;
    parts.push(r);
    parts.push(divPoly(a, r, base)!);
  }
  return parts;
};
