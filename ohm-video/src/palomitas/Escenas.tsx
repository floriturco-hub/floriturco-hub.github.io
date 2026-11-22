import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/palomitas/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  hacer: 2.24, // hacer
  abrir: 4.24, // abrir
  tiempo: 5.56, // tiempo
  final: 6.42, // final
  menos: 7.68, // menos
  grano: 8.70, // grano
  agua: 10.40, // agua
  cascara: 12.26, // c
  calentarse: 13.48, // calentarse
  vapor: 15.10, // vapor
  presion: 17.56, // presi
  revienta: 20.94, // revienta
  espuma: 22.94, // espuma
  grieta: 25.94, // grieta
  escapa: 27.12, // escapa
  seco: 31.00, // seco
  frasco: 34.60, // frasco
  porEso: 36.60, // por
  fin: 38.46, // FIN
};

const MAIZ = "#F0B830";
const PALOMITA = "#FFF4DC";

// Grano en corte: agua interna, presión p (0..1), estalla e (0..1), grieta g
const Grano: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly p?: number; readonly e?: number; readonly g?: number; readonly t?: number; readonly agua?: number }> = ({
  x,
  y,
  s = 1,
  p = 0,
  e = 0,
  g = 0,
  t = 0,
  agua = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {e < 0.5 ? (
      <g>
        <path d="M 0 -150 Q 120 -120 110 30 Q 90 150 0 160 Q -90 150 -110 30 Q -120 -120 0 -150 Z" fill={MAIZ} />
        <path d="M 0 -120 Q 90 -100 80 20 Q 70 120 0 130 Q -70 120 -80 20 Q -90 -100 0 -120 Z" fill="#FFF0C0" opacity={0.6} />
        {new Array(8).fill(0).map((_, k) => (
          <circle key={k} cx={Math.cos(k * 2.3) * 40 + p * 6 * Math.sin(t * 30 + k)} cy={Math.sin(k * 2.3) * 50} r={8 + p * 6} fill={p > 0.3 ? "#E8E6F0" : "#3A8AD8"} opacity={agua * 0.9} />
        ))}
        {g > 0 ? <path d="M 70 -90 L 90 -40 L 75 0" stroke="#3A2A10" strokeWidth={6} fill="none" opacity={g} /> : null}
      </g>
    ) : (
      <g>
        {[
          [-60, -40, 90],
          [60, -50, 80],
          [0, 50, 100],
          [-70, 60, 70],
          [70, 60, 70],
        ].map(([cx, cy, r], k) => (
          <circle key={k} cx={cx} cy={cy} r={r * (0.6 + 0.4 * e)} fill={PALOMITA} />
        ))}
        <path d="M -30 80 Q 0 120 30 80" fill={MAIZ} />
      </g>
    )}
  </g>
);

const Olla: React.FC<{ readonly t: number }> = ({ t }) => (
  <g>
    <path d="M 160 1000 L 920 1000 L 860 1380 L 220 1380 Z" fill="#4A5060" />
    <rect x={120} y={970} width={840} height={40} rx={16} fill="#5A6070" />
    {new Array(16).fill(0).map((_, k) => (
      <circle key={k} cx={260 + ((k * 97) % 560)} cy={900 - ((k * 53) % 160) - 6 * Math.sin(t * 3 + k)} r={40} fill={PALOMITA} />
    ))}
    {[0, 1, 2].map((k) => (
      <ellipse key={k} cx={420 + k * 120} cy={1340} rx={22} ry={16} fill={MAIZ} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Olla t={t} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué estos granos no explotan?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.hacer], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Siempre quedan granos sin abrir, aunque los dejes más tiempo + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hacer, T.grano], [1, 1.04])}>
      <Olla t={t} />
      <circle cx={540} cy={1340} r={120} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="14 10" opacity={aparece(t, T.abrir)} />
      <Texto x={540} y={1480} size={38} color={C.yellow} op={aparece(t, T.abrir)}>
        granos sin abrir
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cómo tener menos?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.grano], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Cada grano guarda agua bajo una cáscara dura; al calentarse se vuelve vapor y la presión sube; revienta: palomita
export const Estalla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.vapor, T.revienta], [0, 1], clamp);
  const e = interpolate(t, [T.revienta, T.revienta + 0.3], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.grano, T.grieta], [1, 1.04])}>
        <Grano x={540} y={980} s={1.6} p={p} e={e} t={t} />
        <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.agua) * (1 - e)}>
          agua dentro de una cáscara dura
        </Texto>
        <Texto x={540} y={1340} size={36} color={C.orange} op={aparece(t, T.presion) * (1 - e)}>
          vapor atrapado: la presión sube
        </Texto>
        <Texto x={540} y={1340} size={42} color={C.yellow} op={e}>
          ¡revienta! ~180 °C
        </Texto>
        <Texto x={540} y={620} size={36} color={PALOMITA} op={aparece(t, T.espuma)}>
          el almidón se infla como espuma
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.revienta} color={PALOMITA} />
    </>
  );
};

// D. Con grieta, el vapor se escapa; muy seco, no hay agua suficiente
export const Fallas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.grieta, T.frasco], [1, 1.04])}>
      <Grano x={300} y={980} s={1} p={0.5} g={aparece(t, T.grieta)} t={t} />
      {aparece(t, T.escapa) > 0
        ? [0, 1, 2].map((k) => <path key={k} d={`M ${390 + k * 10} ${880 - ((t * 60 + k * 20) % 80)} q 20 -20 0 -40`} stroke="#E8E6F0" strokeWidth={5} fill="none" opacity={aparece(t, T.escapa)} />)
        : null}
      <Texto x={300} y={1240} size={30} color={C.white} op={aparece(t, T.grieta)}>
        grieta: el vapor se escapa
      </Texto>
      <g opacity={aparece(t, T.seco)}>
        <Grano x={780} y={980} s={1} p={0} agua={0.1} t={t} />
        <Texto x={780} y={1240} size={30} color={C.white}>
          muy seco: sin vapor
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Guárdalos en un frasco cerrado para que no se sequen
export const Frasco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frasco, T.porEso], [1, 1.04])}>
        <rect x={380} y={720} width={320} height={60} rx={16} fill="#8A90A0" />
        <rect x={360} y={780} width={360} height={520} rx={40} fill="#DDEEFF" opacity={0.2} stroke="#DDEEFF" strokeWidth={6} />
        {new Array(30).fill(0).map((_, k) => (
          <ellipse key={k} cx={400 + ((k * 61) % 280)} cy={1270 - Math.floor(k / 6) * 50 - (k % 2) * 10} rx={20} ry={14} fill={MAIZ} />
        ))}
        <Texto x={540} y={1400} size={40} color={C.yellow} op={aparece(t, T.frasco)}>
          frasco cerrado: no se secan
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.frasco} color={C.yellow} />
    </>
  );
};

// F. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
