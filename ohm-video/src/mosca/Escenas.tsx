import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/mosca/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  tu: 1.9,
  lenta: 3.98,
  final: 5.08,
  tus: 7.18,
  sesenta: 8.16,
  mosca: 10.16,
  doscientas: 11.22,
  asi: 12.78,
  mucho: 14.42,
  lo: 15.46,
  sus: 17.64,
  lentes: 18.38,
  alrededor: 20.12,
  en: 22.08,
  calcula: 23.16,
  patas: 25.22,
  salta: 26.3,
  camina: 27.72,
  almohadillas: 29.56,
  pegajoso: 30.78,
  para: 32.3,
  aplaude: 33.38,
  saltara: 35.24,
  porEso: 37.18,
  fin: 39.0,
};

const OJO = "#C83A3A";
const CUERPO = "#2A2A30";
const PIEL = "#E8B890";

// Mosca vista desde arriba, mirando hacia arriba (-y)
const Mosca: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number; readonly t: number; readonly vuela?: number }> = ({
  x,
  y,
  s,
  rot = 0,
  t,
  vuela = 0,
}) => {
  const ala = vuela ? Math.sin(t * 90) * 25 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {[-1, 1].map((l) =>
        [-20, 0, 20].map((dy) => (
          <line key={`${l}${dy}`} x1={0} y1={dy} x2={l * 60} y2={dy + 20 + (dy === -20 ? -30 : 0)} stroke={CUERPO} strokeWidth={5} />
        )),
      )}
      <ellipse cx={-30} cy={10} rx={22} ry={60} fill="#A8C8E8" opacity={0.55} transform={`rotate(${-25 - ala} -10 -10)`} />
      <ellipse cx={30} cy={10} rx={22} ry={60} fill="#A8C8E8" opacity={0.55} transform={`rotate(${25 + ala} 10 -10)`} />
      <ellipse cx={0} cy={20} rx={24} ry={44} fill={CUERPO} />
      <circle cx={0} cy={-34} r={22} fill={CUERPO} />
      <circle cx={-16} cy={-40} r={14} fill={OJO} />
      <circle cx={16} cy={-40} r={14} fill={OJO} />
    </g>
  );
};

// Mano (vista desde arriba)
const Mano: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number; readonly op?: number }> = ({ x, y, s, rot = 0, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-90} y={-60} width={180} height={200} rx={70} fill={PIEL} />
    {[-60, -20, 20, 60].map((dx) => (
      <rect key={dx} x={dx - 18} y={-170} width={36} height={130} rx={18} fill={PIEL} />
    ))}
    <rect x={-150} y={-10} width={90} height={40} rx={20} fill={PIEL} transform="rotate(-30 -90 10)" />
  </g>
);

// Imagen del gancho y del cierre: manotazo y la mosca escapando
const Manotazo: React.FC<{ readonly t: number; readonly k: number; readonly q: number }> = ({ t, k, q }) => (
  <>
    <rect x={60} y={500} width={960} height={900} rx={30} fill="#4A3A2A" />
    <Mosca x={540 + k * 260} y={960 - k * 380} s={1.4} rot={k * 30} t={t} vuela={k > 0.05 ? 1 : 0} />
    <Mano x={540} y={interpolate(k, [0, 1], [700, 980])} s={1.3} op={0.85} />
    <Texto x={540} y={1530} size={110} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué nunca atrapas una mosca?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tu], [1.12, 1])}>
        <Manotazo t={t} k={interpolate(t, [0.6, 1.3], [0, 1], suave)} q={interpolate(t, [1.0, 1.3], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.0} />
    </>
  );
};

// B. Tu mano es rápida, pero ella la ve en cámara lenta + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tu, T.tus], [1, 1.05])}>
      {[0, 1, 2].map((k) => (
        <Mano key={k} x={300 + k * 60} y={800} s={0.7} op={0.25 + k * 0.3} />
      ))}
      <Texto x={360} y={1040} size={36} color={C.white}>
        tu mano: rápida
      </Texto>
      <g opacity={aparece(t, T.lenta - 0.6)}>
        <Mosca x={800} y={800} s={1.1} t={t} />
        <rect x={680} y={640} width={240} height={320} rx={16} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="20 12" />
        <Texto x={800} y={1040} size={36} color={C.yellow}>
          ella: cámara lenta
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.tus], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          cómo engañarla: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Tira de película con n fotogramas visibles que se desplaza
const Pelicula: React.FC<{ readonly y: number; readonly t: number; readonly n: number; readonly color: string; readonly op: number }> = ({ y, t, n, color, op }) => {
  const w = 900 / n;
  const off = (t * 120) % w;
  return (
    <g opacity={op}>
      <rect x={90} y={y - 70} width={900} height={140} fill="#1A1620" />
      {new Array(n + 1).fill(0).map((_, k) => (
        <rect key={k} x={90 + k * w - off} y={y - 50} width={Math.max(2, w - 6)} height={100} fill={color} opacity={0.7} />
      ))}
    </g>
  );
};

// C. Tus ojos: unas 60 imágenes por segundo; los de la mosca, unas 250
export const Imagenes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.tus, T.asi], [1, 1.04])}>
      <Pelicula y={700} t={t} n={6} color={C.cyan} op={aparece(t, T.tus)} />
      <Texto x={540} y={840} size={44} color={C.cyan} op={aparece(t, T.sesenta)}>
        tú: 60 por segundo
      </Texto>
      <Pelicula y={1060} t={t} n={25} color={C.red} op={aparece(t, T.mosca)} />
      <Texto x={540} y={1200} size={44} color={C.red} op={aparece(t, T.doscientas)}>
        mosca: 250 por segundo
      </Texto>
    </Lienzo>
  );
};

// D. Tu manotazo para ella dura mucho más: lo ve venir en cámara lenta
export const Lento: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const baja = interpolate(t, [T.asi, T.sus], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.sus], [1, 1.06])}>
      <rect x={60} y={500} width={960} height={900} rx={30} fill="#4A3A2A" />
      <Mosca x={540} y={1100} s={1.2} t={t} />
      <Mano x={540} y={interpolate(baja, [0, 1], [500, 760])} s={1.1} op={0.85} />
      <g opacity={aparece(t, T.lo)}>
        <rect x={80} y={520} width={150} height={60} rx={12} fill={C.red} />
        <Texto x={155} y={562} size={30} color={C.white}>
          ×0,25
        </Texto>
      </g>
      <Texto x={540} y={1330} size={40} color={C.yellow} op={aparece(t, T.lo)}>
        lo ve venir en cámara lenta
      </Texto>
    </Lienzo>
  );
};

// E. Sus ojos tienen miles de lentes que ven casi todo a su alrededor
export const Ojos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const campo = aparece(t, T.alrededor - 0.4);
  return (
    <Lienzo zoom={interpolate(t, [T.sus, T.en], [1, 1.04])}>
      <g opacity={1 - campo}>
        <circle cx={540} cy={840} r={300} fill={OJO} />
        {new Array(13).fill(0).map((_, r) =>
          new Array(13).fill(0).map((__, c) => {
            const x = 540 + (c - 6) * 44 + (r % 2) * 22;
            const y = 840 + (r - 6) * 38;
            if ((x - 540) ** 2 + (y - 840) ** 2 > 280 ** 2) return null;
            return (
              <polygon
                key={`${r}${c}`}
                points={new Array(6)
                  .fill(0)
                  .map((___, k) => `${x + Math.cos((k * Math.PI) / 3 + Math.PI / 6) * 22},${y + Math.sin((k * Math.PI) / 3 + Math.PI / 6) * 22}`)
                  .join(" ")}
                fill="#E85A5A"
                stroke="#8A1A1A"
                strokeWidth={3}
                opacity={aparece(t, T.lentes)}
              />
            );
          }),
        )}
      </g>
      <g opacity={campo}>
        <path d="M 540 840 L 540 440 A 400 400 0 1 1 480 445 Z" fill={C.yellow} opacity={0.2} />
        <Mosca x={540} y={840} s={1.6} t={t} />
        <Texto x={540} y={1330} size={40} color={C.yellow}>
          ve casi todo a su alrededor
        </Texto>
      </g>
      <Texto x={540} y={1250} size={40} color={C.white} op={aparece(t, T.lentes) * (1 - campo)}>
        miles de lentes
      </Texto>
    </Lienzo>
  );
};

// F. Calcula de dónde viene la amenaza, coloca las patas y salta en dirección contraria
export const Salta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const salto = interpolate(t, [T.salta, T.salta + 0.6], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.en, T.camina], [1, 1.04])}>
        <Mano x={interpolate(t, [T.en, T.salta + 0.6], [160, 420], clamp)} y={840} s={0.8} rot={90} op={0.85} />
        <g opacity={aparece(t, T.calcula)}>
          <line x1={300} y1={840} x2={460} y2={840} stroke={C.red} strokeWidth={10} strokeDasharray="20 14" />
          <Texto x={330} y={760} size={32} color={C.red}>
            amenaza
          </Texto>
        </g>
        <Mosca x={540 + salto * 360} y={840 - salto * 160} s={1.3} rot={90} t={t} vuela={salto > 0.05 ? 1 : 0} />
        <g opacity={aparece(t, T.salta)}>
          <line x1={600} y1={840} x2={860} y2={720} stroke={C.cyan} strokeWidth={10} />
          <path d="M 860 690 L 910 700 L 875 745 Z" fill={C.cyan} />
        </g>
        <Texto x={540} y={1150} size={40} color={C.white} op={aparece(t, T.patas)}>
          coloca las patas…
        </Texto>
        <Texto x={540} y={1230} size={40} color={C.cyan} op={aparece(t, T.salta)}>
          ¡y salta al lado contrario!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.salta} color={C.cyan} />
    </>
  );
};

// G. Camina por el techo con almohadillas peludas y un líquido pegajoso
export const Techo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.almohadillas - 0.3);
  return (
    <Lienzo zoom={interpolate(t, [T.camina, T.para], [1, 1.04])}>
      <rect x={0} y={420} width={1080} height={80} fill="#C8C4D8" />
      <g opacity={1 - zoom} transform={`translate(${interpolate(t, [T.camina, T.almohadillas], [-100, 100], clamp)} 0)`}>
        <g transform="translate(540 600) scale(1 -1)">
          <Mosca x={0} y={0} s={1.3} t={t} />
        </g>
      </g>
      <g opacity={zoom}>
        <rect x={340} y={500} width={400} height={70} rx={30} fill="#4A4A58" />
        {new Array(18).fill(0).map((_, k) => (
          <line key={k} x1={360 + k * 21} y1={500} x2={360 + k * 21} y2={470} stroke="#6A6A78" strokeWidth={5} />
        ))}
        {new Array(8).fill(0).map((_, k) => (
          <circle key={`g${k}`} cx={380 + k * 46} cy={505} r={9} fill={C.yellow} opacity={aparece(t, T.pegajoso)} />
        ))}
        <rect x={500} y={570} width={80} height={300} rx={20} fill="#3A3A48" />
        <Texto x={540} y={1000} size={38} color={C.white}>
          almohadillas peludas
        </Texto>
        <Texto x={540} y={1080} size={36} color={C.yellow} op={aparece(t, T.pegajoso)}>
          + un líquido pegajoso
        </Texto>
      </g>
    </Lienzo>
  );
};

// H. Para atraparla, aplaude un poco por delante: saltará justo hacia tus manos
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cierra = interpolate(t, [T.saltara - 0.2, T.saltara + 0.3], [0, 1], suave);
  const vuela = interpolate(t, [T.saltara - 0.3, T.saltara + 0.2], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.para, T.porEso], [1, 1.05])}>
        <rect x={60} y={500} width={960} height={900} rx={30} fill="#4A3A2A" />
        <Mosca x={540} y={interpolate(vuela, [0, 1], [1150, 760])} s={1.1} t={t} vuela={vuela > 0.05 ? 1 : 0} />
        <g opacity={aparece(t, T.aplaude - 0.4)}>
          <Mano x={interpolate(cierra, [0, 1], [260, 470])} y={760} s={0.85} rot={90} />
          <Mano x={interpolate(cierra, [0, 1], [820, 610])} y={760} s={0.85} rot={-90} />
        </g>
        <Tarjeta x={190} y={1220} w={700} h={130} op={aparece(t, T.aplaude)}>
          <Texto x={540} y={1300} size={38} color={C.yellow}>
            aplaude por delante de ella
          </Texto>
        </Tarjeta>
      </Lienzo>
      <Flash t={t} d={T.saltara + 0.3} color={C.yellow} />
    </>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Manotazo t={t} k={0} q={interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp)} />
    </Lienzo>
  );
};
