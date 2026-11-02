import { interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { ChipTachado, Esquema, Pistola } from "./Piezas";

// Instantes clave (s) de public/audio/gasolina/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  sensor: 1.28,
  sabe: 4.54,
  secreto: 7.12,
  agujerito: 8.28,
  tubo: 9.7,
  mientras: 13.4,
  estrecho: 15.86,
  presion: 17.88,
  venturi: 19.04,
  succion: 20.68,
  pero: 26.84,
  tapa: 29.28,
  yaNo: 30.82,
  camara: 33.78,
  membrana: 35.42,
  pestillo: 36.68,
  palanca: 37.98,
  clac: 39.42,
  todo: 40.08,
  porEso: 44.02,
  derramar: 47.28,
  noEs: 49.2,
  fisica: 50.3,
  fin: 51.5,
};

const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cx?: number; readonly cy?: number }> = ({ children, zoom = 1, cx = 540, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${cx - cx * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

// A. Gancho: sin electrónica y sabe cuándo parar
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [0, T.secreto], [1, 1.05])}>
      <Pistola x={520} y={700} s={1.5} />
      <ChipTachado x={540} y={1180} op={aparece(t, T.sensor)} />
    </Lienzo>
  );
};

// B1. El agujerito, el tubo fino y el Venturi
export const Partes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.secreto, T.succion], [1, 1.04])}>
      <Esquema
        t={t}
        flujo={aparece(t, T.mientras)}
        aire={0}
        nivel={0.3}
        membrana={0}
        disparo={0}
        resaltes={{ agujero: aparece(t, T.agujerito), tubo: aparece(t, T.tubo), venturi: aparece(t, T.estrecho) }}
      />
      <text x={440} y={440} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={28} fontWeight={700} opacity={aparece(t, T.venturi)} transform="translate(0 210)">Venturi</text>
    </Lienzo>
  );
};

// B2. El aire entra hasta que la gasolina tapa el agujerito
export const Aire: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapado = t > T.tapa;
  return (
    <Lienzo zoom={interpolate(t, [T.succion, T.membrana], [1, 1.04])}>
      <Esquema
        t={t}
        flujo={1}
        aire={tapado ? 0 : aparece(t, T.succion)}
        nivel={interpolate(t, [T.pero, T.tapa + 0.2], [0.35, 0.76], clamp)}
        membrana={tapado ? interpolate(t, [T.yaNo, T.camara + 0.8], [0, 0.25], clamp) : 0}
        disparo={0}
        resaltes={{ agujero: tapado ? 1 : 0, camara: aparece(t, T.camara) }}
      />
    </Lienzo>
  );
};

// B3. La membrana se hunde y la palanca se dispara: clac
export const Clac: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const disparo = interpolate(t, [T.palanca, T.palanca + 0.35], [0, 1], clamp);
  const flash = interpolate(t, [T.clac, T.clac + 0.06, T.clac + 0.4], [0, 0.3, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.membrana, T.porEso], [1.15, 1.2])} cx={400} cy={480}>
        <Esquema t={t} flujo={1 - disparo} aire={0} nivel={0.76} membrana={interpolate(t, [T.membrana, T.membrana + 0.6], [0.25, 1], clamp)} disparo={disparo} resaltes={{ camara: 1 }} />
        <g opacity={aparece(t, T.todo)}>
          <text x={660} y={250} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={54} fontWeight={700}>menos de 1 s</text>
          <text x={660} y={296} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={26}>aire + un muelle</text>
        </g>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// C. No sigas echando a toquecitos
export const Toquecitos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gotas = aparece(t, T.derramar);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.noEs], [1, 1.05])}>
      <Pistola x={480} y={640} s={1.2} gatillo={0.5 + 0.5 * Math.sin(t * 9)} />
      <rect x={560} y={900} width={400} height={400} rx={20} fill="#14102A" stroke="#5A5478" strokeWidth={6} />
      <rect x={566} y={906} width={388} height={388} rx={14} fill="#F0A040" opacity={0.55} />
      {gotas > 0
        ? [0, 1, 2].map((k) => {
            const f = (t * 0.9 + k / 3) % 1;
            return <ellipse key={k} cx={600 + k * 140} cy={910 + f * 520} rx={12} ry={18} fill="#F0A040" opacity={gotas * (1 - f)} />;
          })
        : null}
    </Lienzo>
  );
};

// D. Cierre: pura física
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.noEs, T.fin + 0.5], [1, 1.06])}>
      <Pistola x={520} y={700} s={1.5} />
      <ChipTachado x={540} y={1180} op={1} />
    </Lienzo>
  );
};
