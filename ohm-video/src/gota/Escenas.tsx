import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/gota/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  sales: 1.52, // sales
  sacudes: 2.58, // sacudes
  saltas: 3.76, // saltas
  sigue: 5.26, // sigue
  final: 6.42, // final
  canal: 8.86, // canal
  curvo: 10.70, // curvo
  cerumen: 13.38, // cerumen
  repele: 13.94, // repele
  fino: 15.80, // fino
  tension: 16.68, // tension
  pega: 18.58, // pega
  tapon: 20.08, // tapon
  atrapado: 20.98, // atrapado
  salir: 22.38, // salir
  entrar: 23.32, // entrar
  curva: 25.28, // curva
  sacudir: 26.70, // sacudir
  truco2: 29.12, // truco
  inclina: 29.76, // inclina
  jala: 30.98, // jala
  enderezar: 32.34, // enderezar
  cae: 33.98, // cae
  porEso: 34.94, // por
  fin: 36.36, // FIN
};

const AGUA = "#3A9AE8";
const PIEL = "#E8B48A";
const CERA = "#E8C048";

// Punto sobre la curva del canal (k = 0 curvo, 1 recto), u en 0-1
const P0 = [260, 900];
const P3 = [800, 880];
const canalPt = (u: number, k: number) => {
  const c1 = [430, 760 + 120 * k];
  const c2 = [600, 1020 - 140 * k];
  const m = 1 - u;
  return [
    m * m * m * P0[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * P3[0],
    m * m * m * P0[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * P3[1],
  ];
};

// Corte del oído: canal en S, tímpano, cerumen, gota en posición u (0 = salida)
const Oido: React.FC<{ readonly k: number; readonly gota: number; readonly uGota: number; readonly cera?: number; readonly aire?: number; readonly t?: number }> = ({
  k,
  gota,
  uGota,
  cera = 0,
  aire = 0,
  t = 0,
}) => {
  const d = new Array(41)
    .fill(0)
    .map((_, i) => {
      const [x, y] = canalPt(i / 40, k);
      return `${i ? "L" : "M"} ${x} ${y}`;
    })
    .join(" ");
  const [gx, gy] = canalPt(uGota, k);
  const [ax, ay] = canalPt(Math.min(0.92, uGota + 0.18), k);
  return (
    <g>
      <rect x={60} y={560} width={960} height={720} rx={40} fill="#C8846A" />
      <path d="M 60 600 Q 180 640 230 900 Q 180 1160 60 1220 Z" fill={PIEL} />
      <path d={d} stroke={CERA} strokeWidth={100} fill="none" strokeLinecap="round" opacity={0.25 + 0.75 * cera} />
      <path d={d} stroke="#3A1A2A" strokeWidth={84} fill="none" strokeLinecap="round" />
      <rect x={P3[0] + 30} y={P3[1] - 80} width={18} height={160} rx={8} fill="#E8E0F0" />
      <Texto x={P3[0] + 40} y={P3[1] - 110} size={28} color={C.white}>
        tímpano
      </Texto>
      <circle cx={ax} cy={ay} r={30} fill="#C8D8F8" opacity={aire * 0.8} />
      <ellipse cx={gx} cy={gy} rx={40} ry={36 + Math.sin(t * 8) * 2} fill={AGUA} opacity={gota} />
    </g>
  );
};

// Cabeza de perfil que se sacude
const Cabeza: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot: number; readonly gota: number }> = ({ x, y, s, rot, gota }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={200} ry={240} fill={PIEL} />
    <path d="M -200 -60 Q -220 -220 0 -250 Q 200 -240 200 -40 Q 120 -200 -200 -60 Z" fill="#3A2A1A" />
    <path d="M 0 -20 q 50 -10 50 50 q 0 50 -40 60" stroke="#C8846A" strokeWidth={14} fill="none" />
    <circle cx={20} cy={40} r={18} fill={AGUA} opacity={gota} />
    <circle cx={150} cy={-40} r={14} fill="#111" />
  </g>
);

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Cabeza x={540} y={940} s={1.2} rot={Math.sin(t * 14) * 10} gota={1} />
    <Texto x={860} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué no sale esa gota?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.sales], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={AGUA} />
    </>
  );
};

// B. Sacudes la cabeza, saltas en un pie y la gota sigue ahí + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sac = t > T.sacudes ? Math.sin(t * 16) * 14 : 0;
  const salto = t > T.saltas ? Math.abs(Math.sin(t * 6)) * 80 : 0;
  return (
    <Lienzo zoom={interpolate(t, [T.sales, T.canal], [1, 1.04])}>
      <Cabeza x={540} y={880 - salto} s={1} rot={sac} gota={1} />
      <Texto x={540} y={1250} size={44} color={AGUA} op={aparece(t, T.sigue) * (1 - aparece(t, T.final))}>
        la gota sigue ahí
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.canal], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          el truco que sí funciona: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. El canal es un tubo estrecho y curvo de 2,5 cm cubierto de cerumen que repele el agua
export const Canal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.canal, T.fino], [1, 1.04])}>
      <Oido k={0} gota={0} uGota={0.45} cera={aparece(t, T.cerumen)} t={t} />
      <g opacity={aparece(t, T.curvo)}>
        <path d="M 260 1340 L 800 1340 M 260 1320 L 260 1360 M 800 1320 L 800 1360" stroke={C.white} strokeWidth={5} />
        <Texto x={530} y={1410} size={36} color={C.white}>
          2,5 cm, curvo
        </Texto>
      </g>
      <Texto x={540} y={500} size={36} color={CERA} op={aparece(t, T.cerumen)}>
        cerumen: repele el agua
      </Texto>
    </Lienzo>
  );
};

// D. En un tubo tan fino manda la tensión superficial: la gota forma un tapón con aire detrás
export const Tapon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.fino, T.salir], [1, 1.06])}>
      <Oido k={0} gota={aparece(t, T.pega)} uGota={0.45} cera={1} aire={aparece(t, T.atrapado)} t={t} />
      <Texto x={540} y={500} size={40} color={C.cyan} op={aparece(t, T.tension)}>
        tensión superficial
      </Texto>
      <Texto x={540} y={1380} size={38} color={AGUA} op={aparece(t, T.tapon)}>
        un tapón de agua
      </Texto>
      <Texto x={540} y={1440} size={34} color="#C8D8F8" op={aparece(t, T.atrapado)}>
        con aire atrapado detrás
      </Texto>
    </Lienzo>
  );
};

// E. Tendría que entrar aire mientras sale el agua, y la curva no lo deja; sacudir apenas vence esa fuerza
export const Bloqueo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sac = t > T.sacudir ? Math.sin(t * 20) * 0.02 : 0;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.salir, T.truco2], [1.06, 1.08])}>
        <Oido k={0} gota={1} uGota={0.45 + sac} cera={1} aire={1} t={t} />
        <g opacity={aparece(t, T.salir)}>
          <path d="M 420 1100 L 260 1100 M 290 1080 L 260 1100 L 290 1120" stroke={AGUA} strokeWidth={8} fill="none" />
          <Texto x={340} y={1170} size={30} color={AGUA}>
            sale agua
          </Texto>
        </g>
        <g opacity={aparece(t, T.entrar)}>
          <path d="M 260 700 L 420 700 M 390 680 L 420 700 L 390 720" stroke="#C8D8F8" strokeWidth={8} fill="none" />
          <Texto x={340} y={660} size={30} color="#C8D8F8">
            entra aire
          </Texto>
        </g>
        <g opacity={aparece(t, T.curva)}>
          <line x1={430} y1={780} x2={530} y2={880} stroke={C.red} strokeWidth={12} />
          <line x1={530} y1={780} x2={430} y2={880} stroke={C.red} strokeWidth={12} />
        </g>
        <Texto x={540} y={1400} size={38} color={C.red} op={aparece(t, T.sacudir)}>
          sacudir no basta
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.curva} color={C.red} />
    </>
  );
};

// F. El truco: inclina la cabeza y jala la oreja para enderezar el canal; la gota cae sola
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const k = interpolate(t, [T.jala, T.enderezar + 0.5], [0, 1], clamp);
  const u = interpolate(t, [T.cae, T.cae + 0.8], [0.45, -0.3], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.truco2, T.porEso], [1, 1.04])}>
        <g transform={`rotate(${interpolate(t, [T.inclina, T.inclina + 0.6], [0, -25], clamp)} 540 900)`}>
          <Oido k={k} gota={1} uGota={u} cera={1} aire={0.5} t={t} />
        </g>
        <Texto x={540} y={480} size={44} color={C.yellow} op={aparece(t, T.truco2)}>
          el truco
        </Texto>
        <Texto x={540} y={1420} size={38} color={C.white} op={aparece(t, T.jala) * (1 - aparece(t, T.cae))}>
          jala la oreja hacia atrás
        </Texto>
        <Texto x={540} y={1420} size={40} color={AGUA} op={aparece(t, T.cae)}>
          ¡la gota cae sola!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cae + 0.4} color={AGUA} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} t={t} />
    </Lienzo>
  );
};
