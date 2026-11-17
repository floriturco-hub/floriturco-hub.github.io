import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/proximidad/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  llamas: 2.06, // llamas
  oreja: 3.28, // oreja
  apaga: 4.58, // apaga
  final: 5.70, // final
  junto: 8.16, // junto
  sensor: 9.74, // sensor
  dispara: 11.22, // dispara
  infrarroja: 12.18, // infrarroja
  mide: 14.40, // mide
  rebota: 15.30, // rebota
  lejos: 16.52, // lejos
  nada: 17.68, // nada
  cuando: 18.90, // cuando
  piel: 21.00, // piel
  mucha: 21.82, // mucha
  limite: 23.22, // limite
  apaga2: 24.40, // apaga
  bloquea: 25.52, // bloquea
  mejilla: 27.00, // mejilla
  si: 27.78, // si
  protector: 28.40, // protector
  tapan: 29.66, // tapan
  tiempo: 31.96, // tiempo
  negra: 33.50, // negra
  asi: 34.16, // asi
  fin: 35.92, // FIN
};

const IR = "#FF5A6A";
const PIEL = "#E8B48A";

// Celular de frente: pantalla encendida (luz), llamada en curso
const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly luz: number; readonly sucio?: number }> = ({ x, y, s, luz, sucio = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-190} y={-370} width={380} height={740} rx={50} fill="#2A2640" stroke="#5A5478" strokeWidth={8} />
    <rect x={-165} y={-300} width={330} height={600} rx={20} fill="#000" />
    <g opacity={luz}>
      <rect x={-165} y={-300} width={330} height={600} rx={20} fill="#1C3A3A" />
      <circle cx={0} cy={-120} r={70} fill="#5A5478" />
      <Texto x={0} y={0} size={34} color={C.white}>
        llamando...
      </Texto>
      <circle cx={0} cy={200} r={50} fill={C.red} />
    </g>
    <rect x={-40} y={-345} width={80} height={12} rx={6} fill="#141030" />
    <circle cx={-80} cy={-339} r={9} fill="#3A1A2A" />
    <circle cx={80} cy={-339} r={9} fill="#141030" />
    <ellipse cx={-80} cy={-339} rx={50} ry={24} fill="#C8B898" opacity={sucio * 0.85} />
  </g>
);

// Vista lateral: celular (borde) a la izquierda y cabeza que se acerca (d = distancia en px); pulsos IR
const Lateral: React.FC<{ readonly t: number; readonly d: number; readonly pulsos: number; readonly vuelta: number; readonly tapa?: number }> = ({
  t,
  d,
  pulsos,
  vuelta,
  tapa = 0,
}) => {
  const x0 = 260;
  const xc = x0 + d;
  return (
    <g>
      <rect x={200} y={560} width={60} height={760} rx={20} fill="#2A2640" stroke="#5A5478" strokeWidth={6} />
      <circle cx={262} cy={640} r={10} fill={IR} />
      <rect x={258} y={600} width={14 * tapa} height={90} fill="#C8B898" opacity={tapa} />
      {/* cabeza de perfil */}
      <g transform={`translate(${xc} 0)`}>
        <path d="M 40 520 Q -20 560 0 700 Q 10 760 -10 820 Q 0 860 40 880 L 40 1150 L 500 1150 L 500 520 Z" fill={PIEL} />
        <path d="M 70 620 q -50 20 -40 70 q 10 40 50 30" stroke="#C88A6A" strokeWidth={14} fill="none" />
      </g>
      {new Array(4).fill(0).map((_, k) => {
        const u = (t * 1.5 + k / 4) % 1;
        const ida = u < 0.5;
        const xr = ida ? 270 + (u / 0.5) * (tapa ? 10 : d - 30) : 270 + ((1 - u) / 0.5) * (tapa ? 10 : d - 30);
        return (
          <path
            key={k}
            d={`M ${xr} 590 q ${ida ? 30 : -30} 50 0 100`}
            stroke={IR}
            strokeWidth={9}
            fill="none"
            opacity={pulsos * (ida ? 1 : vuelta)}
          />
        );
      })}
    </g>
  );
};

// Medidor de luz recibida con umbral
const Medidor: React.FC<{ readonly v: number; readonly op: number; readonly umbral?: number }> = ({ v, op, umbral = 0 }) => (
  <g opacity={op}>
    <rect x={190} y={1380} width={700} height={44} rx={22} fill="#2A2440" />
    <rect x={190} y={1380} width={700 * v} height={44} rx={22} fill={v > 0.6 ? IR : C.cyan} />
    <line x1={190 + 700 * 0.6} y1={1360} x2={190 + 700 * 0.6} y2={1444} stroke={C.yellow} strokeWidth={6} opacity={umbral} />
    <Texto x={540} y={1490} size={30} color={C.grey}>
      luz que vuelve
    </Texto>
  </g>
);

const Inicio: React.FC<{ readonly q: number }> = ({ q }) => (
  <>
    <Celular x={540} y={960} s={1.1} luz={0} />
    <Texto x={860} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿cómo sabe tu celular que lo acercas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.llamas], [1.12, 1])}>
        <Inicio q={q} />
      </Lienzo>
      <Flash t={t} d={0.7} color={IR} />
    </>
  );
};

// B. Llamas, lo pegas a la oreja y la pantalla se apaga + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lado = aparece(t, T.oreja);
  return (
    <Lienzo zoom={interpolate(t, [T.llamas, T.junto], [1, 1.04])}>
      <g opacity={1 - lado}>
        <Celular x={540} y={900} s={0.95} luz={1} />
      </g>
      <g opacity={lado}>
        <Lateral t={t} d={interpolate(t, [T.oreja, T.apaga], [500, 40], clamp)} pulsos={0} vuelta={0} />
        <Texto x={540} y={500} size={40} color={C.white} op={aparece(t, T.apaga)}>
          pantalla: apagada
        </Texto>
      </g>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1330} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1330}
          width={700 * interpolate(t, [T.final, T.junto], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1430} color={C.white} size={38}>
          por qué a veces se queda negra
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Junto a la cámara hay un sensor de proximidad
export const Sensor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.junto, T.dispara], [1, 2.2])} cy={600}>
      <Celular x={540} y={960} s={1.1} luz={1} />
      <g opacity={aparece(t, T.sensor)}>
        <circle cx={452} cy={587} r={22} fill="none" stroke={C.yellow} strokeWidth={4} />
        <Texto x={452} y={545} size={18} color={C.yellow}>
          sensor
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Dispara pulsos infrarrojos y mide cuánta luz rebota: lejos casi nada, cerca mucha
export const Pulsos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const d = interpolate(t, [T.cuando, T.piel], [560, 60], clamp);
  const v = interpolate(d, [60, 560], [0.85, 0.08], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.dispara, T.limite], [1, 1.04])}>
        <Lateral t={t} d={d} pulsos={aparece(t, T.dispara)} vuelta={aparece(t, T.rebota) * (0.2 + 0.8 * aparece(t, T.piel))} />
        <Texto x={540} y={500} size={36} color={IR} op={aparece(t, T.infrarroja)}>
          pulsos infrarrojos
        </Texto>
        <Medidor v={aparece(t, T.mide) * v} op={aparece(t, T.mide)} />
        <Texto x={760} y={1260} size={34} color={C.white} op={aparece(t, T.lejos) * (1 - aparece(t, T.cuando))}>
          lejos: casi nada
        </Texto>
        <Texto x={760} y={1260} size={34} color={IR} op={aparece(t, T.mucha)}>
          cerca: mucha
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.mucha} color={IR} />
    </>
  );
};

// E. Al pasar el límite, apaga la pantalla y bloquea el tacto
export const Limite: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const apaga = aparece(t, T.apaga2);
  return (
    <Lienzo zoom={interpolate(t, [T.limite, T.si], [1, 1.04])}>
      <Celular x={540} y={860} s={0.9} luz={1 - apaga} />
      <g opacity={aparece(t, T.bloquea)} transform="translate(540 860)">
        <rect x={-60} y={-30} width={120} height={100} rx={16} fill={C.yellow} />
        <path d="M -36 -30 L -36 -70 A 36 36 0 0 1 36 -70 L 36 -30" stroke={C.yellow} strokeWidth={16} fill="none" />
      </g>
      <Medidor v={0.85} op={1} umbral={aparece(t, T.limite)} />
      <Texto x={540} y={1300} size={34} color={C.white} op={aparece(t, T.mejilla)}>
        tu mejilla no cuelga
      </Texto>
    </Lienzo>
  );
};

// F. Si un protector o la suciedad tapan el sensor, la pantalla se queda negra
export const Sucio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapa = aparece(t, T.tapan);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.si, T.asi], [1, 1.04])}>
        <g opacity={1 - aparece(t, T.tiempo)}>
          <Celular x={540} y={860} s={0.9} luz={1 - tapa} sucio={aparece(t, T.protector)} />
        </g>
        <g opacity={aparece(t, T.tiempo)}>
          <Lateral t={t} d={600} pulsos={1} vuelta={1} tapa={1} />
        </g>
        <Medidor v={0.1 + 0.8 * tapa} op={1} umbral={1} />
        <Texto x={540} y={1300} size={38} color={C.red} op={aparece(t, T.negra)}>
          pantalla negra
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.negra} color={C.red} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.fin + 0.5], [1, 1.12])}>
      <Inicio q={q} />
    </Lienzo>
  );
};
