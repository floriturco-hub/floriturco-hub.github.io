import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/frenos/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  carreras: 2.94, // carreras
  discos: 3.68, // discos
  rojo: 4.56, // rojo
  frenan: 5.38, // frenan
  final: 7.20, // final
  hechos: 10.36, // hechos
  fibras: 11.96, // fibras
  matriz: 13.66, // matriz
  frenar: 15.06, // frenar
  calor: 16.78, // calor
  acero: 18.08, // acero
  ablanda: 19.30, // ablanda
  agarre: 20.26, // agarre
  cambio: 21.78, // cambio
  aguanta: 22.50, // aguanta
  mil: 23.04, // mil
  friccion: 24.90, // friccion
  sube: 25.30, // sube
  rinde: 26.44, // rinde
  cuatrocientos: 27.70, // cuatrocientos
  frio: 29.96, // frio
  poco: 30.78, // poco
  pilotos: 32.00, // pilotos
  zigzaguean: 32.96, // zigzaguean
  porEso: 35.74, // por
  fin: 37.68, // FIN
};

// Color del disco según calor (0 frío - 1 al rojo blanco)
const colorCalor = (c: number) => {
  const r = Math.round(interpolate(c, [0, 0.5, 1], [60, 220, 255], clamp));
  const g = Math.round(interpolate(c, [0, 0.5, 1], [58, 50, 170], clamp));
  const b = Math.round(interpolate(c, [0, 0.5, 1], [72, 30, 60], clamp));
  return `rgb(${r},${g},${b})`;
};

const Disco: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly calor: number; readonly t: number }> = ({ x, y, s, calor, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={300} fill={colorCalor(calor)} opacity={0.25 * calor} />
    <g transform={`rotate(${t * 120})`}>
      <circle cx={0} cy={0} r={260} fill={colorCalor(calor)} />
      {new Array(24).fill(0).map((_, k) => {
        const a = (k / 24) * Math.PI * 2;
        return <circle key={k} cx={Math.cos(a) * (180 + (k % 2) * 40)} cy={Math.sin(a) * (180 + (k % 2) * 40)} r={10} fill="#141030" opacity={0.6} />;
      })}
      <circle cx={0} cy={0} r={110} fill="#5A5478" />
      {[0, 1, 2, 3, 4].map((k) => (
        <circle key={k} cx={Math.cos((k / 5) * Math.PI * 2) * 60} cy={Math.sin((k / 5) * Math.PI * 2) * 60} r={14} fill="#2A2640" />
      ))}
    </g>
    <path d="M -130 -300 Q 0 -340 130 -300 L 110 -170 Q 0 -200 -110 -170 Z" fill={C.red} />
  </g>
);

// Gráfica fricción vs temperatura: acero baja, carbono sube
const Grafica: React.FC<{ readonly acero: number; readonly carbono: number; readonly zona: number; readonly p?: number }> = ({ acero, carbono, zona, p = 1 }) => {
  const x0 = 160;
  const x1 = 920;
  const y0 = 1250;
  const y1 = 760;
  const X = (temp: number) => x0 + ((x1 - x0) * temp) / 1200;
  const Y = (f: number) => y0 - (y0 - y1) * f;
  const curva = (fn: (temp: number) => number) =>
    new Array(61)
      .fill(0)
      .map((_, i) => {
        const temp = (i / 60) * 1200 * p;
        return `${i ? "L" : "M"} ${X(temp)} ${Y(fn(temp))}`;
      })
      .join(" ");
  return (
    <g>
      <rect x={X(400)} y={y1 - 20} width={X(1000) - X(400)} height={y0 - y1 + 20} fill={C.yellow} opacity={0.12 * zona} />
      <Texto x={(X(400) + X(1000)) / 2} y={y1 - 40} size={30} color={C.yellow} op={zona}>
        400 – 1000 °C
      </Texto>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={C.grey} strokeWidth={4} />
      <line x1={x0} y1={y0} x2={x0} y2={y1 - 60} stroke={C.grey} strokeWidth={4} />
      <Texto x={x0 + 10} y={y1 - 80} size={28} color={C.grey} anchor="start">
        agarre
      </Texto>
      <Texto x={x1} y={y0 + 46} size={28} color={C.grey} anchor="end">
        temperatura
      </Texto>
      <path d={curva((temp) => (temp < 450 ? 0.6 : Math.max(0.05, 0.6 - (temp - 450) / 900)))} stroke="#8C88A8" strokeWidth={8} fill="none" opacity={acero} />
      <Texto x={X(1000)} y={Y(0.05) - 20} size={30} color="#8C88A8" op={acero}>
        acero
      </Texto>
      <path d={curva((temp) => Math.min(0.85, 0.2 + temp / 900))} stroke={C.orange} strokeWidth={10} fill="none" opacity={carbono} />
      <Texto x={X(1050)} y={Y(0.85) - 20} size={30} color={C.orange} op={carbono}>
        carbono
      </Texto>
    </g>
  );
};

const Inicio: React.FC<{ readonly q: number; readonly t: number }> = ({ q, t }) => (
  <>
    <Disco x={540} y={960} s={1.2} calor={0.85} t={t} />
    <Texto x={860} y={560} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué estos frenos aman el calor?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.carreras], [1.12, 1])}>
        <Inicio q={q} t={t} />
      </Lienzo>
      <Flash t={t} d={0.7} color={C.orange} />
    </>
  );
};

// B. Los discos brillan al rojo vivo y frenan mejor que en frío + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const calor = interpolate(t, [T.discos, T.rojo + 0.5], [0, 0.85], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.carreras, T.hechos], [1, 1.04])}>
      <Disco x={540} y={880} s={1} calor={calor} t={t} />
      <Texto x={540} y={1250} size={60} color={colorCalor(calor)} op={aparece(t, T.discos)}>
        {`${Math.round((calor / 0.85) * 800)} °C`}
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.hechos], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué los calientan antes
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Carbono-carbono: fibras de carbono en una matriz de carbono
export const Material: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hechos, T.frenar], [1, 1.04])}>
      <circle cx={540} cy={880} r={330} fill="#1A1820" stroke={C.grey} strokeWidth={8} opacity={aparece(t, T.matriz)} />
      <g opacity={aparece(t, T.hechos + 0.3)}>
        {new Array(9).fill(0).map((_, k) => (
          <g key={k}>
            <line x1={260} y1={640 + k * 60} x2={820} y2={640 + k * 60} stroke="#5A5A68" strokeWidth={14} strokeLinecap="round" />
            <line x1={300 + k * 60} y1={600} x2={300 + k * 60} y2={1160} stroke="#4A4A58" strokeWidth={14} strokeLinecap="round" opacity={0.8} />
          </g>
        ))}
      </g>
      <Texto x={540} y={500} size={50} color={C.white} op={aparece(t, T.hechos)}>
        carbono-carbono
      </Texto>
      <Texto x={540} y={1320} size={36} color={C.grey} op={aparece(t, T.matriz)}>
        fibras en una matriz de carbono
      </Texto>
    </Lienzo>
  );
};

// D. Frenar convierte velocidad en calor; el acero caliente se ablanda y pierde agarre
export const Acero: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const graf = aparece(t, T.acero);
  return (
    <Lienzo zoom={interpolate(t, [T.frenar, T.cambio], [1, 1.04])}>
      <g opacity={1 - graf}>
        <Texto x={540} y={760} size={56} color={C.cyan} op={aparece(t, T.frenar)}>
          velocidad
        </Texto>
        <path d="M 540 800 L 540 920 M 510 890 L 540 920 L 570 890" stroke={C.white} strokeWidth={8} fill="none" opacity={aparece(t, T.calor)} />
        <Texto x={540} y={1010} size={56} color={C.orange} op={aparece(t, T.calor)}>
          calor
        </Texto>
      </g>
      <g opacity={graf}>
        <Grafica acero={1} carbono={0} zona={0} p={interpolate(t, [T.acero, T.agarre + 0.4], [0.3, 1], clamp)} />
        <Texto x={540} y={1380} size={38} color="#8C88A8" op={aparece(t, T.ablanda)}>
          el acero se ablanda
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. El carbono aguanta más de mil grados y su fricción sube con la temperatura
export const Carbono: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.cambio, T.frio], [1, 1.04])}>
        <Grafica acero={0.4} carbono={aparece(t, T.cambio)} zona={aparece(t, T.rinde)} p={interpolate(t, [T.friccion, T.sube + 0.5], [0.3, 1], clamp)} />
        <Texto x={540} y={1380} size={38} color={C.orange} op={aparece(t, T.mil) * (1 - aparece(t, T.friccion))}>
          aguanta más de 1000 °C
        </Texto>
        <Texto x={540} y={1380} size={38} color={C.orange} op={aparece(t, T.friccion)}>
          más calor = más agarre
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.sube} color={C.orange} />
    </>
  );
};

// Auto visto desde arriba
const Auto: React.FC<{ readonly x: number; readonly y: number; readonly rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-40} y={-90} width={80} height={180} rx={20} fill={C.red} />
    <rect x={-30} y={-40} width={60} height={50} rx={10} fill="#141030" />
    {[-1, 1].map((sx) =>
      [-1, 1].map((sy) => <rect key={`${sx}${sy}`} x={sx * 48 - 12} y={sy * 60 - 20} width={24} height={40} rx={6} fill="#111" />),
    )}
  </g>
);

// F. En frío agarran poco; los pilotos zigzaguean en la vuelta previa para calentarlos
export const Vuelta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zz = aparece(t, T.zigzaguean);
  const y = 1300 - ((t - T.frio) * 120) % 900;
  const x = 540 + Math.sin(t * 4) * 160 * zz;
  const calor = interpolate(t, [T.zigzaguean, T.porEso], [0.05, 0.75], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.frio, T.porEso], [1, 1.04])}>
      <rect x={290} y={400} width={500} height={1100} fill="#2A2A38" />
      <line x1={540} y1={400} x2={540} y2={1500} stroke={C.white} strokeWidth={6} strokeDasharray="40 30" opacity={0.4} />
      <Auto x={x} y={y} rot={Math.cos(t * 4) * 25 * zz} />
      <Disco x={900} y={560} s={0.3} calor={calor} t={t} />
      <Texto x={900} y={700} size={30} color={colorCalor(calor)}>
        {`${Math.round((calor / 0.85) * 800)} °C`}
      </Texto>
      <Texto x={160} y={560} size={34} color="#8AC8F8" op={aparece(t, T.frio) * (1 - zz)}>
        frío:
      </Texto>
      <Texto x={160} y={610} size={34} color="#8AC8F8" op={aparece(t, T.poco) * (1 - zz)}>
        poco agarre
      </Texto>
    </Lienzo>
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
