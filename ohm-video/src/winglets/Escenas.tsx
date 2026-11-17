import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/winglets/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  aviones: 2.18, // aviones
  alas: 3.60, // alas
  decoracion: 5.50, // decoracion
  final: 6.58, // final
  ala: 9.18, // ala
  presion: 10.64, // presion
  mayor: 11.64, // mayor
  punta: 13.14, // punta
  escapa: 14.60, // escapa
  vuelta: 16.14, // vuelta
  remolino: 17.94, // remolino
  vortice: 20.46, // vortice
  roba: 22.78, // roba
  frena: 23.88, // frena
  winglet: 25.14, // winglet
  barrera: 25.94, // barrera
  dificulta: 26.68, // dificulta
  debil: 29.50, // debil
  resistencia: 30.48, // resistencia
  gasta: 31.68, // gasta
  cinco: 32.50, // cinco
  paraEso: 34.68, // para
  fin: 36.32, // FIN
};

const FUS = "#E8E8EE";

// Avión de frente; winglet 0..1
const AvionFrente: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly winglet?: number }> = ({ x, y, s = 1, winglet = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -480 20 L -60 -10 L 60 -10 L 480 20 L 480 34 L 60 30 L -60 30 L -480 34 Z" fill="#C8C8D4" />
    <g opacity={winglet}>
      <path d="M 470 22 L 500 -70 L 512 -70 L 490 30 Z" fill="#C8C8D4" />
      <path d="M -470 22 L -500 -70 L -512 -70 L -490 30 Z" fill="#C8C8D4" />
    </g>
    <circle cx={0} cy={0} r={80} fill={FUS} />
    <circle cx={0} cy={-10} r={50} fill="#1A2A3A" opacity={0.5} />
    <circle cx={-200} cy={60} r={42} fill="#9A9AA8" />
    <circle cx={200} cy={60} r={42} fill="#9A9AA8" />
    <circle cx={-200} cy={60} r={26} fill="#3A3A44" />
    <circle cx={200} cy={60} r={26} fill="#3A3A44" />
    <path d="M -10 -80 L 0 -200 L 10 -80 Z" fill={FUS} />
  </g>
);

// Vórtice de punta de ala (espiral) en (x,y); fuerza 0..1
const Vortice: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly fuerza: number; readonly dir?: number }> = ({ x, y, t, fuerza, dir = 1 }) => (
  <g opacity={Math.min(1, fuerza * 1.2)}>
    <path
      d={new Array(60)
        .fill(0)
        .map((_, i) => {
          const a = dir * (i * 0.25 + t * 4);
          const r = 8 + i * 2.2 * fuerza;
          return `${i ? "L" : "M"} ${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`;
        })
        .join(" ")}
      stroke={C.cyan}
      strokeWidth={5}
      fill="none"
    />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <g transform="translate(540 1000) scale(2.6)">
      <path d="M -260 20 L 120 0 L 140 6 L 160 -150 L 180 -150 L 170 30 L -260 40 Z" fill="#C8C8D4" />
    </g>
    <Texto x={300} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
    {void t}
  </>
);

// A. Gancho: ¿para qué es esta punta doblada?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.aviones], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Muchos aviones llevan la punta del ala doblada hacia arriba; no es decoración + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.aviones, T.ala], [1, 1.04])}>
      <AvionFrente x={540} y={960} s={1} winglet={1} />
      <circle cx={1020} cy={900} r={70} fill="none" stroke={C.yellow} strokeWidth={6} opacity={aparece(t, T.alas)} />
      <circle cx={60} cy={900} r={70} fill="none" stroke={C.yellow} strokeWidth={6} opacity={aparece(t, T.alas)} />
      <Texto x={540} y={1250} size={40} color={C.white} op={aparece(t, T.decoracion)}>
        no es decoración
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuánto combustible ahorran?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.ala], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Abajo la presión es mayor que arriba; en la punta, el aire de abajo da la vuelta hacia arriba
export const Presion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const vuelta = aparece(t, T.escapa);
  return (
    <Lienzo zoom={interpolate(t, [T.ala, T.remolino], [1, 1.04])}>
      <path d="M 60 940 L 860 920 L 880 930 L 860 950 L 60 960 Z" fill="#C8C8D4" />
      <g opacity={aparece(t, T.presion)}>
        <Texto x={400} y={830} size={80} color={C.cyan}>
          −
        </Texto>
        <Texto x={400} y={1110} size={80} color={C.red}>
          +
        </Texto>
        <Texto x={400} y={760} size={32} color={C.cyan}>
          presión baja
        </Texto>
        <Texto x={400} y={1190} size={32} color={C.red} op={aparece(t, T.mayor)}>
          presión alta
        </Texto>
      </g>
      <g opacity={vuelta}>
        {[0, 1, 2].map((k) => {
          const u = (t * 0.7 + k / 3) % 1;
          const a = Math.PI / 2 - u * Math.PI * 1.3;
          return <circle key={k} cx={870 + Math.cos(a) * 100} cy={940 + Math.sin(a) * 100} r={14} fill={C.cyan} />;
        })}
        <path d="M 820 1060 A 120 120 0 1 0 820 820" stroke={C.cyan} strokeWidth={6} fill="none" strokeDasharray="14 10" />
        <Texto x={760} y={1260} size={36} color={C.cyan} op={aparece(t, T.vuelta)}>
          da la vuelta al borde
        </Texto>
      </g>
    </Lienzo>
  );
};

// D. Se forma un remolino gigante detrás de cada punta: el vórtice; roba energía y frena
export const Remolino: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.remolino, T.winglet], [1, 1.04])}>
        <AvionFrente x={540} y={960} s={0.9} winglet={0} />
        <Vortice x={980} y={980} t={t} fuerza={aparece(t, T.remolino)} />
        <Vortice x={100} y={980} t={t} fuerza={aparece(t, T.remolino)} dir={-1} />
        <Texto x={540} y={600} size={42} color={C.cyan} op={aparece(t, T.vortice)}>
          vórtice de punta de ala
        </Texto>
        <g opacity={aparece(t, T.roba)}>
          <Texto x={540} y={1300} size={40} color={C.red}>
            roba energía
          </Texto>
        </g>
        <Texto x={540} y={1380} size={40} color={C.red} op={aparece(t, T.frena)}>
          frena al avión
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.vortice} color={C.cyan} />
    </>
  );
};

// E. El winglet es una barrera: dificulta que el aire dé la vuelta y debilita el remolino
export const Winglet: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const w = aparece(t, T.winglet);
  const fuerza = 1 - 0.55 * interpolate(t, [T.dificulta, T.debil + 0.4], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.winglet, T.resistencia], [1, 1.04])}>
        <AvionFrente x={540} y={960} s={0.9} winglet={w} />
        <Vortice x={1000} y={930} t={t} fuerza={fuerza} />
        <Vortice x={80} y={930} t={t} fuerza={fuerza} dir={-1} />
        <Texto x={540} y={600} size={44} color={C.yellow} op={aparece(t, T.barrera)}>
          winglet = barrera
        </Texto>
        <Texto x={540} y={1300} size={40} color={C.cyan} op={aparece(t, T.debil)}>
          remolino más débil
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.winglet} color={C.yellow} />
    </>
  );
};

// F. Menos resistencia: hasta un 5% menos de combustible
export const Ahorro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = 1 - 0.05 * aparece(t, T.cinco);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.resistencia, T.paraEso], [1, 1.04])}>
        <rect x={340} y={700} width={400} height={520} rx={30} fill="#2A2440" stroke="#5A5A66" strokeWidth={8} />
        <rect x={360} y={720 + 480 * (1 - nivel)} width={360} height={480 * nivel} rx={20} fill={C.orange} opacity={aparece(t, T.gasta)} />
        <Texto x={540} y={640} size={38} color={C.white} op={aparece(t, T.resistencia)}>
          menos resistencia
        </Texto>
        <Texto x={540} y={1340} size={50} color={C.yellow} op={aparece(t, T.cinco)}>
          hasta −5 % de combustible
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.cinco} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.paraEso, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
