import { Easing, interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Icono, Pina, Probeta } from "./Iconos";

// Instantes clave (s) de public/audio/pina/narracion.wav (voz ×1,15), sacados con Whisper
export const T = {
  mito: 3.32,
  empecemos: 5.28,
  agua: 6.82,
  proteinas: 9.36,
  enzimas: 10.58,
  zinc: 11.38,
  citrico: 11.94,
  fructosa: 13.9,
  energia: 14.86,
  noViene: 16.98,
  glandulas: 20.04,
  glucosa: 23.04,
  estable: 24.98,
  alcalino: 28.6,
  salado: 32.82,
  amargo: 33.6,
  metalico: 34.16,
  persona: 34.82,
  pina: 37.04,
  estudio: 37.98,
  anecdotas: 41.72,
  influye: 44.08,
  beber: 47.2,
  alcohol: 48.28,
  tabaco: 48.96,
  ajo: 49.7,
  medico: 52.72,
  color: 53.42,
  molestias: 55.24,
  sangre: 55.98,
  consulta: 56.62,
  magia: 57.62,
  fin: 60.8,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const BLANCO = "#D8D4E8";

const Gota: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly color?: string }> = ({ x, y, s, color = BLANCO }) => (
  <path d={`M ${x} ${y - 70 * s} Q ${x + 55 * s} ${y} ${x} ${y + 40 * s} Q ${x - 55 * s} ${y} ${x} ${y - 70 * s} Z`} fill={color} opacity={0.85} />
);

const Lista: React.FC<{ readonly t: number; readonly y: number; readonly items: { texto: string; t: number; color: string; icono?: string }[] }> = ({ t, y, items }) => (
  <g>
    {items.map((it, k) => {
      const on = interpolate(t, [it.t, it.t + 0.3], [0.25, 1], clamp);
      const yy = y + k * 120;
      return (
        <g key={k} opacity={on}>
          {it.icono ? <Icono tipo={it.icono} x={150} y={yy} s={0.8} color={it.color} /> : <circle cx={150} cy={yy} r={26} fill={on > 0.5 ? it.color : C.grey} />}
          <text x={230} y={yy + 16} fill={it.color} fontFamily={mono} fontSize={48} fontWeight={700}>{it.texto}</text>
        </g>
      );
    })}
  </g>
);

// Gancho y cierre: la piña y la "gota" con la pregunta
export const Gancho: React.FC<{ readonly t0: number; readonly fase: "intro" | "final" }> = ({ t0, fase }) => {
  const t = useT(t0);
  const intro = fase === "intro";
  const flecha = intro ? interpolate(t, [1.0, 1.8], [0, 1], suave) : 0;
  const pregunta = intro ? interpolate(t, [T.mito - 0.2, T.mito + 0.3], [0, 1], clamp) : 0;
  const zoom = intro ? interpolate(t, [0, T.empecemos], [1, 1.06]) : interpolate(t, [t0, t0 + 1, T.fin + 0.5], [1.3, 1.02, 1.05], suave);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <g transform={`translate(${540 - 540 * zoom} ${960 - 960 * zoom}) scale(${zoom})`}>
        <Pina x={intro ? 300 : 540} y={intro ? 1000 : 1050} s={intro ? 1.4 : 1.9} t={t} />
        {intro ? (
          <g>
            <g opacity={flecha}>
              <line x1={460} y1={1000} x2={460 + 200 * flecha} y2={1000} stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
              <polyline points={`${640},970 ${670},1000 ${640},1030`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" opacity={flecha > 0.9 ? 1 : 0} />
            </g>
            <g opacity={flecha}>
              <Gota x={830} y={1010} s={2} />
              {[0, 1, 2].map((k) => (
                <path key={k} d={`M ${760 + k * 70} ${880 - (k % 2) * 30} l 8 -20 l 8 20 l -8 20 Z`} fill={C.yellow} opacity={0.5 + 0.5 * Math.sin(t * 5 + k)} />
              ))}
            </g>
            <text x={830} y={1040} textAnchor="middle" fill={C.bg} fontFamily={mono} fontSize={120} fontWeight={700} opacity={pregunta}>?</text>
          </g>
        ) : null}
      </g>
    </svg>
  );
};

// Composición: sobre todo agua, y otros componentes (incluida la fructosa)
export const Composicion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nivel = interpolate(t, [T.empecemos, T.agua + 0.8], [0, 0.9], suave);
  const tarjeta = interpolate(t, [T.agua - 0.2, T.agua + 0.3], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <Probeta x={540} y={560} s={1.1} nivel={nivel} />
      <g opacity={tarjeta}>
        <rect x={60} y={820} width={960} height={840} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={890} fill={C.grey} fontFamily={mono} fontSize={30}>composición (aprox.)</text>
        <text x={110} y={990} fill={C.cyan} fontFamily={mono} fontSize={72} fontWeight={700}>~90 % agua</text>
        <Lista
          t={t}
          y={1100}
          items={[
            { texto: "proteínas y enzimas", t: T.proteinas, color: C.white },
            { texto: "zinc", t: T.zinc, color: C.white },
            { texto: "ácido cítrico", t: T.citrico, color: C.white },
            { texto: "fructosa (azúcar)", t: T.fructosa, color: C.yellow },
          ]}
        />
      </g>
    </svg>
  );
};

// De dónde sale la fructosa: no de la fruta directamente, sino de la glucosa de la sangre
export const Origen: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tachado = interpolate(t, [T.noViene + 0.6, T.noViene + 1.1], [0, 1], clamp);
  const ruta = interpolate(t, [T.glandulas - 0.3, T.glucosa + 1.0], [0, 1], suave);
  const grafica = interpolate(t, [T.estable - 0.2, T.estable + 0.3], [0, 1], clamp);
  const pasos = [
    { tipo: "estomago", texto: "digestión", y: 760, color: C.white },
    { tipo: "sangre", texto: "glucosa en sangre", y: 960, color: C.red },
    { tipo: "glandula", texto: "vesículas seminales", y: 1160, color: C.purpleLight },
  ];
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <Pina x={200} y={520} s={0.7} t={t} />
      {/* Atajo "fruta → fructosa" tachado */}
      <g opacity={interpolate(t, [T.noViene - 0.2, T.noViene + 0.2], [0, 1], clamp)}>
        <path d="M 290 470 Q 700 380 840 1290" fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray="16 12" opacity={1 - 0.6 * tachado} />
        <g opacity={tachado} stroke={C.red} strokeWidth={12} strokeLinecap="round">
          <line x1={600} y1={520} x2={720} y2={640} />
          <line x1={720} y1={520} x2={600} y2={640} />
        </g>
      </g>
      {/* Ruta real */}
      {pasos.map((p, k) => {
        const on = interpolate(ruta, [k * 0.3, k * 0.3 + 0.25], [0, 1], clamp);
        return (
          <g key={k} opacity={on}>
            <line x1={200} y1={p.y - 130} x2={200} y2={p.y - 60} stroke={C.grey} strokeWidth={5} />
            <Icono tipo={p.tipo} x={200} y={p.y} s={1} color={p.color} />
            <text x={300} y={p.y + 14} fill={p.color} fontFamily={mono} fontSize={44} fontWeight={700}>{p.texto}</text>
          </g>
        );
      })}
      <g opacity={interpolate(ruta, [0.85, 1], [0, 1], clamp)}>
        <line x1={200} y1={1220} x2={200} y2={1270} stroke={C.grey} strokeWidth={5} />
        <circle cx={200} cy={1320} r={40} fill="none" stroke={C.yellow} strokeWidth={8} />
        <text x={300} y={1336} fill={C.yellow} fontFamily={mono} fontSize={44} fontWeight={700}>fructosa</text>
      </g>
      {grafica > 0 ? (
        <g opacity={grafica}>
          <rect x={60} y={1420} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={1480} fill={C.grey} fontFamily={mono} fontSize={28}>glucosa en sangre a lo largo del día</text>
          <path d={`M 110 1600 ${new Array(40).fill(0).map((_, k) => `L ${110 + k * 21.5} ${1600 + 10 * Math.sin(k * 0.7)}`).join(" ")}`} fill="none" stroke={C.red} strokeWidth={6} />
          <text x={970} y={1690} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>con o sin piña: estable</text>
        </g>
      ) : null}
    </svg>
  );
};

// pH y sabor
export const Sabor: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const escala = interpolate(t, [T.alcalino - 0.2, T.alcalino + 0.4], [0, 1], clamp);
  const marca = interpolate(t, [T.alcalino + 0.6, T.alcalino + 1.4], [7, 7.6], suave);
  const chips = [
    { texto: "salado", t: T.salado },
    { texto: "amargo", t: T.amargo },
    { texto: "metálico", t: T.metalico },
  ];
  const personas = interpolate(t, [T.persona - 0.2, T.persona + 0.4], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="ph" x1="0" x2="1">
          <stop offset="0" stopColor="#E8414F" />
          <stop offset="0.5" stopColor="#3FA86A" />
          <stop offset="1" stopColor="#5A4AD8" />
        </linearGradient>
      </defs>
      <g opacity={escala}>
        <rect x={60} y={420} width={960} height={420} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={490} fill={C.grey} fontFamily={mono} fontSize={30}>pH</text>
        <rect x={110} y={560} width={860} height={60} rx={30} fill="url(#ph)" />
        {["0 ácido", "7 neutro", "14 alcalino"].map((s, k) => (
          <text key={k} x={110 + k * 430} y={680} textAnchor={k === 0 ? "start" : k === 1 ? "middle" : "end"} fill={C.grey} fontFamily={mono} fontSize={30}>{s}</text>
        ))}
        <g transform={`translate(${110 + (marca / 14) * 860} 590)`}>
          <path d="M -18 -60 L 18 -60 L 0 -36 Z" fill={C.white} />
          <text y={-76} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>~7,2–8</text>
        </g>
        <text x={110} y={790} fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>ligeramente alcalino</text>
      </g>
      {chips.map((c, k) => {
        const on = interpolate(t, [c.t - 0.1, c.t + 0.3], [0, 1], clamp);
        return (
          <g key={k} opacity={on} transform={`translate(${200 + k * 340} ${1000}) scale(${0.8 + 0.2 * on})`}>
            <rect x={-140} y={-50} width={280} height={100} rx={50} fill="#2A2350" stroke={C.yellow} strokeWidth={4} />
            <text y={16} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={44} fontWeight={700}>{c.texto}</text>
          </g>
        );
      })}
      <g opacity={personas}>
        {[0, 1, 2, 3, 4].map((k) => (
          <Gota key={k} x={180 + k * 180} y={1300 + 10 * Math.sin(t * 3 + k)} s={1.1} color={["#D8D4E8", "#C8C4E8", "#E8E0C8", "#D8E8E0", "#E0D0D8"][k]} />
        ))}
        <text x={540} y={1460} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} fontWeight={700}>cambia de una persona a otra</text>
      </g>
    </svg>
  );
};

// Evidencia: 0 estudios serios, solo anécdotas → MITO
export const Evidencia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tarjeta = interpolate(t, [T.estudio - 0.2, T.estudio + 0.3], [0, 1], clamp);
  const anecdotas = interpolate(t, [T.anecdotas - 0.2, T.anecdotas + 0.4], [0, 1], clamp);
  const sello = interpolate(t, [T.anecdotas + 1.2, T.anecdotas + 1.6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <Pina x={540} y={560} s={1.1} t={t} />
      <g opacity={tarjeta}>
        <rect x={60} y={860} width={960} height={300} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
        <text x={110} y={930} fill={C.grey} fontFamily={mono} fontSize={30}>estudios científicos serios</text>
        <text x={110} y={1080} fill={C.yellow} fontFamily={mono} fontSize={120} fontWeight={700}>0</text>
      </g>
      <g opacity={anecdotas}>
        {[0, 1, 2, 3].map((k) => (
          <Icono key={k} tipo="bocadillo" x={190 + k * 235} y={1300 + 20 * Math.sin(t * 2 + k)} s={1.2} color={C.grey} />
        ))}
        <text x={540} y={1440} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={34} fontWeight={700}>solo anécdotas</text>
      </g>
      {sello > 0 ? (
        <g opacity={sello} transform={`translate(540 700) rotate(-14) scale(${1.4 - 0.4 * sello})`}>
          <rect x={-220} y={-80} width={440} height={160} rx={20} fill="none" stroke={C.red} strokeWidth={12} />
          <text y={42} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={120} fontWeight={700}>MITO</text>
        </g>
      ) : null}
    </svg>
  );
};

// Lo que sí influye y cuándo ir al médico
export const Influye: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lista = interpolate(t, [T.influye, T.influye + 0.4, T.medico - 0.4, T.medico], [0, 1, 1, 0], clamp);
  const medico = interpolate(t, [T.medico - 0.2, T.medico + 0.3], [0, 1], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {lista > 0 ? (
        <g opacity={lista}>
          <rect x={60} y={520} width={960} height={680} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
          <text x={110} y={590} fill={C.grey} fontFamily={mono} fontSize={30}>lo que sí puede influir</text>
          <Lista
            t={t}
            y={700}
            items={[
              { texto: "beber poca agua", t: T.beber, color: C.cyan, icono: "vaso" },
              { texto: "alcohol", t: T.alcohol, color: C.red, icono: "copa" },
              { texto: "tabaco", t: T.tabaco, color: C.grey, icono: "cigarro" },
              { texto: "ajo, espárragos...", t: T.ajo, color: C.white, icono: "ajo" },
            ]}
          />
        </g>
      ) : null}
      {medico > 0 ? (
        <g opacity={medico}>
          <rect x={60} y={520} width={960} height={760} rx={24} fill={C.card} stroke={C.red} strokeWidth={3} />
          <text x={110} y={590} fill={C.grey} fontFamily={mono} fontSize={30}>consulta si notas</text>
          <Lista
            t={t}
            y={700}
            items={[
              { texto: "olor o color muy distinto", t: T.color, color: C.white },
              { texto: "molestias", t: T.molestias, color: C.white },
              { texto: "sangre", t: T.sangre, color: C.red },
            ]}
          />
          <g opacity={interpolate(t, [T.consulta - 0.1, T.consulta + 0.3], [0, 1], clamp)}>
            <Icono tipo="medico" x={160} y={1140} s={1} />
            <text x={240} y={1160} fill={C.red} fontFamily={mono} fontSize={48} fontWeight={700}>a un médico</text>
          </g>
        </g>
      ) : null}
    </svg>
  );
};
