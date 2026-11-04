import { interpolate } from "remotion";
import { CabezaPerfil } from "../components/CabezaPerfil";
import { IconoSabor, Sabor } from "../lengua/Piezas";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Gomita, Interior, Pinza, Pizza } from "./Piezas";

// Instantes clave (s) de public/audio/gripe/narracion.wav (voz x1,1), sacados con Whisper
export const T = {
  cinco: 0,
  dulce: 0,
  salado: 0,
  acido: 0,
  amargo: 0,
  umami: 0,
  nada: 0,
  nariz: 0,
  masticas: 0,
  suben: 0,
  estampilla: 0,
  neuronas: 0,
  cerebro: 0,
  sabor: 0,
  gripe: 0,
  aire: 0,
  lengua2: 0,
  prueba: 0,
  soloDulce: 0,
  destapala: 0,
  fresa: 0,
  mayor: 0,
  olfato: 0,
  poco: 0,
  todo: 0,
  fin: 0,
};

const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

const Texto: React.FC<{ readonly x: number; readonly y: number; readonly children: React.ReactNode; readonly color?: string; readonly op?: number; readonly size?: number }> = ({ x, y, children, color = C.white, op = 1, size = 36 }) => (
  <text x={x} y={y} textAnchor="middle" fill={color} fontFamily={mono} fontSize={size} fontWeight={700} opacity={op}>
    {children}
  </text>
);

// A. Gancho: tu lengua no sabe a pizza
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tacha = interpolate(t, [0.2, 0.6], [0, 1], clamp);
  const flash = interpolate(t, [0.3, 0.38, 0.75], [0, 0.22, 0], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.cinco], [1.06, 1])}>
        <Pizza x={540} y={820} s={2} />
        <g opacity={tacha}>
          <line x1={240} y1={500} x2={840} y2={1140} stroke={C.red} strokeWidth={22} strokeLinecap="round" />
          <line x1={840} y1={500} x2={240} y2={1140} stroke={C.red} strokeWidth={22} strokeLinecap="round" />
        </g>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// B. La lengua solo detecta cinco cosas
const SABORES: [Sabor, keyof typeof T][] = [
  ["dulce", "dulce"],
  ["salado", "salado"],
  ["acido", "acido"],
  ["amargo", "amargo"],
  ["umami", "umami"],
];
export const Cinco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.cinco, T.masticas], [1, 1.04])}>
      <Texto x={540} y={460} color={C.white} size={48} op={aparece(t, T.cinco)}>
        la lengua detecta 5 cosas
      </Texto>
      {SABORES.map(([s, k], i) => (
        <IconoSabor key={s} sabor={s} x={140 + i * 200} y={820} s={1.05} op={aparece(t, T[k])} />
      ))}
      <g opacity={aparece(t, T.nariz)}>
        <Texto x={540} y={1240} color={C.orange} size={44}>
          el resto lo pone la nariz
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Los aromas suben por detrás de la boca hasta la zona olfativa
export const Ruta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.masticas, T.gripe], [1.1, 1.2])} cy={1000}>
      <g transform="translate(-40 0)">
        <CabezaPerfil />
        <Interior t={t} aromas={aparece(t, T.masticas)} zona={aparece(t, T.estampilla)} tapon={0} senal={aparece(t, T.cerebro)} />
      </g>
      <Texto x={540} y={1330} color={C.yellow} size={40} op={aparece(t, T.sabor)}>
        lengua + olfato = sabor
      </Texto>
    </Lienzo>
  );
};

// D. Con gripe, la mucosidad tapa el paso
export const Gripe: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gripe, T.prueba], [1.2, 1.25])} cy={1000}>
      <g transform="translate(-40 0)">
        <CabezaPerfil />
        <Interior t={t} aromas={1} zona={1} tapon={aparece(t, T.gripe + 0.4)} senal={0} />
      </g>
      <g opacity={aparece(t, T.lengua2)}>
        <Texto x={540} y={1330} color={C.grey} size={40}>
          solo: salado, un poco dulce
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. La prueba: nariz tapada, solo dulce; destapada, fresa
export const Prueba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapada = aparece(t, T.prueba + 0.6) * (1 - aparece(t, T.destapala));
  const fresa = aparece(t, T.fresa);
  return (
    <Lienzo zoom={interpolate(t, [T.prueba, T.mayor], [1, 1.04])} cy={1000}>
      <g transform="translate(-120 -60) scale(0.95)">
        <CabezaPerfil />
        <Pinza op={tapada} />
      </g>
      <Gomita x={860} y={800} s={1.4} op={aparece(t, T.prueba + 0.3)} />
      <Texto x={820} y={1080} color={C.grey} size={44} op={aparece(t, T.soloDulce) * (1 - fresa)}>
        solo dulce
      </Texto>
      <g opacity={fresa}>
        <Texto x={820} y={1080} color="#E8414F" size={60}>
          ¡FRESA!
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. La mayor parte del sabor es olfato. Tu nariz sabe a todo.
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nariz = interpolate(t, [T.olfato - 0.4, T.olfato + 1], [0, 0.8], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.mayor, T.fin + 0.5], [1, 1.05])}>
      <Texto x={540} y={460} color={C.white} size={44} op={aparece(t, T.mayor)}>
        ¿de dónde viene el sabor?
      </Texto>
      <rect x={140} y={760} width={800} height={90} rx={20} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
      <rect x={146} y={766} width={788 * (1 - nariz)} height={78} rx={16} fill="#E86A8A" />
      <rect x={146 + 788 * (1 - nariz)} y={766} width={788 * nariz} height={78} rx={16} fill={C.orange} />
      <Texto x={250} y={920} color="#E86A8A" size={36}>
        lengua
      </Texto>
      <Texto x={830} y={920} color={C.orange} size={36} op={aparece(t, T.olfato)}>
        nariz
      </Texto>
      <Texto x={540} y={1180} color={C.grey} size={44} op={aparece(t, T.poco)}>
        la lengua: poco
      </Texto>
      <Texto x={540} y={1260} color={C.yellow} size={52} op={aparece(t, T.todo)}>
        la nariz: todo
      </Texto>
    </Lienzo>
  );
};
