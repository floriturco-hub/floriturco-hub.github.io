import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/astronautas/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  tierra: 2.4,
  paso: 3.36,
  piernas: 5.54,
  gravedad: 8.28,
  estacion: 9.08,
  flotas: 10.08,
  dejan: 12.82,
  cuerpo: 14.18,
  desmontar: 16.36,
  misiones: 17.98,
  veinte: 21.76,
  pantorrillas: 23.68,
  huesos: 26.68,
  uno: 28.42,
  corazon: 30.78,
  encoge: 31.84,
  bombear: 32.92,
  solucion: 35.52,
  horas: 36.5,
  maquina: 38.58,
  vacio: 39.38,
  kilos: 41.58,
  cinta: 43.34,
  arneses: 44.64,
  volver: 46.52,
  caminar: 48.2,
  gravedad2: 50.04,
  fin: 52.0,
};

const TRAJE = "#E8E6F0";
const MUSCULO = "#E8703C";

// Astronauta de cuerpo entero (traje sin casco opaco); musculo 0..1 resalta piernas y espalda
const Astronauta: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly rot?: number;
  readonly musculo?: number;
  readonly gris?: number;
  readonly paso?: number;
  readonly brazo?: number;
}> = ({ x, y, s, rot = 0, musculo = 0, gris = 0, paso = 0, brazo = 0 }) => {
  const colM = gris > 0.5 ? "#8C88A8" : MUSCULO;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* piernas */}
      {[-1, 1].map((l) => (
        <g key={l} transform={`rotate(${l * paso * 18} 0 60)`}>
          <rect
            x={l * 26 - 22}
            y={60}
            width={44}
            height={150}
            rx={22}
            fill={TRAJE}
          />
          <rect
            x={l * 26 - 16}
            y={80}
            width={32}
            height={110}
            rx={16}
            fill={colM}
            opacity={musculo * 0.85}
          />
          <rect
            x={l * 26 - 28}
            y={196}
            width={56}
            height={30}
            rx={12}
            fill="#8C88A8"
          />
        </g>
      ))}
      {/* torso y mochila */}
      <rect x={-78} y={-110} width={40} height={150} rx={14} fill="#C8C4D8" />
      <rect x={-60} y={-120} width={120} height={190} rx={40} fill={TRAJE} />
      <rect
        x={-46}
        y={-100}
        width={30}
        height={150}
        rx={14}
        fill={colM}
        opacity={musculo * 0.7}
      />
      <rect x={-20} y={-60} width={50} height={36} rx={8} fill="#5A7AB8" />
      {/* brazos */}
      {[-1, 1].map((l) => (
        <g key={l} transform={`rotate(${l * (20 + brazo * 40)} ${l * 56} -90)`}>
          <rect
            x={l * 56 - 18}
            y={-100}
            width={36}
            height={130}
            rx={18}
            fill={TRAJE}
          />
          <circle cx={l * 56} cy={38} r={20} fill="#8C88A8" />
        </g>
      ))}
      {/* casco */}
      <circle cx={0} cy={-170} r={62} fill={TRAJE} />
      <ellipse cx={8} cy={-168} rx={44} ry={36} fill="#1A2448" />
      <ellipse cx={22} cy={-182} rx={12} ry={8} fill="#FFFFFF" opacity={0.5} />
    </g>
  );
};

// Bíceps que se desinfla
const Brazo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly lleno: number;
}> = ({ x, y, s, lleno }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-40} width={240} height={80} rx={40} fill="#E8B8A0" />
    <rect
      x={-20}
      y={-260}
      width={80}
      height={260}
      rx={40}
      fill="#E8B8A0"
      transform="rotate(10 20 0)"
    />
    <ellipse
      cx={-100}
      cy={-30 - 40 * lleno}
      rx={90}
      ry={30 + 60 * lleno}
      fill="#E8A890"
    />
    <circle cx={40} cy={-280} r={60} fill="#E8B8A0" />
  </g>
);

// A. Gancho: el espacio se come tus músculos
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lleno = interpolate(t, [0.4, 1.6], [1, 0.25], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.tierra], [1.08, 1])}>
        {new Array(60).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={random(`st${k}`) * 1080}
            cy={random(`sy${k}`) * 1400 + 300}
            r={1.5 + random(`sr${k}`) * 2}
            fill={C.white}
            opacity={0.5}
          />
        ))}
        <Brazo x={620} y={1060} s={1.6} lleno={lleno} />
        <Texto x={540} y={1340} color={C.orange} size={70} op={aparece(t, 1.0)}>
          {`-${Math.round((1 - lleno) * 27)} %`}
        </Texto>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.orange} />
    </>
  );
};

// B. En la Tierra: cada paso lucha contra la gravedad
export const Tierra: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const paso = Math.sin(t * 5) * aparece(t, T.paso);
  return (
    <Lienzo zoom={interpolate(t, [T.tierra, T.estacion], [1, 1.03])}>
      <rect x={0} y={1180} width={1080} height={400} fill="#2E4A3A" />
      <Astronauta
        x={540}
        y={920}
        s={1.2}
        musculo={aparece(t, T.piernas)}
        paso={paso}
      />
      <g opacity={aparece(t, T.gravedad - 0.8)}>
        {[300, 780].map((x) => (
          <g key={x}>
            <line
              x1={x}
              y1={500}
              x2={x}
              y2={760}
              stroke={C.yellow}
              strokeWidth={14}
            />
            <path
              d={`M ${x - 30} 730 L ${x} 780 L ${x + 30} 730`}
              stroke={C.yellow}
              strokeWidth={14}
              fill="none"
            />
          </g>
        ))}
        <Texto x={540} y={470} color={C.yellow} size={48}>
          gravedad
        </Texto>
      </g>
      <Texto
        x={540}
        y={1300}
        color={MUSCULO}
        size={40}
        op={aparece(t, T.piernas)}
      >
        piernas y espalda trabajan
      </Texto>
    </Lienzo>
  );
};

// Estación espacial esquemática
const Estacion: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
}> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-20} width={80} height={40} rx={8} fill="#C8C4D8" />
    <rect x={-160} y={-8} width={320} height={16} fill="#8C88A8" />
    {[-1, 1].map((l) => (
      <g key={l}>
        <rect
          x={l * 170 - 50}
          y={-70}
          width={100}
          height={60}
          fill="#3A5AA8"
          stroke="#8C88A8"
          strokeWidth={4}
        />
        <rect
          x={l * 170 - 50}
          y={10}
          width={100}
          height={60}
          fill="#3A5AA8"
          stroke="#8C88A8"
          strokeWidth={4}
        />
      </g>
    ))}
  </g>
);

// C. En la estación: flotas y el cuerpo desmonta el músculo
export const Flota: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gris = aparece(t, T.dejan);
  const desmonta = interpolate(t, [T.desmontar, T.misiones], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.estacion, T.misiones], [1, 1.04])}>
      {new Array(60).fill(0).map((_, k) => (
        <circle
          key={k}
          cx={random(`fs${k}`) * 1080}
          cy={random(`fy${k}`) * 1500 + 300}
          r={1.5 + random(`fr${k}`) * 2}
          fill={C.white}
          opacity={0.5}
        />
      ))}
      <Estacion x={540} y={470} s={1.3} />
      <Astronauta
        x={540}
        y={960 + 20 * Math.sin(t * 1.5)}
        s={1.1}
        rot={t * 12}
        musculo={1 - gris * 0.6}
        gris={gris}
        brazo={0.6}
      />
      {desmonta > 0
        ? new Array(14).fill(0).map((_, k) => {
            const d = desmonta * (120 + random(`dm${k}`) * 160);
            const a = random(`da${k}`) * Math.PI * 2;
            return (
              <rect
                key={k}
                x={540 + Math.cos(a) * d}
                y={1000 + Math.sin(a) * d}
                width={14}
                height={14}
                rx={3}
                fill={MUSCULO}
                opacity={1 - desmonta * 0.7}
              />
            );
          })
        : null}
      <Texto
        x={540}
        y={1340}
        color={C.cyan}
        size={44}
        op={aparece(t, T.flotas)}
      >
        nada pesa
      </Texto>
      <Texto
        x={540}
        y={1420}
        color={MUSCULO}
        size={40}
        op={aparece(t, T.desmontar)}
      >
        lo que no usas, se desmonta
      </Texto>
    </Lienzo>
  );
};

// Silueta humana con zonas resaltadas
const Cuerpo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly zonas: number;
}> = ({ x, y, s, zonas }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-260} r={50} fill="#3A3460" />
    <rect x={-70} y={-200} width={140} height={220} rx={40} fill="#3A3460" />
    <rect x={-110} y={-190} width={36} height={200} rx={18} fill="#3A3460" />
    <rect x={74} y={-190} width={36} height={200} rx={18} fill="#3A3460" />
    {[-1, 1].map((l) => (
      <g key={l}>
        <rect
          x={l * 35 - 28}
          y={20}
          width={56}
          height={150}
          rx={26}
          fill="#3A3460"
        />
        <rect
          x={l * 35 - 24}
          y={170}
          width={48}
          height={140}
          rx={22}
          fill="#3A3460"
        />
        <rect
          x={l * 35 - 22}
          y={30}
          width={44}
          height={120}
          rx={20}
          fill={MUSCULO}
          opacity={zonas * 0.85}
        />
        <rect
          x={l * 35 - 18}
          y={185}
          width={36}
          height={100}
          rx={16}
          fill={MUSCULO}
          opacity={zonas * 0.85}
        />
      </g>
    ))}
    <rect
      x={-50}
      y={-180}
      width={100}
      height={180}
      rx={30}
      fill={MUSCULO}
      opacity={zonas * 0.5}
    />
  </g>
);

// D. Pérdida: hasta 20 % de músculo; 1 % de hueso al mes
export const Perdida: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.misiones, T.corazon], [1, 1.03])}>
      <Tarjeta x={190} y={360} w={700} h={160} op={aparece(t, T.misiones)}>
        <Texto x={540} y={462} color={C.white} size={48}>
          1-2 semanas en órbita
        </Texto>
      </Tarjeta>
      <Cuerpo x={340} y={940} s={1.1} zonas={aparece(t, T.pantorrillas)} />
      <g opacity={aparece(t, T.veinte)}>
        <Texto x={780} y={820} color={MUSCULO} size={100}>
          {`-${Math.round(interpolate(t, [T.veinte, T.veinte + 1.2], [0, 20], clamp))} %`}
        </Texto>
        <Texto x={780} y={880} color={C.grey} size={32}>
          de músculo
        </Texto>
      </g>
      <g opacity={aparece(t, T.huesos)} transform="translate(780 1080)">
        <rect x={-110} y={-18} width={220} height={36} rx={18} fill="#E8DCC8" />
        {[-1, 1].map((l) => (
          <g key={l}>
            <circle cx={l * 110} cy={-18} r={26} fill="#E8DCC8" />
            <circle cx={l * 110} cy={18} r={26} fill="#E8DCC8" />
          </g>
        ))}
        <Texto x={0} y={110} color="#E8DCC8" size={44} op={aparece(t, T.uno)}>
          -1 % al mes
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. El corazón también se encoge
export const Corazon: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const s =
    interpolate(t, [T.encoge, T.encoge + 1.2], [1, 0.85], suave) *
    (1 + 0.06 * Math.max(0, Math.sin(t * 7)));
  return (
    <Lienzo zoom={interpolate(t, [T.corazon, T.solucion], [1, 1.03])}>
      <g
        transform={`translate(540 860) scale(${2.2 * s})`}
        opacity={aparece(t, T.corazon)}
      >
        <path
          d="M 0 90 C -150 0 -110 -110 0 -50 C 110 -110 150 0 0 90 Z"
          fill={C.red}
        />
      </g>
      <g opacity={aparece(t, T.encoge)}>
        <path d={`M 160 860 L 260 860`} stroke={C.white} strokeWidth={8} />
        <path
          d={`M 230 830 L 270 860 L 230 890`}
          stroke={C.white}
          strokeWidth={8}
          fill="none"
        />
        <path d={`M 920 860 L 820 860`} stroke={C.white} strokeWidth={8} />
        <path
          d={`M 850 830 L 810 860 L 850 890`}
          stroke={C.white}
          strokeWidth={8}
          fill="none"
        />
      </g>
      <Texto x={540} y={1260} color={C.red} size={48} op={aparece(t, T.encoge)}>
        el corazón se encoge
      </Texto>
      <Texto
        x={540}
        y={1340}
        color={C.grey}
        size={38}
        op={aparece(t, T.bombear)}
      >
        bombear le cuesta menos
      </Texto>
    </Lienzo>
  );
};

// F. Ejercicio: 2 horas al día, pesas de vacío y cinta con arneses
export const Ejercicio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const cinta = aparece(t, T.cinta);
  const sube = Math.abs(Math.sin(t * 2.5));
  return (
    <Lienzo zoom={interpolate(t, [T.solucion, T.volver], [1, 1.03])}>
      <Tarjeta
        x={290}
        y={360}
        w={500}
        h={150}
        op={aparece(t, T.horas) * (1 - cinta)}
      >
        <Texto x={540} y={458} color={C.yellow} size={60}>
          2 h / día
        </Texto>
      </Tarjeta>
      {/* máquina de pesas con cilindros de vacío */}
      <g opacity={aparece(t, T.maquina) * (1 - cinta)}>
        <rect x={180} y={600} width={60} height={560} rx={10} fill="#5A5670" />
        <rect x={840} y={600} width={60} height={560} rx={10} fill="#5A5670" />
        {[200, 860].map((x) => (
          <g key={x}>
            <rect
              x={x - 10}
              y={900}
              width={60}
              height={240}
              rx={20}
              fill="#3A3A4A"
              stroke={C.cyan}
              strokeWidth={4}
              opacity={aparece(t, T.vacio)}
            />
            <rect
              x={x}
              y={920 + 100 * (1 - sube)}
              width={40}
              height={20}
              rx={6}
              fill={C.cyan}
              opacity={aparece(t, T.vacio)}
            />
          </g>
        ))}
        <rect
          x={160}
          y={720 + 120 * (1 - sube)}
          width={760}
          height={30}
          rx={14}
          fill="#C8C4D8"
        />
        <Astronauta
          x={540}
          y={980}
          s={0.85}
          brazo={1 - 0.5 * sube}
          musculo={0.8}
        />
        <Texto
          x={540}
          y={1260}
          color={C.cyan}
          size={40}
          op={aparece(t, T.vacio)}
        >
          cilindros de vacío
        </Texto>
        <Texto
          x={540}
          y={1360}
          color={C.yellow}
          size={60}
          op={aparece(t, T.kilos)}
        >
          {`hasta ${Math.round(interpolate(t, [T.kilos, T.kilos + 1], [0, 270], clamp))} kg`}
        </Texto>
      </g>
      {/* cinta de correr con arneses */}
      <g opacity={cinta}>
        <rect x={200} y={1150} width={680} height={40} rx={20} fill="#3A3A4A" />
        {new Array(10).fill(0).map((_, k) => (
          <rect
            key={k}
            x={210 + ((((k * 70 - t * 300) % 680) + 680) % 680)}
            y={1160}
            width={30}
            height={20}
            rx={4}
            fill="#5A5670"
          />
        ))}
        <Astronauta
          x={540}
          y={900}
          s={1}
          paso={Math.sin(t * 7)}
          musculo={0.8}
        />
        {[-1, 1].map((l) => (
          <path
            key={l}
            d={`M ${540 + l * 60} 880 Q ${540 + l * 160} 1020 ${540 + l * 300} 1150`}
            stroke={C.yellow}
            strokeWidth={8}
            fill="none"
            strokeDasharray="20 12"
            opacity={aparece(t, T.arneses)}
          />
        ))}
        <Texto
          x={540}
          y={1320}
          color={C.yellow}
          size={44}
          op={aparece(t, T.arneses)}
        >
          arneses que tiran hacia abajo
        </Texto>
      </g>
    </Lienzo>
  );
};

// Persona simple
const Persona: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly color: string;
}> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={0} cy={-200} r={40} fill={color} />
    <rect x={-45} y={-150} width={90} height={170} rx={30} fill={color} />
    <rect x={-40} y={20} width={30} height={150} rx={14} fill={color} />
    <rect x={10} y={20} width={30} height={150} rx={14} fill={color} />
  </g>
);

// G. Al volver necesitan ayuda para caminar
export const Vuelta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.volver, T.gravedad2], [1, 1.03])}>
      <rect x={0} y={1180} width={1080} height={400} fill="#3A4A3A" />
      <g opacity={aparece(t, T.volver)}>
        <Persona x={330} y={1010} color="#4A6A9A" />
        <Persona x={750} y={1010} color="#4A6A9A" />
        <Astronauta
          x={540}
          y={950}
          s={0.95}
          rot={4 * Math.sin(t * 2)}
          paso={0.3 * Math.sin(t * 3)}
          brazo={1.2}
        />
      </g>
      <Texto
        x={540}
        y={1320}
        color={C.white}
        size={44}
        op={aparece(t, T.caminar)}
      >
        necesitan ayuda para caminar
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: la gravedad es tu entrenador invisible
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.gravedad2, T.fin + 0.5], [1, 1.05])}>
      <g transform={`translate(540 860) rotate(${t * 6})`}>
        <circle r={260} fill="#2A5AA8" />
        <path
          d="M -150 -120 q 60 -40 120 10 q 40 40 -10 90 q -60 40 -110 -20 Z"
          fill="#3A8A5A"
        />
        <path
          d="M 60 40 q 80 -30 120 30 q 10 60 -60 70 q -70 0 -60 -100 Z"
          fill="#3A8A5A"
        />
      </g>
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const a = (k / 6) * Math.PI * 2;
        return (
          <g key={k} opacity={aparece(t, T.gravedad2 + 0.3)}>
            <line
              x1={540 + Math.cos(a) * 400}
              y1={860 + Math.sin(a) * 400}
              x2={540 + Math.cos(a) * 310}
              y2={860 + Math.sin(a) * 310}
              stroke={C.yellow}
              strokeWidth={10}
            />
          </g>
        );
      })}
      <Texto
        x={540}
        y={1300}
        color={C.yellow}
        size={52}
        op={aparece(t, T.gravedad2 + 0.5)}
      >
        tu entrenador invisible
      </Texto>
    </Lienzo>
  );
};
