import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/ticket/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  bueno: 2.06,
  sin: 3.5,
  final: 5.34,
  papel: 7.1,
  capa: 7.94,
  tinte: 9.78,
  acido: 10.96,
  mientras: 11.76,
  noReac: 12.82,
  cabezal: 13.72,
  puntitos: 15.64,
  calientan: 16.32,
  donde: 18.2,
  derrite: 19.86,
  une: 20.56,
  negro: 22.46,
  punto: 23.12,
  letras: 24.54,
  porEso: 25.22,
  acercas: 25.96,
  entero: 27.16,
  sol: 28.7,
  borran: 30.6,
  porque: 31.1,
  fin: 33.26,
};

const PAPEL = "#F2EFE6";
const TINTA = "#1A1820";

// Ticket con renglones de texto; quemado = 0..1 oscurece todo; tinta = opacidad de las letras
const Ticket: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly lineas?: number;
  readonly quemado?: number;
  readonly tinta?: number;
}> = ({ x, y, s, lineas = 1, quemado = 0, tinta = 1 }) => {
  const filas = [0.8, 0.6, 0.7, 0.5, 0.75, 0.4, 0.65, 0.55];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={`M -170 -300 L 170 -300 L 170 300 ${new Array(12)
          .fill(0)
          .map((_, k) => `L ${170 - (k + 0.5) * 28.3} ${k % 2 ? 300 : 318} `)
          .join("")} L -170 300 Z`}
        fill={PAPEL}
      />
      <text x={0} y={-230} textAnchor="middle" fontSize={34} fontWeight={700} fill={TINTA} fontFamily="JetBrains Mono" opacity={tinta}>
        SUPER 24H
      </text>
      {filas.map((w, k) => (
        <rect
          key={k}
          x={-130}
          y={-170 + k * 50}
          width={260 * w * Math.min(1, Math.max(0, lineas * filas.length - k))}
          height={18}
          rx={4}
          fill={TINTA}
          opacity={tinta}
        />
      ))}
      <text x={-130} y={270} fontSize={36} fontWeight={700} fill={TINTA} fontFamily="JetBrains Mono" opacity={tinta}>
        TOTAL $
      </text>
      <path
        d="M -170 -300 L 170 -300 L 170 318 L -170 318 Z"
        fill="#16120E"
        opacity={quemado}
      />
    </g>
  );
};

// Llama
const Llama: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly op?: number }> = ({
  x,
  y,
  s,
  t,
  op = 1,
}) => {
  const f = 1 + Math.sin(t * 18) * 0.06;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * f})`} opacity={op}>
      <path d="M 0 -150 Q 70 -60 60 10 Q 50 70 0 70 Q -50 70 -60 10 Q -70 -60 0 -150 Z" fill={C.orange} />
      <path d="M 0 -70 Q 35 -20 30 20 Q 25 55 0 55 Q -25 55 -30 20 Q -35 -20 0 -70 Z" fill={C.yellow} />
    </g>
  );
};

// Imagen del gancho y del cierre
const TicketFuego: React.FC<{ readonly t: number; readonly fuego: number }> = ({ t, fuego }) => (
  <>
    <circle cx={540} cy={880} r={360} fill={C.orange} opacity={0.1 * fuego} />
    <Ticket x={540} y={860} s={1.5} />
    <Llama x={830} y={1250} s={1.1} t={t} op={fuego} />
  </>
);

// A. Gancho: tu ticket se imprime con fuego
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.bueno], [1.12, 1])}>
        <TicketFuego t={t} fuego={interpolate(t, [0.9, 1.3], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={1.16} color={C.orange} />
    </>
  );
};

// B. Bueno, con calor, y sin tinta + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.bueno, T.papel], [1, 1.05])}>
      {/* termómetro */}
      <g transform="translate(330 760)">
        <rect x={-34} y={-220} width={68} height={300} rx={34} fill="#2A2440" />
        <rect x={-18} y={80 - 280 * interpolate(t, [T.bueno + 0.3, T.sin], [0.1, 1], clamp)} width={36} height={280 * interpolate(t, [T.bueno + 0.3, T.sin], [0.1, 1], clamp)} rx={18} fill={C.red} />
        <circle cx={0} cy={110} r={60} fill={C.red} />
      </g>
      <Texto x={330} y={1010} size={40} color={C.red}>
        calor
      </Texto>
      <g opacity={aparece(t, T.sin)} transform="translate(750 760)">
        <path d="M 0 -150 Q 100 -10 100 60 Q 100 150 0 150 Q -100 150 -100 60 Q -100 -10 0 -150 Z" fill={TINTA} stroke={C.grey} strokeWidth={8} />
        <line x1={-140} y1={-150} x2={140} y2={170} stroke={C.red} strokeWidth={16} />
      </g>
      <Texto x={750} y={1010} size={40} color={C.grey} op={aparece(t, T.sin)}>
        sin tinta
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1250} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1250}
          width={700 * interpolate(t, [T.final, T.papel], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1350} color={C.white} size={40}>
          cómo se borra: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// Corte del papel: base + capa térmica con tinte (círculos) y ácido (rombos)
const Corte: React.FC<{
  readonly t: number;
  readonly tinte: number;
  readonly acido: number;
  readonly juntar?: number; // 0..1 en la zona caliente
  readonly zona?: [number, number];
}> = ({ t, tinte, acido, juntar = 0, zona = [0, 0] }) => (
  <g>
    <rect x={80} y={900} width={920} height={200} fill={PAPEL} />
    <rect x={80} y={760} width={920} height={140} fill="#D8D4E8" opacity={0.25} />
    {new Array(14).fill(0).map((_, k) => {
      const x = 120 + k * 64 + random(`tx${k}`) * 20;
      const y = 800 + random(`ty${k}`) * 60 + Math.sin(t * 2 + k) * 3;
      const dentro = x > zona[0] && x < zona[1];
      const j = dentro ? juntar : 0;
      const ax = x + 30;
      const ay = 830 + random(`ay${k}`) * 50;
      const mx = (x + ax) / 2;
      const my = (y + ay) / 2;
      return (
        <g key={k}>
          <circle
            cx={interpolate(j, [0, 1], [x, mx])}
            cy={interpolate(j, [0, 1], [y, my])}
            r={16}
            fill={j > 0.8 ? TINTA : "none"}
            stroke={j > 0.8 ? TINTA : C.white}
            strokeWidth={5}
            opacity={tinte}
          />
          <rect
            x={interpolate(j, [0, 1], [ax, mx]) - 10}
            y={interpolate(j, [0, 1], [ay, my]) - 10}
            width={20}
            height={20}
            fill={C.cyan}
            transform={`rotate(45 ${interpolate(j, [0, 1], [ax, mx])} ${interpolate(j, [0, 1], [ay, my])})`}
            opacity={acido * (1 - (j > 0.8 ? 1 : 0))}
          />
        </g>
      );
    })}
  </g>
);

// C. Capa invisible con dos polvos: tinte incoloro y ácido
export const Capa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.papel, T.mientras], [1, 1.04])}>
      <Corte t={t} tinte={aparece(t, T.tinte)} acido={aparece(t, T.acido)} />
      <Texto x={540} y={720} size={36} color={C.white} op={aparece(t, T.capa)}>
        capa térmica
      </Texto>
      <Texto x={540} y={1020} size={34} color={C.grey}>
        papel
      </Texto>
      <g opacity={aparece(t, T.tinte)}>
        <circle cx={260} cy={1230} r={20} fill="none" stroke={C.white} strokeWidth={5} />
        <Texto x={310} y={1243} size={36} color={C.white} anchor="start">
          tinte incoloro
        </Texto>
      </g>
      <g opacity={aparece(t, T.acido)}>
        <rect x={250} y={1300} width={22} height={22} fill={C.cyan} transform="rotate(45 261 1311)" />
        <Texto x={310} y={1323} size={36} color={C.cyan} anchor="start">
          ácido
        </Texto>
      </g>
    </Lienzo>
  );
};

// Copo de nieve
const Copo: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.cyan} strokeWidth={10} strokeLinecap="round">
    {[0, 60, 120].map((a) => (
      <line key={a} x1={0} y1={-60} x2={0} y2={60} transform={`rotate(${a})`} />
    ))}
  </g>
);

// D. Mientras están fríos, no reaccionan
export const Frios: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.mientras, T.cabezal], [1, 1.05])}>
      <Corte t={t} tinte={1} acido={1} />
      <Copo x={540} y={580} s={1.3} />
      <Texto x={540} y={1250} size={42} color={C.cyan} op={aparece(t, T.noReac)}>
        fríos: no reaccionan
      </Texto>
    </Lienzo>
  );
};

// E. El cabezal tiene cientos de puntitos que se calientan en milésimas de segundo
export const Cabezal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const zoom = aparece(t, T.puntitos);
  const avance = (t - T.cabezal) * 120;
  return (
    <Lienzo zoom={interpolate(t, [T.cabezal, T.donde], [1, 1.04])}>
      <rect x={120} y={1000} width={840} height={260} fill={PAPEL} />
      {new Array(6).fill(0).map((_, k) => (
        <rect key={k} x={180} y={1260 - ((avance + k * 50) % 300)} width={300 + random(`l${k}`) * 300} height={16} rx={4} fill={TINTA} opacity={0.85} />
      ))}
      <rect x={100} y={900} width={880} height={100} rx={16} fill="#4A4466" />
      <g opacity={zoom}>
        {new Array(24).fill(0).map((_, k) => {
          const on = t > T.calientan && random(`p${k}${Math.floor(t * 12)}`) > 0.5;
          return <circle key={k} cx={140 + k * 35} cy={985} r={11} fill={on ? C.red : "#2A2640"} />;
        })}
      </g>
      <Texto x={540} y={850} size={40} color={C.white}>
        cabezal térmico
      </Texto>
      <Texto x={540} y={1380} size={38} color={C.red} op={aparece(t, T.calientan)}>
        se calientan en milisegundos
      </Texto>
    </Lienzo>
  );
};

// F. Donde toca el calor la capa se derrite, el ácido se une al tinte y lo vuelve negro
export const Reaccion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const juntar = interpolate(t, [T.une, T.negro + 0.2], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.donde, T.punto], [1, 1.05])}>
        <rect x={380} y={560} width={320} height={110} rx={14} fill="#4A4466" />
        <rect x={400} y={650} width={280} height={20} fill={C.red} opacity={aparece(t, T.donde)} />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M ${460 + k * 80} 690 q 15 25 0 50 q -15 25 0 50`}
            stroke={C.orange}
            strokeWidth={8}
            fill="none"
            opacity={aparece(t, T.donde) * (0.5 + 0.5 * Math.sin(t * 8 + k))}
          />
        ))}
        <rect x={380} y={760} width={320} height={140} fill={C.orange} opacity={0.25 * aparece(t, T.derrite)} />
        <Corte t={t} tinte={1} acido={1} juntar={juntar} zona={[380, 700]} />
        <Texto x={540} y={1230} size={40} color={C.orange} op={aparece(t, T.derrite) * (1 - aparece(t, T.negro))}>
          la capa se derrite
        </Texto>
        <Texto x={540} y={1230} size={42} color={C.white} op={aparece(t, T.negro)}>
          ácido + tinte = negro
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.negro} />
    </>
  );
};

// G. Punto a punto aparecen las letras
const LETRAS: Record<string, string[]> = {
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
};
export const Letras: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const palabra = "TOTAL";
  const total = 35;
  const avance = interpolate(t, [T.punto, T.letras + 0.4], [0, total], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.punto, T.porEso], [1, 1.05])}>
      <rect x={90} y={640} width={900} height={420} rx={10} fill={PAPEL} />
      {palabra.split("").map((ch, i) =>
        LETRAS[ch].map((fila, r) =>
          fila.split("").map((b, c) => {
            const col = i * 7 + c;
            if (b !== "1") return null;
            return (
              <circle
                key={`${i}${r}${c}`}
                cx={136 + col * 24}
                cy={780 + r * 24}
                r={10.5}
                fill={TINTA}
                opacity={col < avance ? 1 : 0}
              />
            );
          }),
        ),
      )}
      <Texto x={540} y={1180} size={40} color={C.white} op={aparece(t, T.letras)}>
        cada letra = muchos puntitos
      </Texto>
    </Lienzo>
  );
};

// Sol
const Sol: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly op: number }> = ({ x, y, t, op }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 20})`} opacity={op}>
    {new Array(10).fill(0).map((_, k) => (
      <line key={k} x1={0} y1={-95} x2={0} y2={-130} stroke={C.yellow} strokeWidth={12} strokeLinecap="round" transform={`rotate(${k * 36})`} />
    ))}
    <circle r={75} fill={C.yellow} />
  </g>
);

// H. Con calor se pone negro entero; con el sol y el tiempo se borra
export const Calor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sol = aparece(t, T.sol);
  const quemado = interpolate(t, [T.acercas + 0.3, T.entero + 0.8], [0, 0.95], clamp) * (1 - sol);
  const tinta = interpolate(t, [T.sol + 0.4, T.borran + 0.3], [1, 0.08], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.porque], [1, 1.05])}>
      <Ticket x={540} y={820} s={1.3} quemado={quemado} tinta={sol > 0.5 ? tinta : 1} />
      <Llama x={540} y={1360} s={0.9} t={t} op={aparece(t, T.acercas) * (1 - sol)} />
      <Sol x={850} y={500} t={t} op={sol} />
      <Texto x={540} y={1340} size={42} color={C.yellow} op={aparece(t, T.borran)}>
        las letras se borran
      </Texto>
    </Lienzo>
  );
};

// I. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque, T.fin + 0.5], [1, 1.12])}>
      <TicketFuego t={t} fuego={1} />
    </Lienzo>
  );
};
