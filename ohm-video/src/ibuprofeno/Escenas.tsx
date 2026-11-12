import { Easing, interpolate, random } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import { Caja, Enzima, Mazo, Molecula, Pastilla, Sintoma } from "./Piezas";

// Instantes clave (s) de public/audio/ibuprofeno/narracion.wav (voz ×1,15), sacados con Whisper
export const T = {
  cuesta: 2.16,
  son: 3.54,
  misma: 4.42,
  bloquea: 6.52,
  asi: 8.64,
  prosta: 10.0,
  dolor: 12.22,
  fiebre: 12.82,
  inflam: 13.32,
  para: 14.26,
  principio: 16.48,
  dosis: 17.84,
  demostrar: 19.1,
  cantidad: 21.3,
  velocidad: 22.24,
  estudios: 23.46,
  tres: 25.38,
  entonces: 26.36,
  color: 28.16,
  forma: 29.0,
  recub: 29.7,
  caja: 30.98,
  invento: 31.94,
  sesenta: 33.26,
  patente: 34.28,
  caduco: 34.72,
  cualquiera: 36.54,
  sinRepetir: 38.04,
  australia: 39.54,
  espalda: 41.5,
  regla: 42.78,
  migrana: 43.54,
  dentro: 44.64,
  doble: 46.44,
  tribunal: 47.62,
  seis: 48.74,
  truco: 50.9,
  etiqueta: 51.4,
  lisina: 52.84,
  rapido: 54.56,
  marcaONo: 56.02,
  noPagas: 57.34,
  pagas: 58.42,
  fin: 59.4,
};

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const aparece = (t: number, d: number) => interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
const pop = (t: number, d: number) => interpolate(t, [d, d + 0.25, d + 0.4], [0, 1.12, 1], clamp);

const Lienzo: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly cy?: number }> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}>{children}</g>
  </svg>
);

const Tarjeta: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly titulo?: string; readonly op?: number; readonly children?: React.ReactNode }> = ({ x, y, w, h, titulo, op = 1, children }) => (
  <g opacity={op}>
    <rect x={x} y={y} width={w} height={h} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    {titulo ? (
      <text x={x + 40} y={y + 62} fill={C.grey} fontFamily={mono} fontSize={30}>
        {titulo}
      </text>
    ) : null}
    {children}
  </g>
);

const Check: React.FC<{ readonly x: number; readonly y: number; readonly p: number; readonly color?: string }> = ({ x, y, p, color = C.cyan }) => (
  <g>
    <circle cx={x} cy={y} r={28} fill="none" stroke={p > 0.3 ? color : C.grey} strokeWidth={5} />
    <path d={`M ${x - 15} ${y} L ${x - 4} ${y + 13} L ${x + 17} ${y - 13}`} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - p)} />
  </g>
);

const Precio: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly s: number }> = ({ x, y, texto, color, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -46 L 90 -46 L 130 0 L 90 46 L -110 46 Z" fill={C.card} stroke={color} strokeWidth={5} />
    <circle cx={88} cy={0} r={9} fill={color} />
    <text x={-10} y={18} textAnchor="middle" fill={color} fontFamily={mono} fontSize={52} fontWeight={700}>
      {texto}
    </text>
  </g>
);

// Curva de concentración en sangre (Bateman simplificada)
const curva = (x0: number, y0: number, w: number, h: number, ka: number, escala: number, dibujo: number) => {
  const pts: string[] = [];
  const n = Math.max(2, Math.round(80 * dibujo));
  for (let i = 0; i <= n; i++) {
    const u = (i / 80) * 10;
    const c = escala * (Math.exp(-0.35 * u) - Math.exp(-ka * u));
    pts.push(`${x0 + (u / 10) * w} ${y0 - c * h}`);
  }
  return `M ${pts.join(" L ")}`;
};

// A. Gancho: dos cajas, dos precios, la misma molécula
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const entra = interpolate(t, [0, 0.35], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const rayos = interpolate(t, [T.son, T.son + 0.4], [0, 1], clamp);
  const dibujo = interpolate(t, [T.misma - 0.2, T.misma + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [0, T.bloquea], [1, 1.06])} cy={800}>
      <g opacity={entra}>
        <Caja x={290 - 300 * (1 - entra)} y={700} s={1.05} marca texto="IBUPROFENO" sub="400 mg · marca" rayosX={rayos} />
        <Caja x={770 + 300 * (1 - entra)} y={700} s={1.05} texto="IBUPROFENO" sub="400 mg · genérico" rayosX={rayos} />
      </g>
      <Precio x={290} y={470} texto="$$$$$" color={C.yellow} s={pop(t, 0.5)} />
      <Precio x={770} y={470} texto="$" color={C.cyan} s={pop(t, T.cuesta)} />
      <text x={530} y={735} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700} opacity={aparece(t, T.son + 0.2)}>
        =
      </text>
      <Molecula x={470} y={1170} s={1.05} color={C.yellow} dibujo={dibujo} />
    </Lienzo>
  );
};

// B. Cómo funciona: bloquea la COX, menos prostaglandinas
export const Mecanismo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const llega = interpolate(t, [T.bloquea, T.bloquea + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bloqueo = t >= T.bloquea + 0.5 ? 1 : 0;
  const ritmo = interpolate(t, [T.bloquea + 0.5, T.bloquea + 1.2], [1, 0.15], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.bloquea - 0.6, T.para], [1, 1.04])}>
      <Enzima x={360} y={640} s={1.3} bloqueada={bloqueo} t={t} />
      {/* Molécula que entra al bolsillo */}
      <g transform={`translate(${interpolate(llega, [0, 1], [900, 545])} ${interpolate(llega, [0, 1], [300, 640])}) rotate(${(1 - llega) * 40})`}>
        <Molecula x={0} y={0} s={0.42} color={C.yellow} />
      </g>
      {/* Prostaglandinas que salen (menos tras el bloqueo) */}
      {new Array(18).fill(0).map((_, k) => {
        const fase = (t * 0.45 + k / 18) % 1;
        const visible = random(`p${k}`) < ritmo;
        if (!visible) return null;
        const x = 560 + fase * 420 + Math.sin(k * 3 + t * 2) * 20;
        const y = 760 + fase * 260 + (random(`py${k}`) - 0.5) * 120;
        return <path key={k} d={`M ${x} ${y - 16} l 14 8 l 0 16 l -14 8 l -14 -8 l 0 -16 Z`} fill={C.orange} opacity={Math.sin(fase * Math.PI) * aparece(t, T.bloquea - 0.6)} />;
      })}
      <text x={820} y={1140} textAnchor="middle" fill={C.orange} fontFamily={mono} fontSize={30} opacity={aparece(t, T.prosta)}>
        prostaglandinas
      </text>
      {[
        { tipo: "dolor" as const, x: 250, t: T.dolor, n: "dolor" },
        { tipo: "fiebre" as const, x: 540, t: T.fiebre, n: "fiebre" },
        { tipo: "inflamacion" as const, x: 830, t: T.inflam, n: "inflamación" },
      ].map((s) => (
        <g key={s.n} opacity={aparece(t, s.t)}>
          <Sintoma tipo={s.tipo} x={s.x} y={1300} s={pop(t, s.t)} />
          <text x={s.x} y={1420} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={32} fontWeight={700}>
            {s.n}
          </text>
        </g>
      ))}
    </Lienzo>
  );
};

// C. Lo que exige la ley a un genérico
export const Bioequivalencia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dibujo = interpolate(t, [T.demostrar + 0.5, T.cantidad], [0, 1], clamp);
  const area = aparece(t, T.cantidad);
  const pico = aparece(t, T.velocidad);
  const gx = 140;
  const gy = 1260;
  const gw = 800;
  const gh = 900;
  return (
    <Lienzo zoom={interpolate(t, [T.para, T.entonces], [1, 1.04])}>
      <Tarjeta x={60} y={200} w={960} h={330} titulo="para venderse, un genérico necesita" op={aparece(t, T.para)}>
        <Check x={130} y={330} p={interpolate(t, [T.principio, T.principio + 0.4], [0, 1], clamp)} />
        <text x={185} y={345} fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700} opacity={0.3 + 0.7 * aparece(t, T.principio)}>
          mismo principio activo
        </text>
        <Check x={130} y={450} p={interpolate(t, [T.dosis, T.dosis + 0.4], [0, 1], clamp)} />
        <text x={185} y={465} fill={C.white} fontFamily={mono} fontSize={42} fontWeight={700} opacity={0.3 + 0.7 * aparece(t, T.dosis)}>
          misma dosis
        </text>
      </Tarjeta>
      <Tarjeta x={60} y={600} w={960} h={760} titulo="concentración en sangre" op={aparece(t, T.demostrar)}>
        <line x1={gx} y1={gy} x2={gx + gw} y2={gy} stroke={C.grey} strokeWidth={3} />
        <line x1={gx} y1={gy} x2={gx} y2={700} stroke={C.grey} strokeWidth={3} />
        <text x={gx + gw} y={gy + 50} textAnchor="end" fill={C.grey} fontFamily={mono} fontSize={26}>tiempo</text>
        <path d={`${curva(gx, gy, gw, gh, 1.6, 1, 1)} L ${gx + gw} ${gy} L ${gx} ${gy} Z`} fill={C.yellow} opacity={0.15 * area} />
        <path d={curva(gx, gy, gw, gh, 1.6, 1, dibujo)} stroke={C.yellow} strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d={curva(gx, gy, gw, gh, 1.52, 0.97, dibujo)} stroke={C.cyan} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="22 14" />
        <g opacity={pico}>
          <line x1={gx + 0.165 * gw} y1={gy} x2={gx + 0.165 * gw} y2={760} stroke={C.white} strokeWidth={3} strokeDasharray="8 8" />
          <text x={gx + 0.165 * gw + 16} y={790} fill={C.white} fontFamily={mono} fontSize={28}>pico</text>
        </g>
        <g opacity={aparece(t, T.demostrar + 0.6)}>
          <line x1={620} y1={720} x2={670} y2={720} stroke={C.yellow} strokeWidth={8} />
          <text x={685} y={730} fill={C.yellow} fontFamily={mono} fontSize={28}>marca</text>
          <line x1={620} y1={770} x2={670} y2={770} stroke={C.cyan} strokeWidth={8} strokeDasharray="14 8" />
          <text x={685} y={780} fill={C.cyan} fontFamily={mono} fontSize={28}>genérico</text>
        </g>
        <text x={gx + 0.4 * gw} y={gy - 100} fill={C.yellow} fontFamily={mono} fontSize={30} opacity={area}>
          cantidad = área
        </text>
        <g opacity={aparece(t, T.tres)} transform={`translate(760 1080) scale(${pop(t, T.tres)})`}>
          <text x={0} y={0} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={120} fontWeight={700}>~3 %</text>
          <text x={0} y={50} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={28}>diferencia media</text>
        </g>
      </Tarjeta>
    </Lienzo>
  );
};

// D. ¿Qué cambia? Color, forma, recubrimiento... y la caja
export const QueCambia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const colores = [C.white, "#F0A0B8", "#F8C848"];
  const ci = t < T.color ? 0 : t < T.forma ? 1 : 2;
  const forma = t < T.forma ? "redonda" : t < T.recub ? "ovalada" : "capsula";
  const brillo = interpolate(t, [T.recub, T.recub + 0.4], [0.3, 0.9], clamp);
  const cajas = interpolate(t, [T.caja - 0.1, T.caja + 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const chips = [
    { texto: "color", t: T.color },
    { texto: "forma", t: T.forma },
    { texto: "recubrimiento", t: T.recub },
    { texto: "caja", t: T.caja },
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.entonces, T.invento], [1, 1.05])}>
      <text x={540} y={330} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={88} fontWeight={700} opacity={aparece(t, T.entonces)}>
        ¿Qué cambia?
      </text>
      <g transform={`translate(0 ${-140 * cajas})`}>
        <Pastilla x={540} y={760} s={2.4 * (1 - 0.4 * cajas)} color={colores[ci]} forma={forma} brillo={brillo} />
        {t >= T.recub ? <ellipse cx={540} cy={760} rx={240 * (1 - 0.4 * cajas)} ry={110 * (1 - 0.4 * cajas)} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="10 10" opacity={aparece(t, T.recub)} /> : null}
      </g>
      {cajas > 0 ? (
        <g opacity={Math.min(1, cajas)}>
          <Caja x={290} y={900} s={0.85 * cajas} marca texto="IBUPROFENO" sub="marca" />
          <Caja x={790} y={900} s={0.85 * cajas} texto="IBUPROFENO" sub="genérico" />
        </g>
      ) : null}
      {chips.map((c, k) => (
        <g key={c.texto} opacity={aparece(t, c.t)} transform={`translate(${k % 2 === 0 ? 300 : 780} ${1240 + Math.floor(k / 2) * 130})`}>
          <rect x={-210} y={-50} width={420} height={96} rx={48} fill={C.card} stroke={k === 3 ? C.yellow : C.cyan} strokeWidth={4} />
          <text x={0} y={16} textAnchor="middle" fill={k === 3 ? C.yellow : C.white} fontFamily={mono} fontSize={40} fontWeight={700}>
            {c.texto}
          </text>
        </g>
      ))}
    </Lienzo>
  );
};

// E. La patente caducó: cualquiera puede fabricarlo
export const Patente: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const linea = interpolate(t, [T.invento, T.sesenta], [0, 1], suave);
  const barra = interpolate(t, [T.patente, T.caduco + 0.4], [0, 1], suave);
  const abre = interpolate(t, [T.caduco + 0.2, T.caduco + 0.7], [0, 1], suave);
  const n = Math.floor(interpolate(t, [T.cualquiera, T.sinRepetir], [0, 12], clamp));
  const colores = ["#E8E6F0", "#8ACBE8", "#F0A0B8", "#A8E0A0", "#F8D890", "#C8B8F0"];
  return (
    <Lienzo zoom={interpolate(t, [T.invento, T.australia], [1, 1.05])}>
      {/* línea de tiempo */}
      <line x1={120} y1={640} x2={120 + 840 * linea} y2={640} stroke={C.grey} strokeWidth={6} strokeLinecap="round" />
      <g opacity={aparece(t, T.sesenta)}>
        <circle cx={160} cy={640} r={18} fill={C.yellow} />
        <text x={160} y={580} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700}>años 60</text>
        <Molecula x={210} y={820} s={0.42} color={C.yellow} />
      </g>
      <g opacity={aparece(t, T.patente)}>
        <rect x={160} y={620} width={420 * barra} height={40} rx={20} fill={C.purpleLight} />
        <text x={370} y={720} textAnchor="middle" fill={C.purpleLight} fontFamily={mono} fontSize={32} fontWeight={700}>patente</text>
        {/* candado */}
        <g transform={`translate(640 600)`}>
          <path d={`M -26 0 L -26 -30 A 26 26 0 0 1 26 -30 L 26 ${-6 - 34 * abre}`} stroke={abre > 0.5 ? C.cyan : C.white} strokeWidth={9} fill="none" transform={`translate(0 ${-24 * abre})`} />
          <rect x={-40} y={0} width={80} height={64} rx={10} fill={abre > 0.5 ? C.cyan : C.white} />
        </g>
      </g>
      <text x={940} y={580} textAnchor="end" fill={C.white} fontFamily={mono} fontSize={40} fontWeight={700} opacity={aparece(t, T.caduco + 0.4)}>hoy</text>
      {/* Muchos fabricantes */}
      {new Array(n).fill(0).map((_, k) => (
        <g key={k} opacity={interpolate(t, [T.cualquiera + k * 0.12, T.cualquiera + k * 0.12 + 0.2], [0, 1], clamp)}>
          <Caja x={190 + (k % 4) * 233} y={1020 + Math.floor(k / 4) * 190} s={0.52} color={colores[k % colores.length]} texto="IBUPROFENO" sub="400 mg" />
        </g>
      ))}
    </Lienzo>
  );
};

// F. Australia: el mismo ibuprofeno en cajas "especializadas"
export const Australia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rayos = interpolate(t, [T.dentro, T.dentro + 0.4], [0, 1], clamp);
  const golpe = interpolate(t, [T.tribunal + 0.2, T.tribunal + 0.55, T.tribunal + 0.65], [0, 1, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const flash = interpolate(t, [T.tribunal + 0.55, T.tribunal + 0.62, T.tribunal + 1], [0, 0.3, 0], clamp);
  const cajas = [
    { texto: "ESPALDA", t: T.espalda, color: "#D84A6A" },
    { texto: "REGLA", t: T.regla, color: "#B04AA8" },
    { texto: "MIGRAÑA", t: T.migrana, color: "#4A6AD8" },
  ];
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.australia, T.truco], [1, 1.05])}>
        <g opacity={aparece(t, T.australia)}>
          <text x={540} y={300} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={72} fontWeight={700}>Australia</text>
          <text x={540} y={360} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>caso judicial · 2016</text>
        </g>
        {cajas.map((c, k) => (
          <g key={c.texto} opacity={aparece(t, c.t)}>
            <Caja x={190 + k * 340} y={640} s={0.8 * pop(t, c.t)} marca color={c.color} texto={c.texto} sub="ibuprofeno" rayosX={rayos} />
            <g opacity={aparece(t, T.doble + k * 0.12)}>
              <Precio x={190 + k * 340} y={460} texto="×2" color={C.red} s={0.8 * pop(t, T.doble + k * 0.12)} />
            </g>
          </g>
        ))}
        <text x={540} y={900} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={40} fontWeight={700} opacity={aparece(t, T.dentro + 0.3)}>
          = mismo ibuprofeno
        </text>
        <g opacity={aparece(t, T.tribunal)}>
          <Mazo x={540} y={1130} s={1.4} golpe={golpe} />
        </g>
        <g opacity={aparece(t, T.seis)} transform={`translate(540 1420) scale(${pop(t, T.seis)})`}>
          <text x={0} y={0} textAnchor="middle" fill={C.red} fontFamily={mono} fontSize={86} fontWeight={700}>6 000 000</text>
          <text x={0} y={56} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30}>dólares australianos de multa</text>
        </g>
      </Lienzo>
      <div style={{ position: "absolute", inset: 0, background: C.white, opacity: flash }} />
    </>
  );
};

// G. El truco: lisina o sodio, absorción más rápida
export const Truco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lupa = interpolate(t, [T.etiqueta, T.lisina], [0, 1], suave);
  const dibujo = interpolate(t, [T.rapido - 0.3, T.rapido + 1], [0, 1], clamp);
  const gx = 160;
  const gy = 1420;
  return (
    <Lienzo zoom={interpolate(t, [T.truco, T.noPagas], [1, 1.04])}>
      {/* Etiqueta de la caja */}
      <g opacity={aparece(t, T.truco)}>
        <rect x={140} y={240} width={800} height={460} rx={16} fill="#E8E6F0" />
        <rect x={140} y={240} width={800} height={70} rx={16} fill="#B8B4C8" />
        <text x={190} y={290} fill="#3A3360" fontFamily={mono} fontSize={32} fontWeight={700}>composición</text>
        <text x={190} y={400} fill="#3A3360" fontFamily={mono} fontSize={44} fontWeight={700}>ibuprofeno</text>
        <text x={190} y={470} fill={C.red} fontFamily={mono} fontSize={44} fontWeight={700} opacity={aparece(t, T.lisina)}>
          lisina / sodio
        </text>
        <text x={190} y={560} fill="#6A6680" fontFamily={mono} fontSize={30}>excipientes: ...</text>
        <text x={190} y={620} fill="#6A6680" fontFamily={mono} fontSize={30}>400 mg</text>
      </g>
      {/* Lupa */}
      <g transform={`translate(${interpolate(lupa, [0, 1], [820, 375])} ${interpolate(lupa, [0, 1], [640, 455])})`} opacity={aparece(t, T.etiqueta)}>
        <circle r={205} fill="#FFFFFF" fillOpacity={0.08} stroke={C.yellow} strokeWidth={12} />
        <line x1={145} y1={145} x2={250} y2={250} stroke={C.yellow} strokeWidth={22} strokeLinecap="round" />
      </g>
      {/* Absorción */}
      <Tarjeta x={60} y={800} w={960} h={720} titulo="absorción" op={aparece(t, T.rapido - 0.3)}>
        <line x1={gx} y1={gy} x2={gx + 780} y2={gy} stroke={C.grey} strokeWidth={3} />
        <line x1={gx} y1={gy} x2={gx} y2={920} stroke={C.grey} strokeWidth={3} />
        <path d={curva(gx, gy, 780, 700, 1.1, 1, dibujo)} stroke={C.white} strokeWidth={8} fill="none" />
        <path d={curva(gx, gy, 780, 640, 3.5, 0.9, dibujo)} stroke={C.cyan} strokeWidth={8} fill="none" />
        <g opacity={aparece(t, T.rapido + 0.6)}>
          <text x={gx + 120} y={990} fill={C.cyan} fontFamily={mono} fontSize={32} fontWeight={700}>lisina / sodio</text>
          <text x={gx + 380} y={1120} fill={C.white} fontFamily={mono} fontSize={32} fontWeight={700}>normal</text>
        </g>
        <text x={540} y={1490} textAnchor="middle" fill={C.grey} fontFamily={mono} fontSize={30} opacity={aparece(t, T.marcaONo)}>
          de marca o genérico
        </text>
      </Tarjeta>
    </Lienzo>
  );
};

// H. Conclusión: pagas la caja
export const Conclusion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tachar = interpolate(t, [T.noPagas + 0.4, T.noPagas + 0.9], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.noPagas, T.fin + 0.5], [1, 1.06])} cy={800}>
      <Caja x={290} y={640} s={1} marca texto="IBUPROFENO" sub="marca" rayosX={0.85} />
      <Caja x={770} y={640} s={1} texto="IBUPROFENO" sub="genérico" rayosX={0.85} />
      <text x={530} y={675} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={110} fontWeight={700}>=</text>
      <g opacity={aparece(t, T.noPagas)}>
        <text x={540} y={1040} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={60} fontWeight={700}>el efecto</text>
        <line x1={330} y1={1020} x2={330 + 420 * tachar} y2={1020} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      </g>
    </Lienzo>
  );
};
