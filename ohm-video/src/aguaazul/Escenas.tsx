import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/aguaazul/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  vaso: 2.28, // vaso
  mar: 4.04, // mar
  glaciar: 5.48, // glaciar
  nublado: 8.36, // nublado
  final: 9.36, // final
  sol: 13.32, // sol
  colores: 14.56, // colores
  absorbe: 15.74, // absorbe
  rojo: 16.82, // rojo
  vibran: 18.06, // vibran
  vaso2: 20.54, // vaso
  metros: 24.58, // metros
  apagando: 26.85, // apagando
  regresa: 28.00, // regresa
  congelador: 30.50, // congelador
  burbujas: 31.86, // burbujas
  blanco: 35.00, // blanco
  porEso: 35.74, // por
  fin: 37.46, // FIN
};

const TURQ = "#3AC8D8";
const ESPECTRO = ["#E04848", "#E88A3A", "#F0D048", "#5AD08A", "#3AB8E8", "#4A6AE0"];

// Bloque de hielo de glaciar (azul) con grietas
const Glaciar: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly blanco?: number }> = ({ x, y, s = 1, blanco = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 200 L -260 -120 L -120 -220 L 60 -180 L 220 -240 L 300 -60 L 280 200 Z" fill={blanco ? "#E8F0F8" : TURQ} />
    <path d="M -300 200 L -260 -120 L -120 -220 L 60 -180 L 220 -240 L 300 -60 L 280 200 Z" fill="#1A5A88" opacity={blanco ? 0 : 0.35} />
    <path d="M -120 -220 L -60 40 L -100 200 M 60 -180 L 90 0 M 220 -240 L 180 60" stroke="#E8F8FF" strokeWidth={5} fill="none" opacity={0.7} />
  </g>
);

const Vaso: React.FC<{ readonly x: number; readonly y: number; readonly s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 -150 L 90 -150 L 75 150 L -75 150 Z" fill="#DDEEFF" opacity={0.18} stroke="#DDEEFF" strokeWidth={5} />
    <path d="M -85 -80 L 85 -80 L 75 150 L -75 150 Z" fill="#DDEEFF" opacity={0.12} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <rect x={0} y={1250} width={1080} height={400} fill="#0E4A6A" />
    <Glaciar x={540} y={1050} s={1.3 + 0.01 * Math.sin(t)} />
    <Texto x={880} y={620} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este hielo es azul?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.vaso], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. El vaso no tiene color; el mar profundo y el glaciar son turquesa, aunque esté nublado + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.vaso, T.sol], [1, 1.04])}>
      <Vaso x={240} y={1000} />
      <Texto x={240} y={1220} size={32} color={C.white}>
        vaso: sin color
      </Texto>
      <g opacity={aparece(t, T.mar)}>
        <rect x={430} y={850} width={560} height={300} rx={20} fill="#0E5A80" />
        <path d="M 430 870 q 70 -30 140 0 t 140 0 t 140 0 t 140 0" stroke={TURQ} strokeWidth={8} fill="none" />
        <Texto x={710} y={1220} size={32} color={TURQ}>
          mar profundo
        </Texto>
      </g>
      <g opacity={aparece(t, T.glaciar)}>
        <Glaciar x={710} y={1400} s={0.45} />
      </g>
      <g opacity={aparece(t, T.nublado)}>
        {[0, 1, 2].map((k) => (
          <ellipse key={k} cx={300 + k * 230} cy={700} rx={130} ry={50} fill="#6A7280" opacity={0.8} />
        ))}
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿y el hielo de tu congelador?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.sol], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. La luz trae todos los colores; el agua absorbe un poco del rojo: sus moléculas vibran
export const Absorbe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ab = aparece(t, T.rojo);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.sol, T.vaso2], [1, 1.04])}>
        <circle cx={180} cy={700} r={70} fill={C.yellow} />
        {ESPECTRO.map((c, k) => (
          <rect key={c} x={180 + k * 120} y={880} width={110} height={70} rx={10} fill={c} opacity={aparece(t, T.colores) * (k === 0 ? 1 - 0.7 * ab : 1)} />
        ))}
        <Texto x={540} y={1010} size={34} color={C.white} op={aparece(t, T.colores)}>
          la luz trae todos los colores
        </Texto>
        {/* molécula de agua vibrando */}
        <g transform="translate(540 1260)" opacity={aparece(t, T.absorbe)}>
          <circle cx={0} cy={0} r={50} fill="#E04848" opacity={0.8} />
          {[-1, 1].map((d) => {
            const v = aparece(t, T.vibran) * 14 * Math.sin(t * 30);
            return <circle key={d} cx={d * (90 + v)} cy={60} r={32} fill="#E8E8F0" />;
          })}
        </g>
        <Texto x={540} y={1440} size={38} color={C.yellow} op={ab}>
          el agua absorbe un poco del rojo
        </Texto>
        <Texto x={540} y={1510} size={32} color={C.white} op={aparece(t, T.vibran)}>
          sus moléculas vibran con esa energía
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.absorbe} color={C.white} />
    </>
  );
};

// D. En un vaso, unos centímetros: casi nada. En metros, el rojo se apaga y regresa azul
export const Profundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const prof = aparece(t, T.metros);
  const apaga = interpolate(t, [T.apagando, T.regresa + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.vaso2, T.congelador], [1, 1.04])}>
      <g opacity={1 - prof}>
        <Vaso x={540} y={1000} s={1.2} />
        {ESPECTRO.map((c, k) => (
          <rect key={c} x={500 + k * 14} y={760} width={10} height={500} fill={c} opacity={0.8} />
        ))}
        <Texto x={540} y={1330} size={36} color={C.white}>
          unos centímetros: casi no pierde nada
        </Texto>
      </g>
      <g opacity={prof}>
        <rect x={140} y={640} width={800} height={900} fill="#0B3A5A" />
        {ESPECTRO.map((c, k) => {
          const largo = k <= 1 ? 900 * (1 - 0.8 * apaga) * (k === 0 ? 0.6 : 0.85) : k === 2 ? 900 * (1 - 0.4 * apaga) : 900;
          return <rect key={c} x={400 + k * 40} y={640} width={30} height={largo} fill={c} opacity={0.75} />;
        })}
        <path d="M 760 1500 L 760 700" stroke={TURQ} strokeWidth={14} opacity={aparece(t, T.regresa)} />
        <path d="M 735 730 L 760 680 L 785 730 Z" fill={TURQ} opacity={aparece(t, T.regresa)} />
        <Texto x={540} y={600} size={40} color={C.white}>
          metros de agua o de hielo
        </Texto>
        <Texto x={540} y={1610} size={38} color={TURQ} op={aparece(t, T.regresa)}>
          lo que regresa es azul
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. El hielo del congelador tiene burbujas que reflejan todos los colores: blanco
export const Burbujas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.congelador, T.porEso], [1, 1.04])}>
        <rect x={340} y={760} width={400} height={400} rx={40} fill="#E8F0F8" opacity={0.9} />
        {new Array(30).fill(0).map((_, k) => (
          <circle key={k} cx={380 + ((k * 73) % 320)} cy={800 + ((k * 131) % 320)} r={6 + (k % 4) * 4} fill="#FFFFFF" stroke="#B8C8D8" strokeWidth={2} opacity={aparece(t, T.burbujas)} />
        ))}
        {ESPECTRO.map((c, k) => (
          <line key={c} x1={540} y1={960} x2={540 + Math.cos(k * 1.05) * 330} y2={960 + Math.sin(k * 1.05) * 330} stroke={c} strokeWidth={6} opacity={aparece(t, T.burbujas) * 0.7} />
        ))}
        <Texto x={540} y={640} size={40} color={C.white} op={aparece(t, T.congelador)}>
          hielo del congelador
        </Texto>
        <Texto x={540} y={1360} size={36} color={C.white} op={aparece(t, T.burbujas)}>
          burbujas que reflejan todos los colores
        </Texto>
        <Texto x={540} y={1440} size={48} color="#E8F0F8" op={aparece(t, T.blanco)}>
          = blanco
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.burbujas} color={C.white} />
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
