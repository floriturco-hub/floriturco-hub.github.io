import { Easing, interpolate } from "remotion";
import { CabezaPerfil } from "../components/CabezaPerfil";
import { Cara } from "../ojos/Piezas";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Marcador } from "../tunel/Piezas";
import { Anillo, Burbuja, Comida, Gas, Globo, Intestino, Molecula, Olor, SangrePulmones, VERDE_OLOR } from "./Piezas";

// Instantes clave (s) de public/audio/pedos/narracion.wav (voz x1,05), sacados con Whisper
export const T = {
  problema: 3.2,
  uno: 4.3,
  unPedo: 6.18,
  nitrogeno: 7.98,
  hidrogeno: 8.84,
  dioxido: 9.66,
  metano: 11.78,
  sinOlor: 12.92,
  deDonde: 14.28,
  aire: 15.32,
  otra: 18.58,
  bacterias: 19.84,
  frijoles: 23.94,
  malOlor: 25.68,
  azufre: 27.48,
  sulfuro: 28.72,
  huevo: 30.22,
  porEso: 32.12,
  ruido: 36.68,
  vibrar: 38.18,
  globo: 39.66,
  persona: 41.7,
  veces: 43.52,
  aguantas: 45.98,
  sale: 47.86,
  sangre: 49.0,
  exhalas: 50.38,
  asiQueSi: 52.04,
  aliento: 53.3,
  fin: 56.2,
};

const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

// A. Gancho: el 99 % no huele
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [0.15, 2.4], [0, 0.99], { ...clamp, easing: Easing.out(Easing.cubic) }) + (t > T.problema ? 0.01 : 0);
  const resalte = t > T.problema ? 0.5 + 0.5 * Math.sin((t - T.problema) * 8) : 0;
  return (
    <Lienzo zoom={interpolate(t, [0, T.unPedo], [1, 1.06])} cy={820}>
      <Anillo x={540} y={820} R={300} p={p} resalte={resalte} />
      {t > T.problema ? <Olor x={565} y={400} s={1.4} t={t} op={aparece(t, T.problema)} /> : null}
    </Lienzo>
  );
};

// B. De qué está hecho: gases sin olor
const LISTA: { gas: Gas; nombre: string; t: number }[] = [
  { gas: "N2", nombre: "nitrógeno", t: T.nitrogeno },
  { gas: "H2", nombre: "hidrógeno", t: T.hidrogeno },
  { gas: "CO2", nombre: "dióxido de carbono", t: T.dioxido },
  { gas: "CH4", nombre: "metano", t: T.metano },
];
export const Composicion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gases: Gas[] = [];
  const reparto: [Gas, number][] = [["N2", 5], ["H2", 3], ["CO2", 3], ["CH4", 2]];
  reparto.forEach(([g, n], k) => {
    if (t > LISTA[k].t) for (let i = 0; i < n; i++) gases.push(g);
  });
  const check = interpolate(t, [T.sinOlor + 0.2, T.sinOlor + 0.7], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.unPedo, T.deDonde], [1, 1.04])}>
      <Burbuja x={540} y={720} R={360} t={t} gases={gases} visibles={1} />
      {LISTA.map((l, k) => (
        <g key={l.gas} opacity={aparece(t, l.t)} transform={`translate(${k % 2 === 0 ? 300 : 780} ${1210 + Math.floor(k / 2) * 120})`}>
          <rect x={-220} y={-46} width={440} height={86} rx={43} fill={C.card} stroke={C.cyan} strokeWidth={3} />
          <Molecula gas={l.gas} x={-160} y={-3} s={0.62} />
          <text x={-100} y={10} fill={C.white} fontFamily={mono} fontSize={l.nombre.length > 12 ? 26 : 32} fontWeight={700}>
            {l.nombre}
          </text>
        </g>
      ))}
      <path d="M 860 380 L 890 412 L 950 344" stroke={C.cyan} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={130} strokeDashoffset={130 * (1 - check)} />
    </Lienzo>
  );
};

// C. De dónde sale: aire que tragas y bacterias que fermentan
export const Origen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const aire = aparece(t, T.aire);
  const boca: [number, number] = [870 * 0.55 + 60, 1060 * 0.55 - 250];
  return (
    <Lienzo zoom={interpolate(t, [T.deDonde, T.malOlor], [1, 1.04])}>
      <g opacity={aparece(t, T.deDonde)}>
        <CabezaPerfil x={60} y={-250} s={0.55} />
      </g>
      {aire > 0
        ? new Array(6).fill(0).map((_, k) => {
            const f = (t * 0.6 + k / 6) % 1;
            const bx = 960 - f * (960 - boca[0]);
            const by = boca[1] + Math.sin(f * 9 + k) * 18;
            return <circle key={k} cx={bx} cy={by} r={14} fill="none" stroke={C.cyan} strokeWidth={4} opacity={aire * Math.sin(f * Math.PI)} />;
          })
        : null}
      <text x={760} y={260} fill={C.cyan} fontFamily={mono} fontSize={30} fontWeight={700} opacity={aire}>aire</text>
      <g opacity={aparece(t, T.otra)}>
        <Intestino x={130} y={1020} w={820} t={t} burbujas={interpolate(t, [T.bacterias + 0.6, T.bacterias + 2], [0, 1], clamp)} />
        <text x={130} y={870} fill={C.grey} fontFamily={mono} fontSize={30}>intestino</text>
      </g>
      <g opacity={aparece(t, T.frijoles)}>
        <Comida tipo="frijoles" x={860} y={1290} s={1.4} />
      </g>
    </Lienzo>
  );
};

// D. El olor: una pizca de gases con azufre
export const Azufre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const comidas: ["huevo" | "carne" | "brocoli", number][] = [
    ["huevo", 260],
    ["carne", 540],
    ["brocoli", 820],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.malOlor, T.ruido], [1, 1.04])}>
      <g opacity={aparece(t, T.azufre)}>
        <Molecula gas="H2S" x={540} y={680} s={2.6} />
        <Olor x={540} y={480} s={1.6} t={t} op={aparece(t, T.azufre + 0.4)} />
        <text x={540} y={880} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={36} fontWeight={700} opacity={aparece(t, T.sulfuro)}>
          H2S · sulfuro de hidrógeno
        </text>
      </g>
      {comidas.map(([c, x], k) => (
        <g key={c} opacity={aparece(t, k === 0 ? T.huevo : T.porEso + k * 0.6)}>
          <Comida tipo={c} x={x} y={1210} s={1.5} />
          <Olor x={x} y={1050} s={0.9} t={t + k} />
        </g>
      ))}
    </Lienzo>
  );
};

// E. El ruido: la salida vibra como la boca de un globo
export const Ruido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.ruido, T.persona], [1, 1.05])}>
      <Globo x={540} y={860} s={1.7} t={t} vibra={interpolate(t, [T.vibrar, T.vibrar + 0.4], [0, 1], clamp)} />
    </Lienzo>
  );
};

// F. 10 a 20 veces al día; si lo aguantas, parte pasa a la sangre
export const Aguantar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const flujo = interpolate(t, [T.sangre, T.sangre + 0.6], [0, 1], clamp);
  const exhala = aparece(t, T.exhalas);
  return (
    <Lienzo zoom={interpolate(t, [T.persona, T.asiQueSi], [1, 1.04])}>
      <g opacity={aparece(t, T.veces)}>
        <Marcador x={540} y={330} titulo="al día" valor="10 a 20 veces" color={C.yellow} w={600} />
      </g>
      <g opacity={1 - aparece(t, T.aguantas)}>
        {new Array(14).fill(0).map((_, k) => (
          <g key={k} opacity={aparece(t, T.persona + 0.3 + k * 0.22)} transform={`translate(${210 + (k % 7) * 110} ${720 + Math.floor(k / 7) * 160})`}>
            <circle cx={-16} cy={6} r={22} fill={VERDE_OLOR} opacity={0.75} />
            <circle cx={12} cy={-6} r={28} fill={VERDE_OLOR} opacity={0.75} />
            <circle cx={30} cy={10} r={18} fill={VERDE_OLOR} opacity={0.75} />
          </g>
        ))}
      </g>
      <g opacity={aparece(t, T.aguantas)}>
        <SangrePulmones x={540} y={1050} t={t} p={flujo} />
        <text x={170} y={1380} fill={C.red} fontFamily={mono} fontSize={30} fontWeight={700} opacity={aparece(t, T.sangre)}>sangre</text>
        <text x={760} y={960} fill={C.grey} fontFamily={mono} fontSize={30} opacity={aparece(t, T.sangre)}>pulmones</text>
      </g>
      {exhala > 0
        ? [0, 1, 2].map((k) => {
            const f = (t * 0.5 + k / 3) % 1;
            return <circle key={k} cx={850 + f * 120} cy={630 - f * 160} r={16 + f * 30} fill="none" stroke={C.cyan} strokeWidth={4} opacity={exhala * (1 - f)} />;
          })
        : null}
    </Lienzo>
  );
};

// G. Cierre: tu aliento lleva un poquito
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nube = aparece(t, T.aliento);
  return (
    <Lienzo zoom={interpolate(t, [T.asiQueSi, T.fin + 0.5], [1, 1.06])} cy={800}>
      <Cara x={460} y={820} s={1.15} pupila={0.4} />
      {nube > 0
        ? [0, 1, 2, 3].map((k) => {
            const f = (t * 0.45 + k / 4) % 1;
            return <circle key={k} cx={560 + f * 320} cy={960 - f * 60} r={18 + f * 50} fill={VERDE_OLOR} opacity={0.28 * nube * (1 - f)} />;
          })
        : null}
      <text x={860} y={860} textAnchor="middle" fill={VERDE_OLOR} fontFamily={mono} fontSize={30} fontWeight={700} opacity={nube}>
        un poquito
      </text>
    </Lienzo>
  );
};
