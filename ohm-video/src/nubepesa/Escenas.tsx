import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/nubepesa/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  verano: 2.68, // verano
  toneladas: 4.24, // toneladas
  final: 6.92, // final
  sostiene: 7.66, // sostiene
  gotas: 9.20, // gotas
  diminutas: 9.86, // diminutas
  lluvia: 12.34, // lluvia
  repartido: 13.86, // repartido
  kilometro: 14.64, // kil
  metro: 16.62, // metro
  gramo: 18.32, // gramo
  pequena: 20.24, // peque
  lentisimo: 21.10, // lent
  frena: 22.72, // frena
  tibio: 25.12, // tibio
  corriente: 26.72, // corriente
  rapido: 28.56, // rapido
  chocan: 31.04, // chocan
  crecen: 32.26, // crecen
  lluvia2: 34.78, // lluvia
  asi: 35.42, // asi
  fin: 37.22, // FIN
};

const NUBE = "#E8ECF4";

const Nube: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly op?: number }> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    {[
      [-180, 40, 110],
      [-60, -30, 150],
      [90, -10, 130],
      [200, 50, 100],
      [0, 60, 130],
    ].map(([cx, cy, r], k) => (
      <circle key={k} cx={cx} cy={cy} r={r} fill={NUBE} />
    ))}
    <rect x={-280} y={60} width={560} height={110} rx={50} fill={NUBE} />
  </g>
);

const Elefante: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#8C94A4">
    <ellipse cx={0} cy={0} rx={60} ry={40} />
    <circle cx={55} cy={-20} r={26} />
    <path d="M 75 -10 Q 90 30 80 50" stroke="#8C94A4" strokeWidth={10} fill="none" />
    {[-40, -15, 15, 40].map((lx) => (
      <rect key={lx} x={lx - 8} y={25} width={16} height={34} />
    ))}
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Nube x={540 + 20 * Math.sin(t * 0.8)} y={920} s={1.2} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo flota esta nube tan pesada?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.verano], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Una nube de verano puede pesar unas 500 toneladas y aun así flota + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.verano, T.gotas], [1, 1.04])}>
      <Nube x={540 + 20 * Math.sin(t * 0.8)} y={860} s={1.1} />
      <g opacity={aparece(t, T.toneladas)}>
        <Texto x={540} y={1230} size={60} color={C.yellow}>
          ~500 toneladas
        </Texto>
        {new Array(10).fill(0).map((_, k) => (
          <Elefante key={k} x={170 + (k % 5) * 185} y={1340 + Math.floor(k / 5) * 110} s={0.6} />
        ))}
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿qué la sostiene?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.gotas], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Gotas diminutas, mucho más pequeñas que una gota de lluvia
export const Gotas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.gotas, T.repartido], [1, 1.04])}>
        <circle cx={540} cy={950} r={300} fill="none" stroke={C.grey} strokeWidth={4} strokeDasharray="12 10" />
        {new Array(60).fill(0).map((_, k) => (
          <circle key={k} cx={540 + Math.cos(k * 2.4) * (40 + ((k * 37) % 240))} cy={950 + Math.sin(k * 2.4) * (40 + ((k * 37) % 240))} r={6} fill="#8AC8FF" opacity={aparece(t, T.diminutas)} />
        ))}
        <path d="M 900 1100 Q 960 1200 900 1260 Q 840 1200 900 1100 Z" fill="#3A8AD8" opacity={aparece(t, T.lluvia)} />
        <Texto x={900} y={1330} size={28} color="#8AC8FF" op={aparece(t, T.lluvia)}>
          gota de lluvia
        </Texto>
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.gotas)}>
          una nube: gotas diminutas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.diminutas} color={C.white} />
    </>
  );
};

// D. Repartido en un kilómetro cúbico: en cada metro cúbico, apenas medio gramo de agua
export const Reparto: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cubo = (x: number, y: number, s: number, col: string) => (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M 0 0 L ${s} 0 L ${s} ${s} L 0 ${s} Z`} fill="none" stroke={col} strokeWidth={5} />
      <path d={`M 0 0 L ${s * 0.4} ${-s * 0.4} L ${s * 1.4} ${-s * 0.4} L ${s} 0 M ${s * 1.4} ${-s * 0.4} L ${s * 1.4} ${s * 0.6} L ${s} ${s}`} fill="none" stroke={col} strokeWidth={5} />
    </g>
  );
  return (
    <Lienzo zoom={interpolate(t, [T.repartido, T.pequena], [1, 1.04])}>
      <g opacity={aparece(t, T.kilometro)}>{cubo(200, 820, 400, C.cyan)}</g>
      <Texto x={420} y={1300} size={34} color={C.cyan} op={aparece(t, T.kilometro)}>
        1 km³ de aire
      </Texto>
      <g opacity={aparece(t, T.metro)}>{cubo(800, 1000, 80, C.yellow)}</g>
      <Texto x={850} y={1160} size={30} color={C.yellow} op={aparece(t, T.metro)}>
        1 m³
      </Texto>
      <Texto x={540} y={1420} size={42} color={C.yellow} op={aparece(t, T.gramo)}>
        ~medio gramo de agua
      </Texto>
      <Texto x={540} y={620} size={38} color={C.white} op={aparece(t, T.repartido)}>
        el peso está muy repartido
      </Texto>
    </Lienzo>
  );
};

// E. Una gota tan pequeña cae lentísimo: el aire la frena
export const Caida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const yG = 760 + ((t - T.pequena) * 30) % 300;
  return (
    <Lienzo zoom={interpolate(t, [T.pequena, T.tibio], [1, 1.04])}>
      <circle cx={540} cy={yG} r={16} fill="#8AC8FF" />
      {[-1, 1].map((d) => (
        <path key={d} d={`M ${540 + d * 40} ${yG + 120} l 0 -60 m -12 12 l 12 -12 l 12 12`} stroke={C.cyan} strokeWidth={6} fill="none" opacity={aparece(t, T.frena)} />
      ))}
      <Texto x={540} y={620} size={42} color={C.white} op={aparece(t, T.lentisimo)}>
        cae lentísimo
      </Texto>
      <Texto x={540} y={1300} size={38} color={C.cyan} op={aparece(t, T.frena)}>
        el aire la frena
      </Texto>
    </Lienzo>
  );
};

// F. La nube se forma donde sube aire tibio; esa corriente empuja hacia arriba más rápido de lo que caen las gotas
export const Corriente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.tibio, T.chocan], [1, 1.04])}>
        <Nube x={540} y={720} s={0.9} />
        <rect x={0} y={1450} width={1080} height={200} fill="#3A6A3A" />
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.6 + k / 8) % 1;
          return <path key={k} d={`M ${380 + (k % 4) * 100} ${1420 - u * 500} l 0 -60 m -14 14 l 14 -14 l 14 14`} stroke={C.orange} strokeWidth={8} fill="none" opacity={aparece(t, T.tibio) * (1 - u)} />;
        })}
        <Texto x={540} y={1530} size={36} color={C.white} op={aparece(t, T.tibio)}>
          sube aire tibio del suelo
        </Texto>
        <Texto x={540} y={1060} size={36} color={C.yellow} op={aparece(t, T.rapido)}>
          sube más rápido de lo que caen
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.corriente} color={C.orange} />
    </>
  );
};

// G. Las gotas chocan, se juntan, crecen, pesan más y caen: lluvia
export const Lluvia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ll = aparece(t, T.lluvia2);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.chocan, T.asi], [1, 1.04])}>
        <Nube x={540} y={720} s={0.9} op={1 - 0.3 * ll} />
        <circle cx={480 + 40 * aparece(t, T.chocan)} cy={1000} r={14} fill="#8AC8FF" opacity={1 - aparece(t, T.crecen)} />
        <circle cx={600 - 40 * aparece(t, T.chocan)} cy={1000} r={14} fill="#8AC8FF" opacity={1 - aparece(t, T.crecen)} />
        <circle cx={540} cy={1000} r={26} fill="#3A8AD8" opacity={aparece(t, T.crecen) * (1 - ll)} />
        {ll > 0
          ? new Array(14).fill(0).map((_, k) => (
              <line key={k} x1={240 + k * 45} y1={880 + ((t * 600 + k * 77) % 600)} x2={232 + k * 45} y2={920 + ((t * 600 + k * 77) % 600)} stroke="#3A8AD8" strokeWidth={6} opacity={ll} />
            ))
          : null}
        <Texto x={540} y={1150} size={36} color={C.white} op={aparece(t, T.chocan) * (1 - ll)}>
          chocan, se juntan y crecen
        </Texto>
        <Texto x={540} y={1550} size={48} color="#3A8AD8" op={ll}>
          lluvia
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.lluvia2} color="#8AC8FF" />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
