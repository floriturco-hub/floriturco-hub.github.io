import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/lectorqr/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  acercas: 2.20, // acercas
  torniquete: 3.28, // torniquete
  instante: 5.20, // instante
  rayada: 6.86, // rayada
  final: 7.86, // final
  lectores: 9.42, // lectores
  laser: 10.76, // laser
  linea: 11.72, // linea
  barras: 13.48, // barras
  qr: 14.70, // qr
  dimensiones: 16.32, // dimensiones
  cuadro: 18.92, // cuadro
  camara: 21.28, // camara
  sensor: 21.76, // sensor
  programa: 25.00, // programa
  cuadrados: 26.18, // cuadrados
  esquinas: 26.88, // esquinas
  girado: 30.20, // girado
  respaldo: 32.34, // respaldo
  treinta: 33.98, // treinta
  reconstruye: 35.10, // reconstruye
  asi: 36.16, // asi
  fin: 38.00, // FIN
};

const N = 21;
const bit = (i: number, j: number) => ((i * 73856093) ^ (j * 19349663) ^ (i * j * 83492791)) % 7 < 3;
const enFinder = (i: number, j: number) => (i < 8 && j < 8) || (i < 8 && j >= N - 8) || (i >= N - 8 && j < 8);

// Código QR centrado en (x,y) de lado L; rot en grados; brillo de esquinas; dano = fracción tapada
const QR: React.FC<{ readonly x: number; readonly y: number; readonly L: number; readonly rot?: number; readonly esquinas?: number; readonly dano?: number }> = ({
  x,
  y,
  L,
  rot = 0,
  esquinas = 0,
  dano = 0,
}) => {
  const m = L / N;
  const finder = (fi: number, fj: number) => (
    <g key={`${fi}-${fj}`}>
      <rect x={fj * m} y={fi * m} width={7 * m} height={7 * m} fill="#111" />
      <rect x={(fj + 1) * m} y={(fi + 1) * m} width={5 * m} height={5 * m} fill="#fff" />
      <rect x={(fj + 2) * m} y={(fi + 2) * m} width={3 * m} height={3 * m} fill="#111" />
      {esquinas > 0 ? <rect x={fj * m - 8} y={fi * m - 8} width={7 * m + 16} height={7 * m + 16} fill="none" stroke={C.yellow} strokeWidth={8} opacity={esquinas} /> : null}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) translate(${-L / 2} ${-L / 2})`}>
      <rect x={-m * 2} y={-m * 2} width={L + m * 4} height={L + m * 4} fill="#fff" />
      {new Array(N * N).fill(0).map((_, k) => {
        const i = Math.floor(k / N);
        const j = k % N;
        return !enFinder(i, j) && bit(i, j) ? <rect key={k} x={j * m} y={i * m} width={m} height={m} fill="#111" /> : null;
      })}
      {finder(0, 0)}
      {finder(0, N - 7)}
      {finder(N - 7, 0)}
      {dano > 0 ? <path d={`M ${L * 0.45} ${L * 0.4} L ${L * 1.02} ${L * 0.55} L ${L * 1.02} ${L * 1.02} L ${L * 0.5} ${L * 1.02} Z`} fill="#3A3A44" opacity={dano} /> : null}
    </g>
  );
};

const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rayas?: number }> = ({ x, y, s = 1, rayas = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-320} width={340} height={640} rx={40} fill="#1A1A22" stroke="#5A5A66" strokeWidth={8} />
    <rect x={-150} y={-290} width={300} height={580} rx={24} fill="#E8E8EE" />
    <QR x={0} y={0} L={220} />
    {rayas > 0 ? <path d="M -140 -200 L 120 80 M -60 -280 L 140 -60 M -150 150 L 60 280" stroke="#fff" strokeWidth={5} opacity={rayas * 0.9} /> : null}
  </g>
);

const Lector: React.FC<{ readonly x: number; readonly y: number; readonly ok: number }> = ({ x, y, ok }) => (
  <g>
    <rect x={x - 200} y={y - 120} width={400} height={240} rx={30} fill="#3A3A44" />
    <rect x={x - 150} y={y - 80} width={300} height={160} rx={16} fill="#1A1A22" />
    <circle cx={x} cy={y} r={30} fill="#2A2440" stroke="#5A5A66" strokeWidth={6} />
    <circle cx={x + 160} cy={y - 90} r={16} fill={ok ? "#5AD08A" : "#5A3A3A"} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Lector x={540} y={1340} ok={1} />
    <Celular x={540} y={860} s={0.85} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿cómo lee este código tan rápido?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.acercas], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Acercas el celular al torniquete y lee el código al instante, aunque esté rayado + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.acercas, T.instante], [-300, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.acercas, T.lectores], [1, 1.04])}>
      <Lector x={540} y={1340} ok={t > T.instante ? 1 : 0} />
      <Celular x={540} y={860 + baja} s={0.85} rayas={aparece(t, T.rayada)} />
      <Texto x={540} y={1560} size={40} color="#5AD08A" op={aparece(t, T.instante)}>
        ¡bip! al instante
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y si está rayada?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.lectores], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Los lectores viejos: un láser que barría una línea; solo códigos de barras
export const Laser: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ly = 960 + 6 * Math.sin(t * 30);
  return (
    <Lienzo zoom={interpolate(t, [T.lectores, T.qr], [1, 1.04])}>
      <rect x={240} y={800} width={600} height={320} fill="#fff" />
      {new Array(40).fill(0).map((_, k) => (
        <rect key={k} x={270 + k * 14} y={820} width={(k * 7) % 3 === 0 ? 8 : 4} height={280} fill="#111" opacity={(k * 13) % 5 < 3 ? 1 : 0} />
      ))}
      <g opacity={aparece(t, T.laser)}>
        <line x1={200} y1={ly} x2={880} y2={ly} stroke={C.red} strokeWidth={6} />
        <line x1={200} y1={ly} x2={880} y2={ly} stroke={C.red} strokeWidth={20} opacity={0.3} />
      </g>
      <Texto x={540} y={640} size={40} color={C.red} op={aparece(t, T.laser)}>
        láser: una sola línea
      </Texto>
      <Texto x={540} y={1260} size={38} color={C.white} op={aparece(t, T.barras)}>
        solo códigos de barras
      </Texto>
    </Lienzo>
  );
};

// D. Un QR es un dibujo en 2D: hay que ver todo el cuadro; por eso usan una cámara CMOS
export const Camara: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cam = aparece(t, T.camara);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.qr, T.programa], [1, 1.04])}>
        <g opacity={1 - cam}>
          <QR x={540} y={950} L={420} />
          <line x1={240} y1={950} x2={840} y2={950} stroke={C.red} strokeWidth={6} opacity={aparece(t, T.dimensiones) * (1 - aparece(t, T.cuadro))} />
          <Texto x={540} y={1300} size={40} color={C.white} op={aparece(t, T.dimensiones)}>
            dibujo en 2 dimensiones
          </Texto>
          <rect x={300} y={710} width={480} height={480} fill="none" stroke={C.cyan} strokeWidth={8} opacity={aparece(t, T.cuadro)} />
        </g>
        <g opacity={cam}>
          <rect x={340} y={640} width={400} height={300} rx={30} fill="#3A3A44" />
          <circle cx={540} cy={790} r={100} fill="#1A1A22" stroke="#5A5A66" strokeWidth={10} />
          <circle cx={540} cy={790} r={50} fill="#2A3A6A" />
          <g opacity={aparece(t, T.sensor)}>
            {new Array(64).fill(0).map((_, k) => (
              <rect key={k} x={380 + (k % 8) * 42} y={1060 + Math.floor(k / 8) * 42} width={36} height={36} fill={["#E04A4A", "#4AE04A", "#4A4AE0"][k % 3]} opacity={0.6 + 0.4 * Math.sin(t * 4 + k)} />
            ))}
            <Texto x={540} y={1460} size={38} color={C.cyan}>
              sensor CMOS: ve todo el cuadro
            </Texto>
          </g>
        </g>
      </Lienzo>
      <Flash t={t} d={T.camara} color={C.cyan} />
    </>
  );
};

// E. El programa busca los tres cuadrados de las esquinas: sabe dónde está y cómo está girado
export const Esquinas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rot = 35 * (1 - interpolate(t, [T.girado, T.girado + 0.8], [0, 1], clamp));
  return (
    <Lienzo zoom={interpolate(t, [T.programa, T.respaldo], [1, 1.04])}>
      <QR x={540} y={950} L={420} rot={rot} esquinas={aparece(t, T.cuadrados)} />
      <Texto x={540} y={1340} size={40} color={C.yellow} op={aparece(t, T.esquinas)}>
        3 cuadrados de referencia
      </Texto>
      <Texto x={540} y={1410} size={36} color={C.white} op={aparece(t, T.girado)}>
        posición y giro
      </Texto>
    </Lienzo>
  );
};

// F. Datos de respaldo: aunque falte hasta un 30%, los reconstruye
export const Respaldo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.respaldo, T.asi], [1, 1.04])}>
        <QR x={540} y={950} L={420} dano={aparece(t, T.treinta)} />
        <Texto x={540} y={600} size={40} color={C.white} op={aparece(t, T.respaldo)}>
          datos de respaldo
        </Texto>
        <Texto x={540} y={1340} size={42} color={C.orange} op={aparece(t, T.treinta)}>
          falta hasta un 30 %
        </Texto>
        <Texto x={540} y={1420} size={46} color="#5AD08A" op={aparece(t, T.reconstruye)}>
          ✓ lo reconstruye
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.reconstruye} color="#5AD08A" />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
