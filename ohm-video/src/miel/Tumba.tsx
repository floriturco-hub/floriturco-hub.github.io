import { Easing, interpolate, random } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { T } from "./tiempos";

// Mundo: una tumba egipcia con una vasija de miel; un panal con abejas que abanican; una bacteria dentro de la miel
// (azúcar, acidez y agua oxigenada); y una cocina con un frasco cristalizado, el baño María y un frasco abierto.
type P2 = [number, number];
const MIEL = "#E8A830";
const MIEL_OSCURA = "#C07818";
const VASIJA: P2 = [560, 1240];
const PANAL = { x0: 1300, x1: 2400 };
const MICRO = { x0: 2600, x1: 3600 };
const COCINA = { x0: 3800, x1: 4800 };
const Y0 = 640;
const Y1 = 1560;

const suave = { ...clamp, easing: Easing.inOut(Easing.cubic) };

// Cámara: [tiempo, centro x, centro y, zoom]
const camaraKeys = (): [number, number, number, number][] => [
  [0, 560, 1120, 1.4],
  [T.parece - 0.3, 560, 1120, 1.42],
  [T.parece + 0.6, 560, 1080, 1.15],
  [T.abejas - 0.4, 560, 1080, 1.17],
  [T.abejas + 0.6, (PANAL.x0 + PANAL.x1) / 2, 1100, 0.98],
  [T.roba - 0.4, (PANAL.x0 + PANAL.x1) / 2, 1100, 1.0],
  [T.roba + 0.6, (MICRO.x0 + MICRO.x1) / 2, 1100, 0.98],
  [T.cristaliza - 0.4, (MICRO.x0 + MICRO.x1) / 2, 1100, 1.0],
  [T.cristaliza + 0.6, (COCINA.x0 + COCINA.x1) / 2, 1100, 0.98],
  [T.final - 0.3, (COCINA.x0 + COCINA.x1) / 2, 1100, 1.0],
  [T.final + 0.6, 560, 1120, 1.3],
  [T.fin, 560, 1120, 1.33],
];

const camara = (t: number) => {
  const K = camaraKeys();
  let k = 0;
  while (k < K.length - 1 && K[k + 1][0] <= t) {
    k++;
  }
  const a = K[k];
  const b = K[Math.min(k + 1, K.length - 1)];
  const p = b[0] === a[0] ? 0 : interpolate(t, [a[0], b[0]], [0, 1], suave);
  return { cx: a[1] + (b[1] - a[1]) * p, cy: a[2] + (b[2] - a[2]) * p, zoom: a[3] + (b[3] - a[3]) * p };
};

const hexagono = (x: number, y: number, r: number) =>
  new Array(6)
    .fill(0)
    .map((_, i) => `${x + r * Math.cos((Math.PI / 3) * i + Math.PI / 6)},${y + r * Math.sin((Math.PI / 3) * i + Math.PI / 6)}`)
    .join(" ");

// Abeja: cuerpo a rayas, cabeza, patas y dos alas que baten
const Abeja: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly f: number }> = ({ x, y, t, f }) => {
  const ala = Math.sin(t * 60 + f) * 25;
  return (
    <g transform={`translate(${x + Math.sin(t * 2 + f) * 6} ${y + Math.cos(t * 2.4 + f) * 5})`}>
      <ellipse cx={-6} cy={-26} rx={26} ry={12} fill="#E8F4FF" opacity={0.75} transform={`rotate(${-30 + ala} 0 -12)`} />
      <ellipse cx={8} cy={-26} rx={26} ry={12} fill="#E8F4FF" opacity={0.6} transform={`rotate(${20 - ala} 0 -12)`} />
      <ellipse cx={0} cy={0} rx={36} ry={22} fill="#F0C030" />
      <rect x={-14} y={-21} width={9} height={42} fill="#2A2018" />
      <rect x={6} y={-20} width={9} height={40} fill="#2A2018" />
      <circle cx={40} cy={-2} r={15} fill="#2A2018" />
      <path d="M -36 0 L -48 4" stroke="#2A2018" strokeWidth={4} />
      <path d="M -10 20 l -6 14 M 4 20 l 0 15 M 18 18 l 6 14" stroke="#2A2018" strokeWidth={3} />
    </g>
  );
};

// Etiqueta anclada a un punto del mundo, con tamaño constante en pantalla
const Tag: React.FC<{ readonly x: number; readonly y: number; readonly texto: string; readonly color: string; readonly o: number; readonly dx?: number; readonly dy?: number }> = ({
  x,
  y,
  texto,
  color,
  o,
  dx = 0,
  dy = -90,
}) => {
  if (o <= 0) {
    return null;
  }
  const ancho = texto.length * 22 + 36;
  return (
    <g opacity={o}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy + (dy < 0 ? 26 : -30)} stroke={color} strokeWidth={2} opacity={0.7} />
      <circle cx={x} cy={y} r={6} fill={color} />
      <rect x={x + dx - ancho / 2} y={y + dy - 30} width={ancho} height={56} rx={14} fill={C.pill} stroke={color} strokeWidth={2} />
      <text x={x + dx} y={y + dy + 10} textAnchor="middle" fill={color} fontFamily={mono} fontSize={36} fontWeight={700}>
        {texto}
      </text>
    </g>
  );
};

const AZUCARES = new Array(40).fill(0).map((_, i) => ({ u: random(`au${i}`), v: random(`av${i}`), f: random(`af${i}`) * 6 }));
const GRANOS = new Array(60).fill(0).map((_, i) => ({ u: random(`gu${i}`), v: random(`gv${i}`) }));

export const Tumba: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const { cx, cy, zoom } = camara(t);
  const sx = (x: number) => 540 + (x - cx) * zoom;
  const sy = (y: number) => 960 + (y - cy) * zoom;
  const ventana = (a: number, b: number, entra = 0.4, sale = 0.4) => interpolate(t, [a, a + entra, b - sale, b], [0, 1, 1, 0], clamp);

  // Gancho: la tapa se levanta y la miel brilla; una cuchara saca un hilo de miel
  const tapa = interpolate(t, [0, 0.8], [0.3, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cuchara = interpolate(t, [0.4, 1.6, T.como, T.parece + 0.4], [0, 1, 1, 0], suave);
  const sello = ventana(1.2, T.parece + 0.6);
  const llama = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7);

  // Panal: el néctar pierde agua (de claro a ámbar) mientras las abejas abanican; luego se sella con cera
  const panal = ventana(T.abejas - 0.6, T.roba + 0.4, 0.6, 0.6);
  const seca = interpolate(t, [T.abejas, T.veinte + 0.6], [0, 1], suave);
  const cera = interpolate(t, [T.azucar, T.azucar + 1.2], [0, 1], clamp);

  // Microscopio: azúcar que le roba el agua a la bacteria; acidez; agua oxigenada
  const micro = ventana(T.roba - 0.6, T.cristaliza + 0.4, 0.6, 0.6);
  const robo = interpolate(t, [T.roba, T.seca + 1.0], [0, 1], suave);
  const acido = ventana(T.segunda - 0.2, T.tercera + 0.2);
  const perox = ventana(T.enzima - 0.2, T.cristaliza);

  // Cocina: frasco cristalizado que vuelve a líquido al baño María; frasco abierto que fermenta
  const cocina = ventana(T.cristaliza - 0.6, T.final + 0.4, 0.6, 0.6);
  const liquida = interpolate(t, [T.banoMaria, T.banoMaria + 1.6], [0, 1], suave);
  const gotas = ventana(T.ojo, T.cierrala + 0.3);
  const fermenta = interpolate(t, [T.fermentar - 0.6, T.fermentar + 0.6], [0, 1], clamp) * (1 - interpolate(t, [T.cierrala, T.cierrala + 0.5], [0, 1], clamp));
  const tapaFrasco = interpolate(t, [T.cierrala - 0.1, T.cierrala + 0.4], [0, 1], suave);

  // Etiquetas
  const tagVasija = ventana(T.vasijas - 0.2, T.parece);
  const tagAbeja = ventana(T.abejas, T.setenta);
  const tagCera = ventana(T.azucar + 0.4, T.roba);
  const tagBacteria = ventana(T.bacteria - 0.2, T.segunda);
  const tagAzucar = ventana(T.roba, T.bacteria);
  const tagAcido = ventana(T.segunda + 0.3, T.tercera);
  const tagPerox = ventana(T.oxigenada - 0.3, T.cristaliza);
  const tagGranos = ventana(T.granos - 0.3, T.banoMaria);
  const tagFermenta = ventana(T.fermentar - 0.3, T.cierrala + 0.3);

  const camaraT = `translate(${540 - cx * zoom} ${960 - cy * zoom}) scale(${zoom})`;
  const bacteria: P2 = [(MICRO.x0 + MICRO.x1) / 2, 1100];
  const escalaBacteria = 1 - 0.35 * robo;
  const colorNectar = (s: number) => {
    const a = [230, 236, 200];
    const b = [232, 168, 48];
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * s)).join(",")})`;
  };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <g transform={camaraT}>
        {/* Tumba: pared de arenisca con jeroglíficos */}
        <rect x={-300} y={200} width={1450} height={1400} fill="#5A3E24" />
        {new Array(12).fill(0).map((_, f) =>
          new Array(7).fill(0).map((__, c) => <rect key={`${f}-${c}`} x={-290 + c * 210 + (f % 2) * 100} y={210 + f * 110} width={200} height={100} rx={4} fill="#664629" />),
        )}
        {[
          [120, 520],
          [320, 470],
          [760, 500],
          [940, 560],
          [180, 760],
          [880, 780],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} stroke="#3A2614" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85}>
            {i % 3 === 0 ? (
              <path d="M -40 0 Q 0 -30 40 0 Q 0 30 -40 0 M 0 -12 a 12 12 0 1 0 0.1 0 M 0 18 L -10 50 M 0 18 L 20 46" />
            ) : i % 3 === 1 ? (
              <path d="M 0 -50 a 18 22 0 1 0 0.1 0 M 0 -6 L 0 60 M -30 14 L 30 14" />
            ) : (
              <path d="M -50 -10 q 12 -16 25 0 t 25 0 t 25 0 t 25 0 M -50 20 q 12 -16 25 0 t 25 0 t 25 0 t 25 0" />
            )}
          </g>
        ))}
        {/* Antorcha */}
        <rect x={40} y={900} width={24} height={150} fill="#3A2614" />
        <path d={`M 52 900 C ${20 + 6 * llama} ${850 - 30 * llama}, ${60 + 8 * llama} ${800 - 40 * llama}, 52 ${780 - 30 * llama} C ${70 - 6 * llama} 830, ${90 - 4 * llama} 860, 52 900 Z`} fill="#F8A030" />
        <circle cx={52} cy={860} r={260} fill="#F8A030" opacity={0.1 * llama} />
        <rect x={-300} y={1440} width={1450} height={300} fill="#3A2818" />
        {/* Vasija con miel */}
        <path d={`M ${VASIJA[0] - 60} ${VASIJA[1] - 190} C ${VASIJA[0] - 200} ${VASIJA[1] - 120}, ${VASIJA[0] - 190} ${VASIJA[1] + 150}, ${VASIJA[0] - 40} ${VASIJA[1] + 200} L ${VASIJA[0] + 40} ${VASIJA[1] + 200} C ${VASIJA[0] + 190} ${VASIJA[1] + 150}, ${VASIJA[0] + 200} ${VASIJA[1] - 120}, ${VASIJA[0] + 60} ${VASIJA[1] - 190} Z`} fill="#A8643A" />
        <path d={`M ${VASIJA[0] - 140} ${VASIJA[1] - 20} Q ${VASIJA[0]} ${VASIJA[1] + 20} ${VASIJA[0] + 140} ${VASIJA[1] - 20}`} fill="none" stroke="#6A3A1A" strokeWidth={6} />
        <path d={`M ${VASIJA[0] - 120} ${VASIJA[1] + 60} Q ${VASIJA[0]} ${VASIJA[1] + 100} ${VASIJA[0] + 120} ${VASIJA[1] + 60}`} fill="none" stroke="#6A3A1A" strokeWidth={6} />
        <path d={`M ${VASIJA[0] - 100} ${VASIJA[1] - 140} C ${VASIJA[0] - 130} ${VASIJA[1] - 60}, ${VASIJA[0] - 130} ${VASIJA[1] + 40}, ${VASIJA[0] - 90} ${VASIJA[1] + 120}`} fill="none" stroke="#C8845A" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
        <ellipse cx={VASIJA[0]} cy={VASIJA[1] - 192} rx={64} ry={16} fill={MIEL} />
        <ellipse cx={VASIJA[0]} cy={VASIJA[1] - 192} rx={120} ry={60} fill={MIEL} opacity={0.25 * tapa} />
        {/* Tapa que se levanta */}
        <g transform={`translate(${VASIJA[0] + 150 * tapa} ${VASIJA[1] - 210 - 60 * Math.sin(tapa * Math.PI)}) rotate(${40 * tapa})`}>
          <ellipse cx={0} cy={0} rx={72} ry={20} fill="#8A4A2A" />
          <rect x={-14} y={-34} width={28} height={30} rx={8} fill="#8A4A2A" />
        </g>
        {/* Cuchara de miel con hilo que gotea */}
        {cuchara > 0 ? (
          <g opacity={Math.min(1, cuchara * 2)}>
            <line x1={VASIJA[0] + 10} y1={VASIJA[1] - 200 - 220 * cuchara} x2={VASIJA[0] + 120} y2={VASIJA[1] - 420 - 220 * cuchara} stroke="#C89A6A" strokeWidth={14} strokeLinecap="round" />
            <ellipse cx={VASIJA[0] + 10} cy={VASIJA[1] - 200 - 220 * cuchara} rx={28} ry={36} fill={MIEL} />
            {[0, 1, 2].map((k) => (
              <ellipse key={k} cx={VASIJA[0] + 10} cy={VASIJA[1] - 168 - 220 * cuchara + k * 20 * cuchara} rx={10 - k * 2} ry={14} fill={MIEL} />
            ))}
            <path d={`M ${VASIJA[0] + 10} ${VASIJA[1] - 166 - 220 * cuchara} Q ${VASIJA[0] + 14 + Math.sin(t * 3) * 4} ${VASIJA[1] - 190} ${VASIJA[0] + 8} ${VASIJA[1] - 192}`} fill="none" stroke={MIEL} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
        {sello > 0 ? (
          <g opacity={sello} transform={`translate(${VASIJA[0] - 150} ${VASIJA[1] - 420}) rotate(-8)`}>
            <rect x={-130} y={-46} width={260} height={92} rx={14} fill="none" stroke={C.yellow} strokeWidth={6} />
            <text x={0} y={18} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={48} fontWeight={700}>
              3.000 años
            </text>
          </g>
        ) : null}

        {/* Panal con abejas */}
        <g opacity={panal}>
          <rect x={PANAL.x0} y={Y0} width={PANAL.x1 - PANAL.x0} height={Y1 - Y0} rx={40} fill="#2A1C10" stroke="#5A4028" strokeWidth={4} />
          {new Array(5).fill(0).map((_, f) =>
            new Array(8).fill(0).map((__, c) => {
              const x = PANAL.x0 + 130 + c * 112 + (f % 2) * 56;
              const y = 1000 + f * 98;
              const k = (f * 8 + c) / 40;
              const s = Math.max(0, Math.min(1, seca * 1.3 - k * 0.3));
              return (
                <g key={`${f}-${c}`}>
                  <polygon points={hexagono(x, y, 56)} fill="#E8C870" stroke="#C8A040" strokeWidth={6} />
                  <polygon points={hexagono(x, y, 46)} fill={colorNectar(s)} />
                  <polygon points={hexagono(x, y, 46)} fill="#F4E4A8" opacity={cera * (k < 0.6 ? 1 : 0)} />
                </g>
              );
            }),
          )}
          {/* Aire que sacan las alas */}
          {seca < 1
            ? [0, 1, 2, 3].map((k) => {
                const p = (t * 0.8 + k / 4) % 1;
                return <path key={k} d={`M ${PANAL.x0 + 250 + k * 220} ${940 - p * 220} q 20 -20 0 -40`} fill="none" stroke="#B8E8F8" strokeWidth={5} strokeLinecap="round" opacity={(1 - p) * panal} />;
              })
            : null}
          <Abeja x={PANAL.x0 + 300} y={860} t={t} f={0} />
          <Abeja x={PANAL.x0 + 560} y={820} t={t} f={1.7} />
          <Abeja x={PANAL.x0 + 820} y={860} t={t} f={3.1} />
        </g>

        {/* Microscopio: bacteria dentro de la miel */}
        <g opacity={micro}>
          <rect x={MICRO.x0} y={Y0} width={MICRO.x1 - MICRO.x0} height={Y1 - Y0} rx={40} fill="#3A2408" stroke="#6A4818" strokeWidth={4} />
          <rect x={MICRO.x0 + 20} y={Y0 + 20} width={MICRO.x1 - MICRO.x0 - 40} height={Y1 - Y0 - 40} rx={30} fill={MIEL} opacity={0.35} />
          {/* Azúcares */}
          {AZUCARES.map((a, i) => (
            <polygon key={i} points={hexagono(MICRO.x0 + 60 + a.u * 880, Y0 + 60 + a.v * 800 + Math.sin(t * 0.8 + a.f) * 4, 16)} fill="none" stroke="#FFF4D8" strokeWidth={4} opacity={0.8} />
          ))}
          {/* Bacteria que se arruga al perder agua */}
          <g transform={`translate(${bacteria[0]} ${bacteria[1]}) scale(${escalaBacteria} ${1 - 0.15 * robo})`}>
            <rect x={-130} y={-50} width={260} height={100} rx={50} fill="#7AD86A" stroke="#4A9A3A" strokeWidth={6} />
            <path d={`M -100 ${-8 * robo} q 25 ${-14 * robo} 50 0 t 50 0 t 50 0 t 50 0`} fill="none" stroke="#4A9A3A" strokeWidth={4} />
            <path d="M 130 0 q 30 -10 50 10 t 40 0" fill="none" stroke="#4A9A3A" strokeWidth={4} />
          </g>
          {/* Agua que sale de la bacteria hacia el azúcar */}
          {robo > 0 && robo < 1
            ? new Array(10).fill(0).map((_, k) => {
                const ang = (k / 10) * Math.PI * 2;
                const p = (t * 0.9 + k / 10) % 1;
                return <circle key={k} cx={bacteria[0] + Math.cos(ang) * (120 + p * 260)} cy={bacteria[1] + Math.sin(ang) * (60 + p * 220)} r={9} fill="#6AC8F8" opacity={1 - p} />;
              })
            : null}
          {/* Acidez: H+ por todas partes */}
          {acido > 0
            ? new Array(14).fill(0).map((_, k) => (
                <text key={k} x={MICRO.x0 + 90 + ((k * 137) % 820)} y={Y0 + 120 + ((k * 211) % 720)} fill={C.red} fontFamily={mono} fontSize={34} fontWeight={700} opacity={acido * (0.6 + 0.4 * Math.sin(t * 4 + k))}>
                  H⁺
                </text>
              ))
            : null}
          {/* Agua oxigenada: burbujitas */}
          {perox > 0
            ? new Array(12).fill(0).map((_, k) => {
                const p = (t * 0.5 + k / 12) % 1;
                const x = MICRO.x0 + 120 + ((k * 173) % 760);
                return (
                  <g key={k} opacity={perox * (1 - p)}>
                    <circle cx={x} cy={Y1 - 80 - p * 600} r={14} fill="none" stroke={C.cyan} strokeWidth={4} />
                    <text x={x + 20} y={Y1 - 80 - p * 600} fill={C.cyan} fontFamily={mono} fontSize={20} fontWeight={700}>
                      H₂O₂
                    </text>
                  </g>
                );
              })
            : null}
        </g>

        {/* Cocina */}
        <g opacity={cocina}>
          <rect x={COCINA.x0} y={Y0} width={COCINA.x1 - COCINA.x0} height={Y1 - Y0} rx={40} fill="#2A2440" stroke="#4A4068" strokeWidth={4} />
          <rect x={COCINA.x0 + 20} y={1380} width={COCINA.x1 - COCINA.x0 - 40} height={30} fill="#8A84A8" />
          {/* Olla al baño María con un frasco cristalizado */}
          <rect x={COCINA.x0 + 80} y={1150} width={360} height={230} rx={20} fill="#8A8A9A" />
          <rect x={COCINA.x0 + 92} y={1210} width={336} height={160} rx={14} fill="#6AC8E8" opacity={0.6} />
          {[0, 1, 2].map((k) => {
            const p = (t * 0.6 + k / 3) % 1;
            return <path key={k} d={`M ${COCINA.x0 + 160 + k * 100} ${1140 - p * 120} q 14 -20 0 -40`} fill="none" stroke="#E8E6F0" strokeWidth={5} strokeLinecap="round" opacity={(1 - p) * liquida} />;
          })}
          <rect x={COCINA.x0 + 180} y={1000} width={160} height={260} rx={24} fill="rgba(255,255,255,0.2)" stroke="#E8E6F0" strokeWidth={4} />
          <rect x={COCINA.x0 + 172} y={980} width={176} height={36} rx={8} fill="#C8A040" />
          <rect x={COCINA.x0 + 190} y={1040} width={140} height={212} rx={18} fill={liquida > 0.5 ? MIEL : "#E8C870"} />
          {liquida < 1
            ? GRANOS.map((g, i) => <circle key={i} cx={COCINA.x0 + 200 + g.u * 120} cy={1050 + g.v * 192} r={5} fill="#FFF4D8" opacity={(1 - liquida) * 0.9} />)
            : null}
          {/* Frasco abierto que fermenta */}
          <rect x={COCINA.x0 + 620} y={1080} width={180} height={300} rx={24} fill="rgba(255,255,255,0.2)" stroke="#E8E6F0" strokeWidth={4} />
          <rect x={COCINA.x0 + 632} y={1150} width={156} height={220} rx={18} fill={MIEL_OSCURA} />
          <g transform={`translate(${COCINA.x0 + 710 + 160 * (1 - tapaFrasco)} ${1060 - 120 * (1 - tapaFrasco)}) rotate(${30 * (1 - tapaFrasco)})`}>
            <rect x={-98} y={-18} width={196} height={40} rx={8} fill="#C8A040" />
          </g>
          {gotas > 0
            ? [0, 1, 2].map((k) => {
                const p = (t * 1.1 + k / 3) % 1;
                return <ellipse key={k} cx={COCINA.x0 + 670 + k * 40} cy={860 + p * 280} rx={8} ry={12} fill="#6AC8F8" opacity={gotas * (1 - tapaFrasco)} />;
              })
            : null}
          {fermenta > 0
            ? new Array(8).fill(0).map((_, k) => {
                const p = (t * 0.7 + k / 8) % 1;
                return <circle key={k} cx={COCINA.x0 + 650 + ((k * 37) % 120)} cy={1360 - p * 190} r={6 + (k % 3) * 2} fill="none" stroke="#FFF4D8" strokeWidth={3} opacity={fermenta * (1 - p)} />;
              })
            : null}
        </g>
      </g>

      <Tag x={sx(VASIJA[0] + 120)} y={sy(VASIJA[1])} dx={170} dy={160} texto="vasija con miel" color={MIEL} o={tagVasija} />
      <Tag x={sx(PANAL.x0 + 560)} y={sy(820)} dx={200} dy={-100} texto="abanican" color={C.yellow} o={tagAbeja} />
      <Tag x={sx(PANAL.x0 + 300)} y={sy(1000)} dx={-60} dy={420} texto="sellado con cera" color="#F4E4A8" o={tagCera} />
      <Tag x={sx(bacteria[0])} y={sy(bacteria[1] - 50)} dx={180} dy={-200} texto="bacteria" color="#7AD86A" o={tagBacteria} />
      <Tag x={sx(MICRO.x0 + 200)} y={sy(Y0 + 200)} dx={180} dy={-110} texto="azúcar" color="#FFF4D8" o={tagAzucar} />
      <Tag x={sx(bacteria[0])} y={sy(bacteria[1] + 50)} dx={0} dy={260} texto="ácido" color={C.red} o={tagAcido} />
      <Tag x={sx(bacteria[0])} y={sy(bacteria[1] + 50)} dx={0} dy={260} texto="agua oxigenada" color={C.cyan} o={tagPerox} />
      <Tag x={sx(COCINA.x0 + 260)} y={sy(1100)} dx={60} dy={-300} texto="granos de azúcar" color="#FFF4D8" o={tagGranos} />
      <Tag x={sx(COCINA.x0 + 710)} y={sy(1200)} dx={-120} dy={-330} texto="fermenta" color={C.red} o={tagFermenta} />
    </svg>
  );
};
