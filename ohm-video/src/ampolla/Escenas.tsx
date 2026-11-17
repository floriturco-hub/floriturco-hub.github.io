import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/ampolla/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  zapatos: 1.94, // zapatos
  rozan: 2.76, // rozan
  burbuja: 4.72, // burbuja
  final: 6.52, // final
  piel: 9.32, // piel
  capas: 10.12, // capas
  roce: 11.12, // roce
  arrastra: 12.10, // arrastra
  separan: 14.20, // separan
  hueco: 15.20, // hueco
  transparente: 16.44, // transparente
  tejidos: 17.80, // tejidos
  vendaje: 20.18, // vendaje
  techo: 21.60, // techo
  esteril: 24.48, // esteril
  revientas: 25.54, // revientas
  bacterias: 27.22, // bacterias
  herida: 28.38, // herida
  grande: 30.36, // grande
  aguja: 32.44, // aguja
  lugar: 35.10, // lugar
  porEso: 35.74, // por
  fin: 37.08, // FIN
};

const PIEL = "#E0A888";
const LIQ = "#D8F0FF";

// Talón visto de lado con ampolla (tam 0..1)
const Talon: React.FC<{ readonly x: number; readonly y: number; readonly tam: number; readonly s?: number }> = ({ x, y, tam, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 -400 L -60 -400 L -60 -80 Q -60 120 160 120 L 300 120 L 300 200 L -160 200 Q -300 200 -300 0 Z" fill={PIEL} />
    <ellipse cx={-280} cy={0} rx={40 * tam} ry={70 * tam} fill={LIQ} stroke="#fff" strokeWidth={4} opacity={tam > 0 ? 0.95 : 0} />
  </g>
);

const Zapato: React.FC<{ readonly x: number; readonly y: number; readonly dx: number; readonly s?: number }> = ({ x, y, dx, s = 1 }) => (
  <g transform={`translate(${x + dx} ${y}) scale(${s})`}>
    <path d="M -340 -150 L -260 -150 L -260 120 L 340 120 L 340 230 L -360 230 Q -380 40 -340 -150 Z" fill="#4A3A6A" opacity={0.85} />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ q }) => (
  <>
    <Talon x={600} y={1000} tam={1} s={1.2} />
    <Texto x={300} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué sale esta burbuja?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.zapatos], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Unos zapatos nuevos rozan todo el día y aparece una burbuja + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roza = aparece(t, T.rozan) * (1 - aparece(t, T.burbuja));
  return (
    <Lienzo zoom={interpolate(t, [T.zapatos, T.piel], [1, 1.04])}>
      <Talon x={600} y={1000} tam={interpolate(t, [T.burbuja - 0.3, T.burbuja + 0.5], [0, 1], clamp)} s={1.2} />
      <Zapato x={600} y={1000} dx={roza * 20 * Math.sin(t * 14)} s={1.2} />
      <Texto x={540} y={1400} size={40} color={C.white} op={aparece(t, T.rozan) * (1 - aparece(t, T.burbuja))}>
        roce, roce, roce…
      </Texto>
      <Texto x={540} y={1400} size={42} color={LIQ} op={aparece(t, T.burbuja)}>
        una burbuja de líquido
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuándo sí drenarla?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.piel], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// Corte de piel: capa superior (techo) que se separa; sep 0..1; liq 0..1
const Corte: React.FC<{ readonly t: number; readonly sep: number; readonly liq: number; readonly roto?: number; readonly flechas?: number }> = ({ t, sep, liq, roto = 0, flechas = 0 }) => {
  const h = 160 * sep;
  const techo = `M 140 ${760 - h * 0.2} Q 540 ${760 - h} 940 ${760 - h * 0.2}`;
  return (
    <g>
      <rect x={140} y={900} width={800} height={500} fill="#D88A7A" />
      <rect x={140} y={820} width={800} height={80} fill="#F0B8A0" />
      {liq > 0 ? <path d={`M 160 ${820} Q 540 ${820 - h * 0.95} 920 820 Z`} fill={LIQ} opacity={liq * (1 - roto)} /> : null}
      <path d={roto > 0 ? `M 140 760 L 440 760 M 640 ${760 - h * 0.6} Q 800 ${760 - h * 0.4} 940 760` : techo} stroke="#E8B898" strokeWidth={60} fill="none" strokeLinecap="round" />
      {flechas > 0
        ? [300, 540, 780].map((x, k) => {
            const u = (t * 0.8 + k / 3) % 1;
            return <path key={x} d={`M ${x} ${1200 - u * 300} l 0 -40 m -14 14 l 14 -14 l 14 14`} stroke={LIQ} strokeWidth={8} fill="none" opacity={flechas * (1 - u)} />;
          })
        : null}
    </g>
  );
};

// C. La piel tiene capas; el roce las arrastra en sentidos distintos hasta que se separan
export const Capas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sep = interpolate(t, [T.separan - 0.4, T.separan + 0.5], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.piel, T.hueco], [1, 1.04])}>
      <Corte t={t} sep={sep} liq={0} />
      <Texto x={540} y={1460} size={38} color={C.white} op={aparece(t, T.capas)}>
        capas de piel
      </Texto>
      <g opacity={aparece(t, T.arrastra) * (1 - sep)}>
        <path d={`M ${400 + 30 * Math.sin(t * 10)} 680 l 200 0 m -30 -20 l 30 20 l -30 20`} stroke={C.yellow} strokeWidth={10} fill="none" />
        <path d={`M ${680 - 30 * Math.sin(t * 10)} 1000 l -200 0 m 30 -20 l -30 20 l 30 20`} stroke={C.yellow} strokeWidth={10} fill="none" />
      </g>
      <Texto x={540} y={560} size={42} color={C.yellow} op={sep}>
        ¡se separan!
      </Texto>
    </Lienzo>
  );
};

// D. El hueco se llena de líquido transparente que sale de los tejidos de alrededor
export const Liquido: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.hueco, T.vendaje], [1, 1.04])}>
      <Corte t={t} sep={1} liq={interpolate(t, [T.hueco, T.transparente + 0.5], [0.1, 1], clamp)} flechas={aparece(t, T.tejidos)} />
      <Texto x={540} y={560} size={40} color={LIQ} op={aparece(t, T.transparente)}>
        líquido transparente
      </Texto>
      <Texto x={540} y={1460} size={36} color={C.white} op={aparece(t, T.tejidos)}>
        sale de los tejidos de alrededor
      </Texto>
    </Lienzo>
  );
};

// E. Es un vendaje natural: el techo protege la piel nueva y el líquido es estéril
export const Vendaje: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.vendaje, T.revientas], [1, 1.04])}>
        <Corte t={t} sep={1} liq={1} />
        <Texto x={540} y={560} size={46} color={C.yellow} op={aparece(t, T.vendaje)}>
          vendaje natural
        </Texto>
        <Texto x={760} y={640} size={34} color="#E8B898" op={aparece(t, T.techo)}>
          techo
        </Texto>
        <Texto x={540} y={1460} size={34} color="#F0B8A0" op={aparece(t, T.techo)}>
          protege la piel nueva
        </Texto>
        <Texto x={540} y={760} size={34} color="#3A6A8A" op={aparece(t, T.esteril)}>
          estéril
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.vendaje} color={C.yellow} />
    </>
  );
};

// F. Si la revientas, entran bacterias y queda en carne viva
export const Revienta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const roto = t > T.revientas + 0.3 ? 1 : 0;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.revientas, T.grande], [1, 1.04])}>
        <Corte t={t} sep={1} liq={1} roto={roto} />
        <g opacity={aparece(t, T.bacterias)}>
          {new Array(7).fill(0).map((_, k) => {
            const u = (t * 0.3 + k / 7) % 1;
            return (
              <g key={k} transform={`translate(${300 + k * 80 + 10 * Math.sin(t * 3 + k)} ${560 + u * 240}) rotate(${k * 40})`}>
                <rect x={-30} y={-12} width={60} height={24} rx={12} fill="#9AC84A" />
              </g>
            );
          })}
        </g>
        <Texto x={540} y={1460} size={40} color={C.red} op={aparece(t, T.herida)}>
          herida en carne viva
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.revientas} color={C.red} />
    </>
  );
};

// G. Solo si es grande y duele mucho: aguja esterilizada en el borde, dejando el techo
export const Drenar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = interpolate(t, [T.aguja + 0.4, T.lugar], [1, 0.35], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.grande, T.porEso], [1, 1.04])}>
      <Corte t={t} sep={sale} liq={1} />
      <g opacity={aparece(t, T.aguja)}>
        <line x1={980} y1={600} x2={890} y2={760} stroke="#C8C8D4" strokeWidth={8} />
        <rect x={960} y={520} width={60} height={110} rx={10} fill="#E8E8EE" transform="rotate(30 990 575)" />
      </g>
      <Texto x={540} y={560} size={38} color={C.white} op={aparece(t, T.grande)}>
        solo si es grande y duele
      </Texto>
      <Texto x={540} y={1460} size={38} color="#5AD08A" op={aparece(t, T.lugar)}>
        el techo se queda en su lugar ✓
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
