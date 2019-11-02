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
  if (n <= 0) {
    return d;
  }

  let complete = false;

  while (!complete) {
    complete = true;

    d = d
      .map(([t, m]) => {
        const k = t == "r" ? n : 2;
        // TODO: Do this in constant time
        while (m < 0) {
          m += k;
        }
        return [t, m % k] as Op;
      })
      .filter(([_, m]) => m);

    // NOTE: Fold r's and s's
    let i = 0;
    while (i < d.length - 1) {
      let a = d[i],
        b = d[i + 1];
      if (a[0] == b[0]) {
        d.splice(i, 1);

        const k = a[0] == "r" ? n : 2;
        d[i][1] = (d[i][1] + a[1]) % k;
        if (d[i][1] == 0) {
          d.splice(i, 1);
        }
      } else {
        i += 1;
      }
    }

    // NOTE: Flip sr -> r-1 s
    i = 0;
    while (i < d.length - 1) {
      let a = d[i],
        b = d[i + 1];
      if (a[0] == "s" && b[0] == "r") {
        let m = -b[1];

        // TODO: Do on constant time
        while (m < 0) {
          m += n;
        }
        d[i] = ["r", m % n];
        d[i + 1] = ["s", 1];
        if (d[i][1] == 0) {
          d.splice(i, 1);
        }
        complete = false;
        break;
      } else {
        i += 1;
      }
    }
  }

  return d;
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
