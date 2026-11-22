import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/basalto/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  calzada: 1.98, // calzada
  hexagonales: 4.54, // hexag
  regla: 6.12, // regla
  final: 7.02, // final
  cocina: 8.44, // cocina
  lava: 10.36, // lava
  enfriarse: 12.00, // enfriarse
  encoge: 14.46, // encoge
  agrieta: 17.50, // agrieta
  angulos: 19.66, // ang
  tension: 23.22, // tensi
  hexagonos: 24.54, // hex
  frio: 26.12, // fr
  forman: 28.82, // forman
  fecula: 30.34, // fecula
  lampara: 32.56, // lampara
  miniatura: 34.02, // miniatura
  nadie: 34.88, // nadie
  fin: 36.40, // FIN
};

const ROCA = "#4A4E5A";
const ROCA2 = "#6A6E7A";
const LAVA = "#E8602A";

const hex = (cx: number, cy: number, r: number) =>
  new Array(6)
    .fill(0)
    .map((_, k) => {
      const a = (Math.PI / 3) * k;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a) * 0.5}`;
    })
    .join(" ");

// Columnas hexagonales en perspectiva (vista lateral 3/4)
const Columnas: React.FC<{ readonly t: number; readonly crece?: number }> = ({ crece = 1 }) => {
  const cols: React.ReactNode[] = [];
  const r = 70;
  for (let fila = 0; fila < 4; fila++) {
    for (let c = 0; c < 6; c++) {
      const cx = 180 + c * 150 + (fila % 2) * 75;
      const base = 1450 - fila * 50;
      const h = (180 + ((c * 7 + fila * 13) % 5) * 60) * crece;
      const top = base - h;
      cols.push(
        <g key={`${fila}-${c}`}>
          <rect x={cx - r} y={top} width={2 * r} height={h} fill={fila % 2 ? ROCA : ROCA2} />
          <line x1={cx} y1={top + r * 0.5} x2={cx} y2={base} stroke="#2A2E38" strokeWidth={3} />
          <polygon points={hex(cx, top, r)} fill="#8A8E9A" stroke="#2A2E38" strokeWidth={3} />
        </g>,
      );
    }
  }
  return <g>{cols.reverse()}</g>;
};

// Vista desde arriba: patrón de grietas hexagonales; g (0..1) cuánto se ha agrietado
const Panal: React.FC<{ readonly g: number; readonly col?: string }> = ({ g, col = ROCA }) => {
  const celdas: React.ReactNode[] = [];
  const r = 90;
  for (let f = 0; f < 7; f++) {
    for (let c = 0; c < 6; c++) {
      const cx = 160 + c * r * 1.5;
      const cy = 760 + f * r * 1.73 + (c % 2) * r * 0.87;
      const pts = new Array(6)
        .fill(0)
        .map((_, k) => {
          const a = (Math.PI / 3) * k;
          return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        })
        .join(" ");
      celdas.push(<polygon key={`${f}-${c}`} points={pts} fill={col} stroke="#1A1A20" strokeWidth={6 * g} opacity={1} />);
    }
  }
  return <g>{celdas}</g>;
};

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Columnas t={t} />
    <Texto x={880} y={600} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿quién cortó estas columnas?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.calzada], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Calzada del Gigante: miles de columnas hexagonales, como hechas con regla + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.calzada, T.lava], [1, 1.04])}>
      <Columnas t={t} />
      <Texto x={540} y={620} size={40} color={C.white} op={aparece(t, T.calzada)}>
        Calzada del Gigante
      </Texto>
      <g opacity={aparece(t, T.regla)}>
        <rect x={700} y={690} width={300} height={40} fill={C.yellow} transform="rotate(-8 850 710)" />
        {new Array(10).fill(0).map((_, k) => (
          <line key={k} x1={715 + k * 28} y1={700 - k * 4} x2={715 + k * 28} y2={715 - k * 4} stroke="#2A2A2A" strokeWidth={3} />
        ))}
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          hazlas en tu cocina: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2440" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.lava], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Una capa gruesa de lava se enfría; la roca se encoge y, como no puede sin romperse, se agrieta
export const Grieta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const enf = interpolate(t, [T.enfriarse, T.agrieta], [0, 1], clamp);
  const g = interpolate(t, [T.agrieta, T.agrieta + 0.8], [0, 1], clamp);
  const lava = `rgb(${Math.round(232 - 158 * enf)},${Math.round(96 - 18 * enf)},${Math.round(42 + 48 * enf)})`;
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.lava, T.angulos], [1, 1.04])}>
        <rect x={80} y={900} width={920} height={300} rx={20} fill={lava} />
        {enf < 0.6 ? new Array(6).fill(0).map((_, k) => <circle key={k} cx={180 + k * 150} cy={1050 + 20 * Math.sin(t * 3 + k)} r={18} fill="#FFC060" opacity={0.6 * (1 - enf)} />) : null}
        {g > 0
          ? [200, 360, 520, 680, 840].map((x, k) => (
              <path key={k} d={`M ${x} 900 l ${k % 2 ? 14 : -14} ${80 * g} l ${k % 2 ? -10 : 10} ${80 * g} l ${k % 2 ? 12 : -12} ${140 * g}`} stroke="#1A1A20" strokeWidth={8} fill="none" />
            ))
          : null}
        <rect x={80} y={1200} width={920} height={260} fill="#3A2E28" />
        <Texto x={540} y={620} size={38} color={LAVA} op={aparece(t, T.lava)}>
          una capa gruesa de lava
        </Texto>
        <Texto x={540} y={700} size={34} color={C.white} op={aparece(t, T.encoge)}>
          al enfriarse se encoge
        </Texto>
        <Texto x={540} y={1530} size={40} color={C.yellow} op={g}>
          ¡se agrieta!
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.agrieta} color={C.white} />
    </>
  );
};

// D. Las grietas se unen a ~120°, la forma más eficiente de liberar tensión, y dibujan hexágonos
export const Angulos: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = interpolate(t, [T.angulos, T.hexagonos + 0.6], [0.2, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.angulos, T.frio], [1, 1.04])}>
        <Panal g={g} />
        <g transform="translate(565 1166)" opacity={aparece(t, T.angulos) * (1 - aparece(t, T.hexagonos))}>
          <circle cx={0} cy={0} r={16} fill={C.yellow} />
          {[0, 120, 240].map((a) => (
            <line key={a} x1={0} y1={0} x2={100 * Math.cos((a * Math.PI) / 180)} y2={100 * Math.sin((a * Math.PI) / 180)} stroke={C.yellow} strokeWidth={8} />
          ))}
        </g>
        <Texto x={540} y={620} size={44} color={C.yellow} op={aparece(t, T.angulos)}>
          ángulos de 120°
        </Texto>
        <Texto x={540} y={700} size={32} color={C.white} op={aparece(t, T.tension)}>
          la forma más eficiente de liberar tensión
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.hexagonos} color={C.yellow} />
    </>
  );
};

// E. El frío avanza hacia adentro y las grietas también: columnas
export const Avanza: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cr = interpolate(t, [T.frio, T.forman + 0.6], [0.15, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.frio, T.fecula], [1, 1.04])}>
        <Columnas t={t} crece={cr} />
        <Texto x={540} y={620} size={38} color="#3AB8E8" op={aparece(t, T.frio)}>
          el frío avanza hacia adentro
        </Texto>
        <Texto x={540} y={700} size={40} color={C.yellow} op={aparece(t, T.forman)}>
          las grietas forman columnas
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.forman} color={C.yellow} />
    </>
  );
};

// F. Fécula de maíz y agua bajo una lámpara: columnas en miniatura
export const Cocina: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const seca = interpolate(t, [T.lampara, T.miniatura + 0.5], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.fecula, T.nadie], [1, 1.04])}>
        <g opacity={aparece(t, T.lampara)}>
          <path d="M 440 640 L 640 640 L 700 760 L 380 760 Z" fill="#8A90A0" />
          <path d="M 400 760 L 300 1000 L 780 1000 L 680 760 Z" fill={C.yellow} opacity={0.15} />
          <line x1={540} y1={560} x2={540} y2={640} stroke="#8A90A0" strokeWidth={8} />
        </g>
        <ellipse cx={540} cy={1100} rx={300} ry={90} fill="#DDEEFF" opacity={0.3} />
        <ellipse cx={540} cy={1090} rx={270} ry={74} fill="#F4F0E8" />
        {seca > 0
          ? new Array(14).fill(0).map((_, k) => {
              const cx = 340 + (k % 7) * 66 + (Math.floor(k / 7) % 2) * 33;
              const cy = 1060 + Math.floor(k / 7) * 50;
              return <polygon key={k} points={hex(cx, cy, 30)} fill="none" stroke="#B8A890" strokeWidth={3} opacity={seca} />;
            })
          : null}
        <Texto x={540} y={1300} size={36} color={C.white} op={aparece(t, T.fecula)}>
          fécula de maíz + agua
        </Texto>
        <Texto x={540} y={1380} size={36} color={C.yellow} op={aparece(t, T.miniatura)}>
          columnas en miniatura
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.miniatura} color={C.yellow} />
    </>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [T.fin, T.fin + 0.4], [1, 0], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.nadie, T.fin + 0.5], [1, 1.12])}>
      <Inicio t={t} q={q} />
    </Lienzo>
  );
};
