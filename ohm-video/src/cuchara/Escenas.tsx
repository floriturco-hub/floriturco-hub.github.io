import { interpolate, random } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/cuchara/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  olla: 2.44, // olla
  desbordarse: 3.06, // desbordarse
  pones: 3.96, // pones
  baja: 6.22, // baja
  final: 7.34, // final
  burbujas: 10.28, // burbujas
  vapor: 10.86, // vapor
  almidon: 12.44, // almidon
  resistentes: 13.38, // resistentes
  cuando: 14.48, // cuando
  fria: 16.92, // fria
  seca: 17.56, // seca
  frio: 18.36, // frio
  condensa: 18.66, // condensa
  rompe: 21.04, // rompe
  revienta: 23.60, // revienta
  vienen: 24.98, // vienen
  chocan: 25.54, // chocan
  desinfla: 27.48, // desinfla
  pero: 28.74, // pero
  calienta: 29.92, // calienta
  moja: 30.78, // moja
  deja: 32.14, // deja
  porEso: 33.62, // por
  fin: 35.54, // FIN
};

const MADERA = "#B8864A";
const ESPUMA = "#F0ECE0";

// Olla de perfil con espuma hasta "nivel" (0 = abajo, 1 = borde), cuchara encima (op), estado de la cuchara
const Olla: React.FC<{ readonly nivel: number; readonly cuchara: number; readonly t: number; readonly mojada?: number; readonly pasa?: number }> = ({
  nivel,
  cuchara,
  t,
  mojada = 0,
  pasa = 0,
}) => {
  const yTop = 760;
  const yFondo = 1220;
  const yEsp = yFondo - 260 - nivel * 200;
  return (
    <g>
      <rect x={200} y={1220} width={680} height={40} rx={10} fill="#3A3650" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${330 + k * 210} 1290 q -20 -30 0 -60 q 20 -30 0 -60`} stroke={C.orange} strokeWidth={10} fill="none" opacity={0.6 + 0.4 * Math.sin(t * 8 + k)} />
      ))}
      <rect x={240} y={yTop} width={600} height={yFondo - yTop} fill="#141030" />
      <rect x={244} y={yFondo - 260} width={592} height={256} fill="#E8D8A8" opacity={0.5} />
      <rect x={244} y={yEsp} width={592} height={yFondo - 260 - yEsp + 4} fill={ESPUMA} opacity={0.9} />
      {new Array(18).fill(0).map((_, k) => (
        <circle key={k} cx={260 + random(`e${k}`) * 560} cy={yEsp + 10 + Math.sin(t * 3 + k) * 6} r={14 + (k % 3) * 8} fill={ESPUMA} />
      ))}
      <g opacity={pasa}>
        {new Array(10).fill(0).map((_, k) => (
          <circle key={`p${k}`} cx={250 + k * 60} cy={yTop - 20 - (k % 2) * 16} r={24} fill={ESPUMA} />
        ))}
      </g>
      <path d={`M 240 ${yTop} L 240 ${yFondo} L 840 ${yFondo} L 840 ${yTop}`} stroke={C.grey} strokeWidth={14} fill="none" />
      <rect x={150} y={yTop + 40} width={90} height={24} rx={10} fill={C.grey} />
      <rect x={840} y={yTop + 40} width={90} height={24} rx={10} fill={C.grey} />
      <g opacity={cuchara}>
        <rect x={150} y={yTop - 34} width={700} height={30} rx={14} fill={MADERA} />
        <ellipse cx={890} cy={yTop - 20} rx={90} ry={40} fill={MADERA} />
        <rect x={150} y={yTop - 34} width={780} height={30} rx={14} fill={C.cyan} opacity={mojada * 0.25} />
      </g>
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Olla nivel={0.95} cuchara={1} t={t} />
    <Texto x={540} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué esta cuchara frena la espuma?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.olla], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={ESPUMA} />
    </>
  );
};

// B. La olla está por desbordarse, pones la cuchara y la espuma baja + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = t < T.baja ? interpolate(t, [T.olla, T.desbordarse + 0.6], [0.3, 1], clamp) : interpolate(t, [T.baja, T.baja + 0.8], [1, 0.55], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.olla, T.burbujas], [1, 1.04])}>
      <Olla nivel={nivel} cuchara={aparece(t, T.pones)} t={t} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1380} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1380}
          width={700 * interpolate(t, [T.final, T.burbujas], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1470} color={C.white} size={38}>
          cuándo deja de funcionar
        </Texto>
      </g>
    </Lienzo>
  );
};

// Burbuja grande: vapor (puntos) y película de almidón; condensa 0-1, rota 0-1
const Burbuja: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly t: number; readonly condensa?: number; readonly rota?: number; readonly pelicula?: number }> = ({
  x,
  y,
  r,
  t,
  condensa = 0,
  rota = 0,
  pelicula = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${1 + rota * 0.3})`} opacity={1 - rota}>
    <circle cx={0} cy={0} r={r} fill="#8AC8F8" opacity={0.12} />
    <circle cx={0} cy={0} r={r} fill="none" stroke={C.yellow} strokeWidth={10} opacity={pelicula} strokeDasharray={rota > 0.05 ? "40 30" : "none"} />
    {new Array(12).fill(0).map((_, k) => {
      const a = random(`b${k}`) * Math.PI * 2;
      const d = random(`r${k}`) * r * 0.75 * (1 - condensa * 0.6);
      return <circle key={k} cx={Math.cos(a + t) * d} cy={Math.sin(a + t) * d + condensa * r * 0.5} r={6 + condensa * 6} fill={condensa > 0.5 ? "#3A9AE8" : C.white} opacity={0.9} />;
    })}
  </g>
);

// C. La espuma son burbujas de vapor atrapadas en una capa de almidón
export const Espuma: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.burbujas, T.cuando], [1, 1.04])}>
      <Burbuja x={540} y={880} r={260} t={t} pelicula={aparece(t, T.almidon)} />
      <Texto x={540} y={880} size={40} color={C.white} op={aparece(t, T.vapor)}>
        vapor
      </Texto>
      <Texto x={540} y={1240} size={40} color={C.yellow} op={aparece(t, T.almidon)}>
        capa de almidón
      </Texto>
      <Texto x={540} y={1310} size={34} color={C.grey} op={aparece(t, T.resistentes)}>
        las hace resistentes
      </Texto>
    </Lienzo>
  );
};

// D. Al tocar la cuchara fría y seca, el vapor se condensa y la película se rompe: revienta
export const Toca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const y = interpolate(t, [T.cuando, T.fria], [1100, 860], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cuando, T.vienen], [1, 1.04])}>
        <rect x={100} y={560} width={880} height={60} rx={26} fill={MADERA} />
        <Texto x={540} y={540} size={34} color={C.cyan} op={aparece(t, T.fria)}>
          más fría y seca
        </Texto>
        <Burbuja x={540} y={y} r={220} t={t} condensa={aparece(t, T.condensa)} rota={interpolate(t, [T.revienta - 0.1, T.revienta + 0.4], [0, 1], clamp)} pelicula={1} />
        <Texto x={540} y={1250} size={38} color="#3A9AE8" op={aparece(t, T.condensa) * (1 - aparece(t, T.rompe))}>
          el vapor se condensa
        </Texto>
        <Texto x={540} y={1250} size={38} color={C.yellow} op={aparece(t, T.rompe) * (1 - aparece(t, T.revienta))}>
          la madera rompe la película
        </Texto>
        <Texto x={540} y={1250} size={50} color={C.white} op={aparece(t, T.revienta)}>
          ¡pop!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.revienta} color={C.white} />
    </>
  );
};

// E. Las que vienen detrás chocan con las rotas y la espuma se desinfla
export const Cadena: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.vienen, T.pero], [1, 1.04])}>
      <rect x={100} y={560} width={880} height={60} rx={26} fill={MADERA} />
      {new Array(15).fill(0).map((_, k) => {
        const fila = Math.floor(k / 5);
        const x = 220 + (k % 5) * 160;
        const y0 = 720 + fila * 170;
        const rompe = interpolate(t, [T.chocan + fila * 0.5, T.chocan + fila * 0.5 + 0.4], [0, 1], clamp);
        return <Burbuja key={k} x={x} y={y0 - aparece(t, T.vienen) * 40} r={70} t={t} rota={rompe} />;
      })}
      <Texto x={540} y={1340} size={40} color={C.white} op={aparece(t, T.desinfla)}>
        la espuma se desinfla
      </Texto>
    </Lienzo>
  );
};

// F. La cuchara se calienta y se moja: deja de funcionar
export const Moja: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const pasa = aparece(t, T.deja);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.pero, T.porEso], [1, 1.04])}>
        <Olla nivel={1} cuchara={1} t={t} mojada={aparece(t, T.moja)} pasa={pasa} />
        <g opacity={aparece(t, T.calienta)}>
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${380 + k * 160} 700 q 15 -25 0 -50 q -15 -25 0 -50`} stroke={C.red} strokeWidth={6} fill="none" />
          ))}
        </g>
        <Texto x={540} y={500} size={38} color={C.red} op={aparece(t, T.calienta) * (1 - aparece(t, T.moja))}>
          se calienta
        </Texto>
        <Texto x={540} y={500} size={38} color={C.cyan} op={aparece(t, T.moja) * (1 - pasa)}>
          y se moja
        </Texto>
        <Texto x={540} y={500} size={42} color={C.yellow} op={pasa}>
          deja de funcionar
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.deja} color={C.yellow} />
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
