import { interpolate } from "remotion";
import { camaraEn, ClaveCamara, Panel, Pildora, Tag, ventanaEn } from "../components/Mundo";
import { Persona } from "../orinar/Persona";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: a la izquierda, una persona con dolor de cabeza y sus vasos sanguíneos (el ibuprofeno llega a todas partes);
// en el centro, una célula irritada (COX fabrica prostaglandinas que hacen gritar al nervio, y el ibuprofeno la tapa);
// a la derecha, el pie contra la cabeza.
type P2 = [number, number];
const PX = 450;
const SUELO = 1500;
const AZUL = "#5AB8F8";
const PROSTA = "#F8883A";
const COX = "#A87AE8";
const NERVIO = "#F8E070";

// Rutas de los vasos (coordenadas locales de la persona: (0, 0) entre los pies)
const RUTAS: Record<string, P2[]> = {
  cabeza: [
    [-6, -560],
    [-6, -620],
    [-2, -660],
    [0, -712],
  ],
  mano: [
    [-6, -560],
    [-4, -600],
    [14, -520],
    [18, -430],
    [12, -340],
  ],
  pie: [
    [-6, -560],
    [-4, -470],
    [-2, -390],
    [8, -220],
    [14, -40],
  ],
  higado: [
    [-6, -560],
    [10, -520],
    [24, -500],
  ],
};
const ESTOMAGO: P2 = [8, -478];

const enRuta = (r: P2[], p: number): P2 => {
  const n = r.length - 1;
  const f = Math.min(n - 1e-6, Math.max(0, p * n));
  const i = Math.floor(f);
  const u = f - i;
  return [r[i][0] + (r[i + 1][0] - r[i][0]) * u, r[i][1] + (r[i + 1][1] - r[i][1]) * u];
};

const camaraKeys = (): ClaveCamara[] => [
  [0, 520, 1120, 1.55],
  [T.donde - 0.3, 520, 1120, 1.6],
  [T.donde + 0.5, 1850, 1030, 1.0],
  [T.resto - 0.3, 1850, 1030, 1.02],
  [T.resto + 0.5, 3100, 1030, 1.0],
  [T.noApunta - 0.3, 3100, 1030, 1.02],
  [T.noApunta + 0.5, 520, 1120, 1.55],
  [T.fin + 2, 520, 1120, 1.62],
];

// Célula con la enzima COX, prostaglandinas y un nervio; `irritada` 0/1, `tapada` 0..1, `escala` del dibujo
const Celula: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly t: number; readonly irritada: number; readonly tapada: number; readonly ibu: number }> = ({
  x,
  y,
  s,
  t,
  irritada,
  tapada,
  ibu,
}) => {
  const produce = irritada * (1 - tapada);
  const grito = produce;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Membrana */}
      <ellipse cx={0} cy={0} rx={300} ry={240} fill="#2A1E44" stroke="#8A6AC8" strokeWidth={10} />
      {irritada > 0 ? <ellipse cx={0} cy={0} rx={300} ry={240} fill={C.red} opacity={0.12 * irritada} /> : null}
      {/* Enzima COX con su cerradura */}
      <path d="M -150 -80 C -60 -150, 40 -130, 70 -50 L 10 -20 L 70 10 C 50 100, -80 120, -150 60 C -200 20, -200 -40, -150 -80 Z" fill={COX} />
      <text x={-90} y={-10} textAnchor="middle" fill="#1A1430" fontFamily={mono} fontSize={40} fontWeight={700}>
        COX
      </text>
      {/* Ibuprofeno: entra y tapa la cerradura */}
      {ibu > 0 ? (
        <g transform={`translate(${30 + 220 * (1 - tapada)} ${-15 - 140 * (1 - tapada)})`} opacity={ibu}>
          <path d="M -26 0 L 18 -26 L 18 26 Z" fill={AZUL} stroke="#E8F8FF" strokeWidth={3} />
        </g>
      ) : null}
      {/* Prostaglandinas que salen hacia el nervio */}
      {produce > 0.02
        ? [0, 1, 2, 3, 4].map((k) => {
            const p = (t * 0.6 + k / 5) % 1;
            return <polygon key={k} points="-14,0 -7,-12 7,-12 14,0 7,12 -7,12" transform={`translate(${70 + p * 260} ${-15 + Math.sin(p * 6 + k) * 30})`} fill={PROSTA} opacity={produce * (p < 0.85 ? 1 : (1 - p) / 0.15)} />;
          })
        : null}
      {/* Nervio del dolor */}
      <path d="M 520 -200 C 420 -120, 380 -40, 330 -10 M 380 -60 l -40 -40 M 360 -30 l -50 10" fill="none" stroke={NERVIO} strokeWidth={10} strokeLinecap="round" />
      <circle cx={330} cy={-10} r={20 + 30 * grito * (0.6 + 0.4 * Math.sin(t * 25))} fill={NERVIO} opacity={0.25 + 0.5 * grito} />
      {/* Volumen del dolor */}
      <g transform="translate(420 140)">
        <path d="M -40 -20 L -20 -20 L 0 -40 L 0 40 L -20 20 L -40 20 Z" fill={C.white} />
        {[0, 1, 2, 3, 4].map((k) => (
          <rect key={k} x={20 + k * 22} y={20 - (k + 1) * 14} width={14} height={(k + 1) * 14} rx={3} fill={k / 5 < grito * 0.9 + 0.1 ? C.red : "#3A3360"} />
        ))}
      </g>
    </g>
  );
};

export const PastillaMundo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camaraEn(camaraKeys(), t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => ventanaEn(t, a, b, entra, sale);

  // Recorrido de la pastilla
  const gancho = ventana(-1, T.tomas, 0.4, 0.3);
  const traga = interpolate(t, [T.tomas, T.estomago], [0, 1], clamp);
  const disuelve = interpolate(t, [T.estomago, T.sangre], [0, 1], clamp);
  const enSangre = Math.max(gancho, interpolate(t, [T.sangre, T.viaja + 0.5], [0, 1], clamp));
  const reparte = Math.max(gancho, interpolate(t, [T.viaja, T.viaja + 0.8], [0, 1], clamp));
  const alivio = interpolate(t, [T.volumen - 0.4, T.volumen + 0.6], [0, 1], clamp);
  const dolor = 1 - alivio;
  const pastillaP: P2 = [PX + 34 + (ESTOMAGO[0] - 34) * traga, SUELO - 690 + (ESTOMAGO[1] + 690) * traga];

  // Célula (centro) y comparación (derecha)
  const celula = ventana(T.donde - 0.3, T.resto + 0.3, 0.6, 0.6);
  const ibuB = interpolate(t, [T.ibu, T.ibu + 0.5], [0, 1], clamp);
  const tapaB = interpolate(t, [T.ibu + 0.4, T.bloquea + 0.2], [0, 1], clamp);
  const irritaB = interpolate(t, [T.donde, T.donde + 0.6], [0, 1], clamp);
  const compara = ventana(T.resto - 0.3, T.noApunta + 0.3, 0.6, 0.6);
  const tapaC = interpolate(t, [T.duele, T.volumen + 0.3], [0, 1], clamp);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const lugar = (nombre: string): P2 => {
    const r = RUTAS[nombre];
    return [PX + r[r.length - 1][0], SUELO + r[r.length - 1][1]];
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Habitación */}
        <rect x={-300} y={-400} width={1500} height={2400} fill="#1E1A3A" opacity={0.6} />
        <rect x={-300} y={SUELO} width={1500} height={500} fill="#2A2440" />
        <Persona x={PX} suelo={SUELO} t={t} miedo={0.6 * dolor} />
        {/* Rayos X: vasos y estómago */}
        <g transform={`translate(${PX} ${SUELO})`}>
          {Object.values(RUTAS).map((r, i) => (
            <path key={i} d={`M ${r.map(([x, y]) => `${x} ${y}`).join(" L ")}`} fill="none" stroke={C.red} strokeWidth={6} opacity={0.55} strokeLinejoin="round" />
          ))}
          <circle cx={-6} cy={-560} r={14} fill={C.red} opacity={0.8} />
          <ellipse cx={ESTOMAGO[0]} cy={ESTOMAGO[1]} rx={28} ry={18} fill="#E8A8A0" opacity={0.85} />
          {/* Moléculas de ibuprofeno por la sangre */}
          {enSangre > 0
            ? Object.entries(RUTAS).map(([nombre, r]) =>
                [0, 1, 2, 3, 4].map((k) => {
                  const p = ((t * 0.35 + k / 5) % 1) * reparte;
                  const [x, y] = enRuta(r, p);
                  return <circle key={`${nombre}-${k}`} cx={x} cy={y} r={6} fill={AZUL} opacity={enSangre} />;
                }),
              )
            : null}
          {/* Burbujas al disolverse */}
          {disuelve > 0 && disuelve < 1
            ? [0, 1, 2, 3].map((k) => <circle key={k} cx={ESTOMAGO[0] - 14 + k * 9} cy={ESTOMAGO[1] - 8 - ((t * 2 + k / 4) % 1) * 22} r={4} fill={AZUL} />)
            : null}
        </g>
        {/* Pastilla que baja al estómago */}
        {traga > 0 && disuelve < 1 ? (
          <g transform={`translate(${pastillaP[0]} ${pastillaP[1]}) rotate(30) scale(${1 - disuelve})`}>
            <rect x={-16} y={-8} width={32} height={16} rx={8} fill="#F8F8FF" />
            <rect x={0} y={-8} width={16} height={16} rx={8} fill={AZUL} />
          </g>
        ) : null}
        {/* Dolor de cabeza */}
        <g transform={`translate(${PX} ${SUELO - 740})`} opacity={dolor}>
          <circle r={70 + 10 * Math.sin(t * 8)} fill={C.red} opacity={0.18} />
          {[-60, -20, 20, 60].map((a, k) => (
            <path key={k} d={`M ${Math.sin((a * Math.PI) / 180) * 80} ${-Math.cos((a * Math.PI) / 180) * 80} l ${Math.sin((a * Math.PI) / 180) * 30} ${-Math.cos((a * Math.PI) / 180) * 30}`} stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 10 + k)} />
          ))}
        </g>
        {/* Gancho: la pastilla gigante y preguntas por todo el cuerpo */}
        {gancho > 0 ? (
          <g opacity={gancho}>
            <g transform={`translate(${PX + 280} ${SUELO - 820}) rotate(${-20 + Math.sin(t * 3) * 10})`}>
              <rect x={-90} y={-38} width={180} height={76} rx={38} fill="#F8F8FF" />
              <rect x={0} y={-38} width={90} height={76} rx={38} fill={AZUL} />
            </g>
            {(["cabeza", "mano", "pie", "higado"] as const).map((n, k) => {
              const [x, y] = lugar(n);
              return (
                <text key={n} x={x + 60} y={y + 14 + Math.sin(t * 4 + k) * 6} fill={C.yellow} fontFamily={mono} fontSize={56} fontWeight={700}>
                  ?
                </text>
              );
            })}
          </g>
        ) : null}
        {/* Alivio final */}
        <Pildora x={PX + 230} y={SUELO - 760} texto="✓" color="#48C878" o={ventana(T.soloNota, T.fin + 2)} tam={70} />

        {/* Célula irritada */}
        <g opacity={celula}>
          <Panel x0={1340} y0={600} x1={2360} y1={1460} />
          <Celula x={1780} y={1060} s={1.0} t={t} irritada={irritaB} tapada={tapaB} ibu={ibuB} />
        </g>

        {/* Pie contra cabeza */}
        <g opacity={compara}>
          <Panel x0={2600} y0={600} x1={3600} y1={1460} />
          <text x={2850} y={680} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
            pie
          </text>
          <text x={3350} y={680} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={40} fontWeight={700}>
            cabeza
          </text>
          <Celula x={2800} y={1020} s={0.62} t={t} irritada={0} tapada={tapaC} ibu={1} />
          <Celula x={3300} y={1020} s={0.62} t={t} irritada={1} tapada={tapaC} ibu={1} />
          <text x={2850} y={1330} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} fontWeight={700}>
            nada que tapar
          </text>
          <text x={3350} y={1330} textAnchor="middle" fill={tapaC > 0.8 ? "#48C878" : C.red} fontFamily={mono} fontSize={34} fontWeight={700}>
            {tapaC > 0.8 ? "silencio" : "¡duele!"}
          </text>
        </g>
      </g>

      <Tag x={sx(lugar("pie")[0])} y={sy(lugar("pie")[1])} dx={180} dy={-60} texto="pie" color={AZUL} o={ventana(T.pie, T.entonces)} />
      <Tag x={sx(lugar("mano")[0])} y={sy(lugar("mano")[1])} dx={220} dy={-40} texto="mano" color={AZUL} o={ventana(T.mano, T.entonces)} />
      <Tag x={sx(lugar("higado")[0])} y={sy(lugar("higado")[1])} dx={240} dy={-80} texto="hígado" color={AZUL} o={ventana(T.higado, T.entonces)} />
      <Tag x={sx(lugar("cabeza")[0])} y={sy(lugar("cabeza")[1])} dx={240} dy={-120} texto="cabeza" color={AZUL} o={ventana(T.cabeza, T.donde)} />
      <Tag x={sx(PX + ESTOMAGO[0])} y={sy(SUELO + ESTOMAGO[1])} dx={-220} dy={-80} texto="estómago" color="#E8A8A0" o={ventana(T.estomago, T.viaja)} />
      <Tag x={sx(1850)} y={sy(1045)} dx={-60} dy={330} texto="prostaglandinas" color={PROSTA} o={ventana(T.prosta, T.fabricarlas)} />
      <Tag x={sx(2110)} y={sy(1050)} dx={60} dy={-300} texto="nervio del dolor" color={NERVIO} o={ventana(T.sensibles, T.fabricarlas)} />
      <Tag x={sx(1800)} y={sy(1045)} dx={-40} dy={330} texto="ibuprofeno" color={AZUL} o={ventana(T.ibu + 0.3, T.resto)} />
    </svg>
  );
};
