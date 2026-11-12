import { random } from "remotion";

// Cada antena es un "ADN": lista de instrucciones de tortuga 3D (avanza, gira en horizontal, gira en vertical)
export type Gen = { readonly largo: number; readonly giro: number; readonly inclina: number };
export type P3 = [number, number, number];

// Brazo de la antena ganadora (forma inspirada en la ST5 evolucionada de la NASA)
export const GANADORA: Gen[] = [
  { largo: 26, giro: 0, inclina: 0 },
  { largo: 20, giro: 70, inclina: 55 },
  { largo: 24, giro: -115, inclina: -20 },
  { largo: 16, giro: 150, inclina: 45 },
  { largo: 22, giro: -70, inclina: -60 },
  { largo: 14, giro: 95, inclina: 35 },
  { largo: 12, giro: -40, inclina: -25 },
];

export const genAleatorio = (semilla: string, n = 6): Gen[] =>
  new Array(n).fill(0).map((_, k) => ({
    largo: 10 + random(`${semilla}-l${k}`) * 22,
    giro: k === 0 ? 0 : (random(`${semilla}-g${k}`) - 0.5) * 300,
    inclina: k === 0 ? 0 : (random(`${semilla}-i${k}`) - 0.5) * 160,
  }));

// Mezcla dos ADN (los primeros genes de A, el resto de B) y muta uno
export const cruzar = (a: Gen[], b: Gen[], corte: number, mutado: number, cuanto: number): Gen[] =>
  a.map((g, k) => {
    const base = k < corte ? g : b[k] ?? g;
    return k === mutado ? { ...base, giro: base.giro + cuanto, inclina: base.inclina - cuanto * 0.5 } : base;
  });

// Construye los puntos 3D de un brazo a partir del ADN (z hacia arriba)
export const puntosBrazo = (genes: Gen[], pasos = genes.length): P3[] => {
  const pts: P3[] = [[0, 0, 0]];
  let az = 0;
  let el = 62; // los brazos salen inclinados hacia fuera, como en la antena real
  let [x, y, z] = [0, 0, 0];
  for (let k = 0; k < Math.min(pasos, genes.length); k++) {
    const g = genes[k];
    az += g.giro;
    el = Math.max(-60, Math.min(90, el + g.inclina));
    const a = (az * Math.PI) / 180;
    const e = (el * Math.PI) / 180;
    x += g.largo * Math.cos(e) * Math.cos(a);
    y += g.largo * Math.cos(e) * Math.sin(a);
    z += g.largo * Math.sin(e);
    pts.push([x, y, z]);
  }
  return pts;
};

// Proyección: gira alrededor del eje vertical (guiñada) y mira un poco desde arriba
export const proyectar = (p: P3, guinada: number, inclinacion = 0.35): [number, number] => {
  const c = Math.cos(guinada);
  const s = Math.sin(guinada);
  const x1 = p[0] * c - p[1] * s;
  const y1 = p[0] * s + p[1] * c;
  return [x1, -(p[2] * Math.cos(inclinacion)) + y1 * Math.sin(inclinacion)];
};
