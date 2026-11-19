import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/preforma/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  botella: 2.04, // botella
  litros: 2.78, // litros
  final: 5.66, // final
  llama: 8.24, // llama
  lamparas: 10.02, // lamparas
  calientan: 11.18, // calientan
  ablanda: 13.84, // ablanda
  molde: 16.44, // molde
  varilla: 18.24, // varilla
  estira: 18.74, // estira
  soplan: 20.80, // soplan
  presion: 21.66, // presion
  globo: 23.42, // globo
  frias: 25.18, // frias
  endurece: 26.32, // endurece
  moleculas: 29.28, // moleculas
  alinean: 29.96, // alinean
  resistente: 32.20, // resistente
  rosca: 33.36, // rosca
  tapa: 36.14, // tapa
  asi: 37.92, // asi
  fin: 39.34, // FIN
};

const PET = "#8AC8F0";

// Perfil (media anchura) de la preforma (f=0) a la botella (f=1); cuello arriba en y0
const perfil = (f: number) => {
  const L = 340 + f * 600;
  const n = 30;
  return new Array(n + 1).fill(0).map((_, i) => {
    const u = i / n;
    const y = 90 + u * L;
    const pre = u > 0.92 ? 40 * Math.sqrt(Math.max(0, 1 - ((u - 0.92) / 0.08) ** 2)) : 40;
    const bot = u < 0.2 ? 46 + (160 - 46) * Math.sin((u / 0.2) * (Math.PI / 2)) : u > 0.95 ? 160 * Math.sqrt(Math.max(0, 1 - ((u - 0.95) / 0.05) ** 2)) : 160;
    return [pre + (bot - pre) * f, y];
  });
};

const Botella: React.FC<{ readonly x: number; readonly y: number; readonly f: number; readonly s?: number; readonly col?: string; readonly rosca?: number }> = ({ x, y, f, s = 1, col = PET, rosca = 0 }) => {
  const p = perfil(f);
  const der = p.map(([w, yy]) => `${w} ${yy}`);
  const izq = p.map(([w, yy]) => `${-w} ${yy}`).reverse();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -46 90 L ${der.join(" L ")} L ${izq.join(" L ")} Z`} fill={col} opacity={0.55} stroke="#C8E8FF" strokeWidth={4} />
      <rect x={-50} y={0} width={100} height={90} rx={8} fill={col} opacity={0.8} stroke={rosca > 0 ? C.yellow : "#C8E8FF"} strokeWidth={rosca > 0 ? 8 : 4} />
      {[20, 45, 70].map((yy) => (
        <line key={yy} x1={-50} y1={yy} x2={50} y2={yy - 8} stroke="#C8E8FF" strokeWidth={4} />
      ))}
      <rect x={-64} y={92} width={128} height={14} rx={6} fill={col} />
    </g>
  );
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Botella x={540} y={640} f={0.5 + 0.5 * Math.sin(t * 1.5)} />
    <Texto x={860} y={700} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo se infla este tubito?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.botella], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Una botella de dos litros empieza como un tubito de plástico + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const f = 1 - interpolate(t, [T.litros, T.final], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.botella, T.llama], [1, 1.04])}>
      <Botella x={540} y={600} f={f} />
      <Texto x={820} y={900} size={40} color={C.white} op={aparece(t, T.botella) * (f > 0.5 ? 1 : 0.3)}>
        2 litros
      </Texto>
      <Texto x={780} y={800} size={36} color={PET} op={f < 0.3 ? 1 : 0}>
        empieza así
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿por qué la rosca no cambia?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.llama], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La preforma: lámparas infrarrojas la calientan a ~100 °C y el plástico se ablanda sin derretirse
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cal = interpolate(t, [T.calientan, T.ablanda], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.llama, T.molde], [1, 1.04])}>
        <Botella x={540} y={700} f={0} col={cal > 0.5 ? "#F0A080" : PET} />
        {[0, 1].map((k) => (
          <g key={k} opacity={aparece(t, T.lamparas)}>
            <rect x={k ? 780 : 220} y={760} width={80} height={320} rx={20} fill="#3A3A44" />
            <rect x={k ? 780 : 280} y={780} width={20} height={280} fill={C.red} opacity={0.6 + 0.4 * Math.sin(t * 8)} />
          </g>
        ))}
        <Texto x={540} y={620} size={44} color={PET} op={aparece(t, T.llama)}>
          preforma
        </Texto>
        <Texto x={540} y={1250} size={40} color={C.orange} op={aparece(t, T.calientan)}>
          {"~" + Math.round(25 + cal * 75) + " °C"}
        </Texto>
        <Texto x={540} y={1330} size={36} color={C.white} op={aparece(t, T.ablanda)}>
          se ablanda sin derretirse
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.lamparas} color={C.red} />
    </>
  );
};

// D. En el molde: una varilla la estira y le soplan aire a presión; se infla como un globo y se endurece al tocar las paredes frías
export const Molde: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const estira = interpolate(t, [T.estira, T.soplan], [0, 1], clamp);
  const f = interpolate(t, [T.soplan, T.globo + 0.6], [0, 1], clamp);
  const frio = aparece(t, T.frias);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.molde, T.moleculas], [1, 1.04])}>
        <g opacity={aparece(t, T.molde)}>
          <path d="M 540 690 L 360 840 L 360 1600 L 540 1600 Z" fill={frio ? "#2A4A8A" : "#3A3A44"} />
          <path d="M 540 690 L 720 840 L 720 1600 L 540 1600 Z" fill={frio ? "#2A4A8A" : "#3A3A44"} />
          <path d={`M 540 690 ${perfil(1).map(([w, yy]) => `L ${540 + w} ${600 + yy}`).join(" ")}`} stroke="#0E0B1E" strokeWidth={4} fill="none" />
        </g>
        <Botella x={540} y={600} f={Math.max(f, estira * 0.15)} col={f > 0.95 ? PET : "#F0A080"} />
        <rect x={530} y={560} width={20} height={200 + estira * 700} fill="#C8C8D4" opacity={aparece(t, T.varilla) * (1 - aparece(t, T.endurece))} />
        <g opacity={aparece(t, T.soplan) * (1 - aparece(t, T.endurece))}>
          {[0, 1, 2].map((k) => {
            const u = (t * 2 + k / 3) % 1;
            return <path key={k} d={`M ${500 + k * 40} ${560 + u * 400} l 0 30`} stroke={C.cyan} strokeWidth={6} />;
          })}
        </g>
        <Texto x={880} y={760} size={32} color={C.white} op={aparece(t, T.varilla)}>
          varilla
        </Texto>
        <Texto x={880} y={860} size={32} color={C.cyan} op={aparece(t, T.presion)}>
          aire a presión
        </Texto>
        <Texto x={880} y={1200} size={32} color="#6A8AE8" op={frio}>
          molde frío
        </Texto>
        <Texto x={200} y={1200} size={34} color={C.yellow} op={aparece(t, T.endurece)}>
          &lt; 1 segundo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.globo} color={C.white} />
    </>
  );
};

// E. Al estirarse, sus moléculas se alinean: la botella queda delgada pero resistente
export const Moleculas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const al = interpolate(t, [T.alinean - 0.3, T.alinean + 0.6], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.moleculas, T.rosca], [1, 1.04])}>
      {new Array(10).fill(0).map((_, k) => {
        const y = 760 + k * 50;
        const pts = new Array(12).fill(0).map((__, i) => {
          const x = 200 + i * 60;
          const caos = (1 - al) * 60 * Math.sin(i * 1.7 + k * 2.3 + t);
          return `${i ? "L" : "M"} ${x} ${y + caos}`;
        });
        return <path key={k} d={pts.join(" ")} stroke={PET} strokeWidth={6} fill="none" />;
      })}
      <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.moleculas)}>
        cadenas de plástico
      </Texto>
      <Texto x={540} y={1360} size={42} color={C.yellow} op={aparece(t, T.alinean)}>
        se alinean al estirarse
      </Texto>
      <Texto x={540} y={1430} size={36} color={C.white} op={aparece(t, T.resistente)}>
        delgada pero resistente
      </Texto>
    </Lienzo>
  );
};

// F. La rosca ya viene terminada y no se calienta, para que la tapa ajuste perfecto
export const Rosca: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapa = interpolate(t, [T.tapa, T.tapa + 0.8], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.rosca, T.asi], [1.3, 1.36])} cy={800}>
        <Botella x={540} y={640} f={1} rosca={aparece(t, T.rosca)} />
        <rect x={480} y={560 + tapa * 80 - 80 + 0} width={120} height={100} rx={14} fill={C.red} opacity={aparece(t, T.tapa)} transform={`translate(0 ${-80 * (1 - tapa)})`} />
        <Texto x={540} y={500} size={30} color={C.yellow} op={aparece(t, T.rosca)}>
          rosca: ya terminada, sin calentar
        </Texto>
        <Texto x={540} y={1100} size={30} color={C.white} op={aparece(t, T.tapa)}>
          la tapa ajusta perfecto
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.rosca} color={C.yellow} />
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
