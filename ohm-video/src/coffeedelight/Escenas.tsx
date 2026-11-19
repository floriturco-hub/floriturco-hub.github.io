import { interpolate } from "remotion";
import { aparece, Flash, Lienzo, Texto } from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/coffeedelight/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
// Campaña de marca: el empaque es el centro de la escena; sin marcas competidoras.
export const T = {
  tienda: 2.68, // tienda
  esquina: 3.10, // esquina
  coffee: 3.76, // coffee
  clasico: 5.28, // clasico
  cappuccino: 6.06, // cappuccino
  final: 7.00, // final
  sabor: 9.58, // sabor
  lengua: 11.00, // lengua
  nariz: 12.02, // nariz
  aroma: 14.04, // aroma
  paladar: 15.24, // paladar
  retronasal: 17.82, // retronasal
  cerebro: 18.98, // cerebro
  dulce: 20.58, // dulce
  lee: 22.14, // lee
  taza: 24.16, // taza
  clasico2: 25.32, // clasico
  intenso: 26.66, // intenso
  cappuccino2: 27.70, // cappuccino
  cremoso: 29.20, // cremoso
  bolsillo: 31.02, // bolsillo
  bus: 31.92, // bus
  oficina: 32.56, // oficina
  fila: 33.44, // fila
  porEso: 34.36, // por
  fin: 36.22, // FIN
};

const CAFE = "#4A2A18";
const CAFE2 = "#6B3E22";
const CREMA = "#F2DFC0";
const DORADO = "#D8A84A";
const LECHE = "#C89A6A";
const GRIS_C = "#A89C8C";

// Empaque ilustrado (versión simplificada): v = "Clásico" | "Cappuccino"
const Bolsa: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly v?: string; readonly rot?: number }> = ({ x, y, s = 1, v = "Clásico", rot = 0 }) => {
  const cap = v === "Cappuccino";
  const cuerpo = cap ? LECHE : CAFE;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* sellos dentados arriba y abajo */}
      {[-1, 1].map((d) => (
        <path
          key={d}
          d={`M -170 ${d * 250} ${new Array(17)
            .fill(0)
            .map((_, k) => `L ${-170 + k * 21.25} ${d * 250 + (k % 2 ? d * 16 : 0)}`)
            .join(" ")} L 170 ${d * 250} L 170 ${d * 220} L -170 ${d * 220} Z`}
          fill={DORADO}
        />
      ))}
      <rect x={-170} y={-222} width={340} height={444} fill={cuerpo} />
      {/* granos de café */}
      {[
        [-110, -150, 20],
        [120, -120, -30],
        [-120, 150, 40],
        [110, 160, -10],
      ].map(([gx, gy, gr], k) => (
        <g key={k} transform={`translate(${gx} ${gy}) rotate(${gr})`}>
          <ellipse cx={0} cy={0} rx={22} ry={30} fill={cap ? CAFE2 : "#2E180C"} />
          <path d="M 0 -26 Q -8 0 0 26" stroke={cap ? LECHE : CAFE2} strokeWidth={4} fill="none" />
        </g>
      ))}
      <text x={0} y={-50} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={64} fill={cap ? CAFE : CREMA}>
        Coffee
      </text>
      <text x={0} y={20} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={64} fill={cap ? CAFE : CREMA}>
        Delight
      </text>
      <rect x={-120} y={50} width={240} height={50} rx={25} fill={DORADO} />
      <text x={0} y={86} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={30} fill={CAFE}>
        {v}
      </text>
      <text x={0} y={150} textAnchor="middle" fontFamily="Georgia, serif" fontSize={26} fill={cap ? CAFE : CREMA}>
        Colombina
      </text>
    </g>
  );
};

// Dulce envuelto
const Dulce: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly rot?: number; readonly cap?: boolean }> = ({ x, y, s = 1, rot = 0, cap = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -60 0 L -95 -28 L -95 28 Z" fill={DORADO} />
    <path d="M 60 0 L 95 -28 L 95 28 Z" fill={DORADO} />
    <ellipse cx={0} cy={0} rx={62} ry={40} fill={cap ? LECHE : CAFE2} stroke={DORADO} strokeWidth={5} />
    <ellipse cx={-14} cy={-12} rx={22} ry={8} fill="#FFFFFF" opacity={0.25} />
  </g>
);

// Cabeza de perfil (mirando a la derecha)
const Cabeza: React.FC<{ readonly op?: number }> = ({ op = 1 }) => (
  <g opacity={op}>
    <path
      d="M 300 1400 L 300 1180 Q 220 1100 240 960 Q 260 760 470 720 Q 680 700 740 880 L 790 960 L 750 990 L 770 1040 L 745 1070 L 760 1110 Q 740 1170 650 1160 L 640 1260 L 640 1400 Z"
      fill="#E8C4A0"
      opacity={0.18}
      stroke={CREMA}
      strokeWidth={5}
    />
  </g>
);

const Inicio: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <Bolsa x={540} y={980} s={1.25} rot={4 * Math.sin(t * 1.5)} />
    <Dulce x={820} y={1330} s={1.1} rot={-20 + 6 * Math.sin(t * 2)} />
    <Texto x={830} y={640} size={130} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿por qué este dulce sabe a café?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const q = interpolate(t, [0.6, 0.9], [0, 1], clamp);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tienda], [1.12, 1])}>
        <Inicio t={t} q={q} />
      </Lienzo>
      <Flash t={t} d={0.6} color={C.white} />
    </>
  );
};

// B. Lo consigues en la tienda de la esquina: Coffee Delight, Clásico o Cappuccino + bucle
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const dos = aparece(t, T.clasico);
  return (
    <Lienzo zoom={interpolate(t, [T.tienda, T.sabor], [1, 1.04])}>
      {/* tienda de la esquina: toldo y mostrador */}
      <g opacity={0.9 * (1 - dos * 0.6)}>
        {new Array(8).fill(0).map((_, k) => (
          <path key={k} d={`M ${60 + k * 120} 640 L ${180 + k * 120} 640 L ${180 + k * 120} 700 Q ${120 + k * 120} 740 ${60 + k * 120} 700 Z`} fill={k % 2 ? CREMA : "#2F7A5A"} />
        ))}
        <rect x={60} y={1380} width={960} height={140} rx={16} fill={CAFE2} />
        <Texto x={540} y={1470} size={36} color={CREMA}>
          la tienda de la esquina
        </Texto>
      </g>
      <g opacity={1 - dos}>
        <Bolsa x={540} y={1040} s={1.05} />
      </g>
      <g opacity={dos}>
        <Bolsa x={330} y={1040} s={0.85} v="Clásico" rot={-4} />
        <Bolsa x={750} y={1040} s={0.85} v="Cappuccino" rot={4} />
      </g>
      <g opacity={aparece(t, T.final)}>
        <Texto x={540} y={470} color={C.white} size={34}>
          ¿cuál va con tu pausa?: al final
        </Texto>
        <rect x={290} y={495} width={500} height={16} rx={8} fill="#2A2018" />
        <rect x={290} y={495} width={500 * interpolate(t, [T.final, T.sabor], [0, 1], clamp)} height={16} rx={8} fill={C.yellow} />
      </g>
    </Lienzo>
  );
};

// C. Gran parte del sabor del café no está en la lengua, sino en la nariz
export const Nariz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const nar = aparece(t, T.nariz);
  return (
    <Lienzo zoom={interpolate(t, [T.sabor, T.aroma], [1, 1.04])}>
      <Cabeza />
      <Bolsa x={880} y={1430} s={0.42} rot={8} />
      <path d="M 560 1085 Q 640 1060 720 1080" stroke="#E8B48A" strokeWidth={22} strokeLinecap="round" fill="none" />
      <Dulce x={700} y={1078} s={0.35} />
      <g opacity={aparece(t, T.lengua) * (1 - nar)}>
        <circle cx={640} cy={1080} r={70} fill="none" stroke={C.white} strokeWidth={5} strokeDasharray="12 10" />
        <Texto x={540} y={1250} size={36} color={C.white}>
          lengua: solo una parte
        </Texto>
      </g>
      <g opacity={nar}>
        <circle cx={740} cy={930} r={70} fill="none" stroke={C.yellow} strokeWidth={6} />
        <Texto x={540} y={1250} size={40} color={C.yellow}>
          …casi todo, en la nariz
        </Texto>
      </g>
      <Texto x={540} y={620} size={40} color={CREMA} op={aparece(t, T.sabor)}>
        ¿dónde está el sabor del café?
      </Texto>
    </Lienzo>
  );
};

// D. Su aroma sube por detrás del paladar hasta tu nariz: olfato retronasal
export const Retronasal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.aroma, T.cerebro], [1, 1.04])}>
        <Cabeza />
        <Bolsa x={880} y={1430} s={0.42} rot={8} />
        <path d="M 560 1085 Q 640 1060 720 1080" stroke="#E8B48A" strokeWidth={22} strokeLinecap="round" fill="none" />
        <Dulce x={700} y={1078} s={0.35} />
        {/* camino: boca -> detrás del paladar -> nariz */}
        <path d="M 680 1060 Q 520 1060 500 980 Q 500 920 600 920 L 750 935" stroke={DORADO} strokeWidth={4} strokeDasharray="10 10" fill="none" opacity={aparece(t, T.paladar)} />
        {new Array(8).fill(0).map((_, k) => {
          const u = (t * 0.5 + k / 8) % 1;
          // punto aproximado sobre la ruta
          const px = u < 0.5 ? 680 - u * 2 * 180 : 500 + (u - 0.5) * 2 * 250;
          const py = u < 0.5 ? 1060 - u * 2 * 130 : 930;
          return <circle key={k} cx={px} cy={py} r={10} fill={DORADO} opacity={aparece(t, T.aroma) * (0.4 + 0.6 * Math.sin(u * Math.PI))} />;
        })}
        <Texto x={540} y={620} size={40} color={CREMA} op={aparece(t, T.aroma)}>
          el aroma sube por dentro
        </Texto>
        <Texto x={540} y={1300} size={34} color={C.white} op={aparece(t, T.paladar)}>
          por detrás del paladar hasta la nariz
        </Texto>
        <Texto x={540} y={1380} size={46} color={C.yellow} op={aparece(t, T.retronasal)}>
          olfato retronasal
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.retronasal} color={C.yellow} />
    </>
  );
};

// E. Tu cerebro junta aroma y dulce y lo lee como café, aunque no tengas una taza
export const Cerebro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cafe = aparece(t, T.lee);
  return (
    <Lienzo zoom={interpolate(t, [T.cerebro, T.clasico2], [1, 1.04])}>
      <g transform="translate(540 820)">
        <path d="M -180 40 Q -200 -90 -90 -120 Q -20 -170 60 -130 Q 190 -120 190 10 Q 210 110 90 120 Q 0 150 -90 120 Q -200 120 -180 40 Z" fill={CREMA} opacity={0.3} stroke={CREMA} strokeWidth={5} />
        <path d="M -100 -60 Q -40 -20 -90 40 M 0 -100 Q 30 -30 -10 30 M 90 -70 Q 60 0 110 50" stroke={CREMA} strokeWidth={5} fill="none" opacity={0.6} />
      </g>
      <g opacity={aparece(t, T.cerebro)}>
        <Texto x={260} y={1150} size={40} color={DORADO}>
          aroma
        </Texto>
        <Texto x={540} y={1150} size={50} color={C.white}>
          +
        </Texto>
        <Texto x={820} y={1150} size={40} color={C.yellow} op={aparece(t, T.dulce)}>
          dulce
        </Texto>
        <g opacity={aparece(t, T.dulce)}>
          <Dulce x={820} y={1050} s={0.7} />
        </g>
      </g>
      <g opacity={cafe}>
        <Texto x={540} y={1270} size={50} color={C.white}>
          =
        </Texto>
        <Texto x={540} y={1380} size={64} color={CREMA}>
          café
        </Texto>
      </g>
      <Bolsa x={190} y={1400} s={0.42} rot={-8} />
      <g opacity={aparece(t, T.taza)} transform="translate(840 1350)">
        <path d="M -50 -40 L 50 -40 L 40 40 L -40 40 Z" fill="none" stroke={GRIS_C} strokeWidth={6} />
        <line x1={-70} y1={-70} x2={70} y2={60} stroke={GRIS_C} strokeWidth={6} />
      </g>
      <Texto x={540} y={1500} size={32} color={GRIS_C} op={aparece(t, T.taza)}>
        sin taza en la mano
      </Texto>
    </Lienzo>
  );
};

// F. Clásico: café intenso; Cappuccino: más suave y cremoso
export const Variantes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.clasico2, T.bolsillo], [1, 1.04])}>
        <g opacity={aparece(t, T.clasico2)}>
          <Bolsa x={300} y={950} s={0.8} v="Clásico" rot={-3} />
          <Dulce x={300} y={1290} s={0.9} />
          <Texto x={300} y={1420} size={36} color={CREMA} op={aparece(t, T.intenso)}>
            café intenso
          </Texto>
        </g>
        <g opacity={aparece(t, T.cappuccino2)}>
          <Bolsa x={780} y={950} s={0.8} v="Cappuccino" rot={3} />
          <Dulce x={780} y={1290} s={0.9} cap />
          <Texto x={780} y={1420} size={36} color={CREMA} op={aparece(t, T.cremoso)}>
            suave y cremoso
          </Texto>
        </g>
        <Texto x={540} y={600} size={40} color={C.yellow} op={aparece(t, T.clasico2)}>
          ¿cuál va con tu pausa?
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.clasico2} color={CREMA} />
    </>
  );
};

// G. Tu café de bolsillo: en el bus, en la oficina o en la fila del banco
export const Bolsillo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lugares: [string, number][] = [
    ["en el bus", T.bus],
    ["en la oficina", T.oficina],
    ["en la fila del banco", T.fila],
  ];
  return (
    <Lienzo zoom={interpolate(t, [T.bolsillo, T.porEso], [1, 1.04])}>
      {/* bolsillo de jean con el dulce asomando */}
      <g transform="translate(540 930)">
        <Dulce x={0} y={-130} s={1.1} rot={-15 + 5 * Math.sin(t * 2)} />
        <path d="M -200 -120 L 200 -120 L 180 160 Q 0 230 -180 160 Z" fill="#2E4A6B" stroke={DORADO} strokeWidth={6} strokeDasharray="14 10" />
        <Bolsa x={250} y={60} s={0.45} rot={10} />
      </g>
      <Texto x={540} y={620} size={44} color={C.yellow} op={aparece(t, T.bolsillo)}>
        tu café de bolsillo
      </Texto>
      {lugares.map(([txt, tt]) => (
        <Texto key={txt} x={540} y={1300 + lugares.findIndex((l) => l[0] === txt) * 70} size={38} color={CREMA} op={aparece(t, tt)}>
          {txt}
        </Texto>
      ))}
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
