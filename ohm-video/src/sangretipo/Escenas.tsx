import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/sangretipo/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sangre: 1.84, // sangre
  positiva: 4.94, // positiva
  equivocada: 7.18, // equivocada
  defensas: 8.02, // defensas
  final: 9.56, // final
  globulos: 11.88, // globulos
  marcas: 13.00, // marcas
  banderas: 13.76, // banderas
  ambas: 17.56, // ambas
  ninguna: 18.86, // ninguna
  positivo: 20.02, // positivo
  factor: 22.34, // factor
  plasma: 23.86, // plasma
  anticuerpos: 24.48, // anticuerpos
  ponen: 27.90, // ponen
  atacan: 29.74, // atacan
  revientan: 31.64, // revientan
  negativo: 33.44, // negativo
  cualquiera: 35.94, // cualquiera
  eso: 36.74, // eso
  fin: 38.14, // FIN
};

const ROJO = "#C83A3A";

// Glóbulo rojo con marcas: a = marca A (triángulo amarillo), b = marca B (cuadro cian), rh = rombo
const Globulo: React.FC<{ readonly x: number; readonly y: number; readonly a?: boolean; readonly b?: boolean; readonly rh?: boolean; readonly s?: number; readonly roto?: number }> = ({
  x,
  y,
  a = false,
  b = false,
  rh = false,
  s = 1,
  roto = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 - roto * 0.3)})`} opacity={1 - roto * 0.6}>
    <circle cx={0} cy={0} r={80} fill={ROJO} />
    <circle cx={0} cy={0} r={40} fill="#A82A2A" />
    {[0, 1, 2, 3, 4, 5].map((k) => {
      const ang = (k / 6) * Math.PI * 2;
      const mx = Math.cos(ang) * 92;
      const my = Math.sin(ang) * 92;
      const tipo = k % 3 === 0 ? a : k % 3 === 1 ? b : rh;
      if (!tipo) return null;
      return k % 3 === 0 ? (
        <path key={k} d={`M ${mx - 14} ${my + 10} L ${mx} ${my - 16} L ${mx + 14} ${my + 10} Z`} fill={C.yellow} />
      ) : k % 3 === 1 ? (
        <rect key={k} x={mx - 12} y={my - 12} width={24} height={24} fill={C.cyan} />
      ) : (
        <path key={k} d={`M ${mx} ${my - 14} L ${mx + 12} ${my} L ${mx} ${my + 14} L ${mx - 12} ${my} Z`} fill="#5AD08A" />
      );
    })}
  </g>
);

// Anticuerpo en forma de Y
const Anti: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number; readonly col?: string; readonly s?: number }> = ({ x, y, rot = 0, col = C.cyan, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 30 L 0 0 L -20 -26 M 0 0 L 20 -26" stroke={col} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

const Gota: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 -200 C 90 -60 140 20 140 90 A 140 140 0 0 1 -140 90 C -140 20 -90 -60 0 -200 Z" fill={ROJO} />
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Gota x={540} y={1000} s={1.6} />
    {["A", "B", "AB", "O"].map((l, k) => (
      <Texto key={l} x={375 + k * 110} y={1120 + 10 * Math.sin(t * 2 + k)} size={58} color="#fff">
        {l}
      </Texto>
    ))}
    <Texto x={540} y={1260} size={60} color="#fff">
      + / −
    </Texto>
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿qué significan estas letras?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sangre], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. A, B, AB u O, positiva o negativa; con la equivocada, tus defensas atacan + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const mala = aparece(t, T.equivocada);
  return (
    <Lienzo zoom={interpolate(t, [T.sangre, T.globulos], [1, 1.04])}>
      <g opacity={1 - mala}>
        {["A", "B", "AB", "O"].map((l, k) => (
          <g key={l} opacity={aparece(t, T.sangre + k * 0.2)}>
            <circle cx={240 + k * 200} cy={900} r={80} fill={ROJO} />
            <Texto x={240 + k * 200} y={925} size={60} color="#fff">
              {l}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1120} size={56} color="#fff" op={aparece(t, T.positiva)}>
          + / −
        </Texto>
      </g>
      <g opacity={mala}>
        <path d="M 540 720 L 700 780 L 690 980 Q 660 1100 540 1150 Q 420 1100 390 980 L 380 780 Z" fill={C.red} opacity={0.3 + 0.2 * Math.sin(t * 8)} />
        <Texto x={540} y={1260} size={44} color={C.red} op={aparece(t, T.defensas)}>
          ¡tus defensas atacan!
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuál le sirve a casi todos?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.globulos], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Los glóbulos llevan marcas como banderas: A, B, ambas (AB) o ninguna (O); el Rh es otra marca
export const Marcas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rh = aparece(t, T.positivo);
  const tipos: [string, boolean, boolean, number][] = [
    ["A", true, false, T.banderas],
    ["B", false, true, T.banderas + 0.6],
    ["AB", true, true, T.ambas],
    ["O", false, false, T.ninguna],
  ];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.globulos, T.plasma], [1, 1.04])}>
        {tipos.map(([l, a, b, tt], k) => (
          <g key={l} opacity={aparece(t, tt)}>
            <Globulo x={300 + (k % 2) * 480} y={820 + Math.floor(k / 2) * 380} a={a} b={b} rh={rh > 0.5 && k % 2 === 0} />
            <Texto x={300 + (k % 2) * 480} y={990 + Math.floor(k / 2) * 380} size={46} color="#fff">
              {l + (rh > 0.5 ? (k % 2 === 0 ? "+" : "−") : "")}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.marcas)}>
          marcas en el glóbulo rojo
        </Texto>
        <Texto x={540} y={1560} size={36} color="#5AD08A" op={aparece(t, T.factor)}>
          ◆ factor Rh: + lo tienes, − no
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.banderas} color={C.yellow} />
    </>
  );
};

// D. Tu plasma tiene anticuerpos contra las marcas que no tienes; si eres A y te ponen B, atacan y revientan
export const Ataque: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [T.ponen, T.atacan], [0, 1], clamp);
  const pega = interpolate(t, [T.atacan, T.revientan], [0, 1], clamp);
  const roto = interpolate(t, [T.revientan, T.revientan + 0.6], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.plasma, T.negativo], [1, 1.04])}>
        <rect x={100} y={700} width={880} height={700} rx={40} fill="#E8C870" opacity={0.15} />
        <Globulo x={260} y={850} a s={0.8} />
        <Texto x={260} y={980} size={34} color={C.yellow}>
          tú: A
        </Texto>
        {new Array(6).fill(0).map((_, k) => {
          const x0 = 200 + (k % 3) * 300;
          const y0 = 1150 + Math.floor(k / 3) * 140;
          const tx = 700 + (k % 3 - 1) * 70;
          const ty = 950 + (Math.floor(k / 3) - 0.5) * 90;
          return <Anti key={k} x={x0 + (tx - x0) * pega} y={y0 + (ty - y0) * pega} rot={k * 30} col={C.cyan} s={1.2} />;
        })}
        <Texto x={540} y={1460} size={34} color={C.cyan} op={aparece(t, T.anticuerpos)}>
          anticuerpos contra la marca B
        </Texto>
        <g opacity={entra}>
          <Globulo x={700 + 40 * (1 - entra)} y={950} b s={0.9} roto={roto} />
          {roto > 0.3
            ? new Array(8).fill(0).map((_, k) => {
                const a = (k / 8) * Math.PI * 2;
                return <circle key={k} cx={700 + Math.cos(a) * 140 * roto} cy={950 + Math.sin(a) * 140 * roto} r={10} fill={ROJO} />;
              })
            : null}
          <Texto x={700} y={780} size={34} color={C.cyan}>
            sangre B
          </Texto>
        </g>
        <Texto x={540} y={600} size={42} color={C.red} op={aparece(t, T.revientan)}>
          ¡lo atacan y lo revientan!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.revientan} color={C.red} />
    </>
  );
};

// E. Los glóbulos O negativo no tienen marcas: le sirven a casi cualquiera
export const Universal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.negativo, T.eso], [1, 1.04])}>
      <Globulo x={540} y={850} s={1.2} />
      <Texto x={540} y={1020} size={56} color="#fff">
        O−
      </Texto>
      <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.negativo)}>
        sin marcas
      </Texto>
      <g opacity={aparece(t, T.cualquiera)}>
        {["A", "B", "AB", "O"].map((l, k) => (
          <g key={l}>
            <path d={`M 540 1080 L ${240 + k * 200} 1260`} stroke="#5AD08A" strokeWidth={6} />
            <circle cx={240 + k * 200} cy={1320} r={56} fill={ROJO} />
            <Texto x={240 + k * 200} y={1338} size={40} color="#fff">
              {l}
            </Texto>
          </g>
        ))}
        <Texto x={540} y={1470} size={40} color="#5AD08A">
          le sirve a casi cualquiera ✓
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.eso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
