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

// Instantes clave (s) de public/audio/luminol/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  producto: 2.12,
  final: 5.32,
  luminol: 6.56,
  rocian: 8.56,
  apagan: 9.42,
  sangre: 10.7,
  azul: 11.68,
  porque: 13.12,
  hierro: 13.88,
  acelera: 15.64,
  luz: 19.52,
  funciona: 21.52,
  invisible: 22.94,
  diluida: 23.76,
  anos: 24.88,
  trampa: 26.3,
  lejia: 27.18,
  apaga: 28.78,
  culpable: 31.58,
  porque2: 33.32,
  fin: 35.8,
};

const AZUL = "#5AB8FF";
const SUELO = "#2A2438";

// Manchas que brillan en azul (huellas y salpicaduras); brillo 0..1
const Manchas: React.FC<{ readonly brillo: number; readonly t: number }> = ({
  brillo,
  t,
}) => (
  <g opacity={brillo}>
    <defs>
      <filter id="resplandor" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
    {/* mano */}
    <g transform="translate(380 980) rotate(-15)" filter="url(#resplandor)">
      <ellipse cx={0} cy={0} rx={70} ry={85} fill={AZUL} />
      {[-48, -18, 14, 44].map((x, k) => (
        <rect
          key={k}
          x={x - 14}
          y={-190 + Math.abs(k - 1.5) * 18}
          width={28}
          height={110}
          rx={14}
          fill={AZUL}
        />
      ))}
      <rect
        x={60}
        y={-40}
        width={26}
        height={90}
        rx={13}
        fill={AZUL}
        transform="rotate(-40 70 0)"
      />
    </g>
    {/* salpicaduras y arrastre */}
    {new Array(14).fill(0).map((_, k) => (
      <circle
        key={k}
        cx={560 + random(`sp${k}`) * 380}
        cy={1050 + random(`spy${k}`) * 260}
        r={8 + random(`spr${k}`) * 30}
        fill={AZUL}
        opacity={0.6 + 0.4 * Math.sin(t * 3 + k)}
        filter="url(#resplandor)"
      />
    ))}
    <path
      d="M 620 1250 Q 760 1180 900 1260"
      stroke={AZUL}
      strokeWidth={30}
      fill="none"
      strokeLinecap="round"
      opacity={0.6}
      filter="url(#resplandor)"
    />
  </g>
);

// Suelo en perspectiva
const Suelo: React.FC<{ readonly oscuro: number }> = ({ oscuro }) => (
  <g>
    <polygon points="0,700 1080,700 1080,1500 0,1500" fill={SUELO} />
    {new Array(8).fill(0).map((_, k) => (
      <line
        key={k}
        x1={k * 154}
        y1={700}
        x2={-300 + k * 240}
        y2={1500}
        stroke="#3A3450"
        strokeWidth={4}
      />
    ))}
    {new Array(5).fill(0).map((_, k) => (
      <line
        key={k}
        x1={0}
        y1={760 + k * k * 30}
        x2={1080}
        y2={760 + k * k * 30}
        stroke="#3A3450"
        strokeWidth={4}
      />
    ))}
    <rect
      x={0}
      y={0}
      width={1080}
      height={1920}
      fill="#020108"
      opacity={oscuro * 0.75}
    />
  </g>
);

// Botella pulverizadora
const Spray: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly color: string;
  readonly etiqueta: string;
}> = ({ x, y, s, color, etiqueta }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-120} width={140} height={260} rx={30} fill={color} />
    <rect x={-30} y={-180} width={60} height={60} rx={10} fill="#C8C4D8" />
    <path d="M 30 -170 L 90 -170 L 90 -150 L 30 -150 Z" fill="#8C88A8" />
    <rect x={-55} y={-30} width={110} height={70} rx={10} fill="#E8E6F0" />
    <text
      x={0}
      y={14}
      textAnchor="middle"
      fill="#1A1630"
      fontFamily="JetBrains Mono"
      fontWeight={700}
      fontSize={24}
    >
      {etiqueta}
    </text>
  </g>
);

// A. Gancho: la sangre limpiada brilla
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.producto], [1.1, 1])}>
        <Suelo oscuro={1} />
        <Manchas brillo={interpolate(t, [0.2, 1.0], [0, 1], clamp)} t={t} />
      </Lienzo>
      <Flash t={t} d={1.0} color={AZUL} />
    </>
  );
};

// B. Un producto de limpieza puede engañar
export const Engano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sacude = Math.sin(t * 8) * 6 * aparece(t, T.producto);
  return (
    <Lienzo zoom={interpolate(t, [T.producto, T.luminol], [1, 1.06])}>
      <g transform={`rotate(${sacude} 540 900)`}>
        <Spray x={540} y={900} s={2} color="#E8E6F0" etiqueta="???" />
      </g>
      <Texto
        x={540}
        y={540}
        color={C.yellow}
        size={160}
        op={aparece(t, T.producto + 0.6)}
      >
        ?
      </Texto>
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.luminol], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={40}>
          lo verás al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Rocían luminol, apagan la luz y aparece el brillo azul
export const Rocian: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const oscuro = interpolate(t, [T.apagan, T.apagan + 0.3], [0, 1], clamp);
  const brillo = interpolate(t, [T.sangre, T.azul + 0.4], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.luminol, T.porque], [1, 1.05])}>
      <Suelo oscuro={oscuro} />
      <g opacity={1 - oscuro}>
        <Spray x={820} y={560} s={1.1} color={AZUL} etiqueta="luminol" />
        {new Array(24).fill(0).map((_, k) => {
          const u = (t * 1.2 + random(`m${k}`)) % 1;
          return (
            <circle
              key={k}
              cx={760 - u * 420 + random(`mx${k}`) * 80}
              cy={420 + u * 600 + random(`my${k}`) * 80}
              r={6}
              fill={AZUL}
              opacity={aparece(t, T.rocian) * (1 - u) * 0.7}
            />
          );
        })}
      </g>
      <Manchas brillo={brillo} t={t} />
      <g opacity={aparece(t, T.apagan) * (1 - brillo)}>
        <circle
          cx={540}
          cy={560}
          r={60}
          fill="none"
          stroke={C.grey}
          strokeWidth={8}
        />
        <line
          x1={490}
          y1={510}
          x2={590}
          y2={610}
          stroke={C.grey}
          strokeWidth={8}
        />
        <Texto x={540} y={680} color={C.grey} size={36}>
          luz apagada
        </Texto>
      </g>
    </Lienzo>
  );
};

// Grupo hemo: anillo con hierro en el centro
const Hemo: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly t: number;
  readonly activo: number;
}> = ({ x, y, s, t, activo }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(4).fill(0).map((_, k) => (
      <polygon
        key={k}
        points={new Array(5)
          .fill(0)
          .map((__, j) => {
            const a = (j / 5) * Math.PI * 2 + (k * Math.PI) / 2;
            return `${Math.cos((k * Math.PI) / 2) * 110 + Math.cos(a) * 50},${Math.sin((k * Math.PI) / 2) * 110 + Math.sin(a) * 50}`;
          })
          .join(" ")}
        fill="none"
        stroke={C.red}
        strokeWidth={8}
      />
    ))}
    {[0, 1, 2, 3].map((k) => (
      <line
        key={k}
        x1={0}
        y1={0}
        x2={Math.cos((k * Math.PI) / 2) * 70}
        y2={Math.sin((k * Math.PI) / 2) * 70}
        stroke={C.red}
        strokeWidth={6}
      />
    ))}
    <circle r={44 + 6 * activo * Math.sin(t * 12)} fill={C.orange} />
    <text
      y={16}
      textAnchor="middle"
      fill="#1A1630"
      fontFamily="JetBrains Mono"
      fontWeight={700}
      fontSize={44}
    >
      Fe
    </text>
  </g>
);

// D. La química: hierro de la hemoglobina acelera luminol + agua oxigenada -> luz
export const Quimica: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const choque = interpolate(t, [T.acelera, T.luz], [0, 1], suave);
  const luz = aparece(t, T.luz);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.porque, T.funciona], [1, 1.05])}>
        <Texto
          x={540}
          y={430}
          color={C.red}
          size={46}
          op={aparece(t, T.porque)}
        >
          hemoglobina
        </Texto>
        <Hemo x={540} y={720} s={1.2} t={t} activo={aparece(t, T.acelera)} />
        <Texto
          x={540}
          y={975}
          color={C.orange}
          size={38}
          op={aparece(t, T.hierro)}
        >
          tiene hierro
        </Texto>
        <g opacity={aparece(t, T.acelera) * (1 - luz)}>
          <rect
            x={120 + choque * 200}
            y={1040}
            width={260}
            height={90}
            rx={24}
            fill={AZUL}
          />
          <Texto x={250 + choque * 200} y={1098} color="#1A1630" size={34}>
            luminol
          </Texto>
          <rect
            x={700 - choque * 200}
            y={1040}
            width={260}
            height={90}
            rx={24}
            fill="#C8E8F8"
          />
          <Texto x={830 - choque * 200} y={1098} color="#1A1630" size={34}>
            H2O2
          </Texto>
        </g>
        <g opacity={luz}>
          {new Array(14).fill(0).map((_, k) => {
            const a = (k / 14) * Math.PI * 2;
            const d = 60 + (((t - T.luz) * 300) % 260);
            return (
              <circle
                key={k}
                cx={540 + Math.cos(a) * d}
                cy={1085 + Math.sin(a) * d * 0.7}
                r={14}
                fill={AZUL}
                opacity={1 - d / 320}
              />
            );
          })}
          <Texto x={540} y={1380} color={AZUL} size={50}>
            energía = luz
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={T.luz} color={AZUL} />
    </>
  );
};

// E. Funciona con manchas invisibles, diluidas y viejas
export const Funciona: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const fase = t < T.diluida ? 0 : t < T.anos ? 1 : 2;
  return (
    <Lienzo zoom={interpolate(t, [T.funciona, T.trampa], [1, 1.04])}>
      <g opacity={fase === 0 ? 1 : 0}>
        <Suelo oscuro={1} />
        <Manchas brillo={aparece(t, T.invisible)} t={t} />
        <Texto x={540} y={480} color={C.grey} size={40}>
          mancha invisible
        </Texto>
      </g>
      <g opacity={fase === 1 ? 1 : 0}>
        <circle cx={540} cy={560} r={30} fill={C.red} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect
              x={150 + k * 210}
              y={800}
              width={150}
              height={260}
              rx={20}
              fill="#C8E8F8"
              opacity={0.35}
            />
            <rect
              x={150 + k * 210}
              y={900}
              width={150}
              height={160}
              rx={20}
              fill={C.red}
              opacity={0.6 / (k * 3 + 1)}
            />
          </g>
        ))}
        <Texto x={540} y={1200} color={C.white} size={54}>
          x1000
        </Texto>
      </g>
      <g opacity={fase === 2 ? 1 : 0}>
        <Tarjeta x={290} y={600} w={500} h={400}>
          <rect x={290} y={600} width={500} height={90} rx={24} fill={C.red} />
          <Texto x={540} y={850} color={C.white} size={110}>
            {`${2020 + Math.min(6, Math.floor((t - T.anos) * 4))}`}
          </Texto>
        </Tarjeta>
        <Texto x={540} y={1150} color={AZUL} size={44}>
          años después
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. La trampa: la lejía también brilla, pero se apaga rápido
export const Trampa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const compara = aparece(t, T.apaga);
  const d = t - T.apaga;
  const lejia = d < 0 ? 0 : Math.max(0, 1 - d / 0.8);
  return (
    <Lienzo zoom={interpolate(t, [T.trampa, T.porque2], [1, 1.04])}>
      <g opacity={1 - compara}>
        <Spray x={540} y={820} s={1.8} color="#E8E6F0" etiqueta="lejía" />
        <g opacity={aparece(t, T.lejia)}>
          {new Array(10).fill(0).map((_, k) => (
            <circle
              key={k}
              cx={540 + Math.cos(k) * 260}
              cy={820 + Math.sin(k) * 260}
              r={20}
              fill={AZUL}
              opacity={0.5 + 0.5 * Math.sin(t * 20 + k)}
            />
          ))}
        </g>
      </g>
      <g opacity={compara}>
        <Tarjeta x={80} y={480} w={440} h={600}>
          <circle cx={300} cy={760} r={130} fill={AZUL} opacity={0.85} />
          <Texto x={300} y={1020} color={AZUL} size={40}>
            sangre
          </Texto>
          <Texto x={300} y={1060} color={C.grey} size={26}>
            brillo que dura
          </Texto>
        </Tarjeta>
        <Tarjeta x={560} y={480} w={440} h={600}>
          <circle
            cx={780}
            cy={760}
            r={130 * (0.6 + 0.4 * lejia)}
            fill={AZUL}
            opacity={0.15 + 0.8 * lejia}
          />
          <Texto x={780} y={1020} color={C.white} size={40}>
            lejía
          </Texto>
          <Texto x={780} y={1060} color={C.grey} size={26}>
            destello y se apaga
          </Texto>
        </Tarjeta>
      </g>
      <g opacity={aparece(t, T.culpable)}>
        <circle
          cx={540}
          cy={1300}
          r={70}
          fill="none"
          stroke={C.yellow}
          strokeWidth={12}
        />
        <line
          x1={590}
          y1={1350}
          x2={660}
          y2={1420}
          stroke={C.yellow}
          strokeWidth={14}
          strokeLinecap="round"
        />
      </g>
    </Lienzo>
  );
};

// G. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porque2, T.fin + 0.5], [1, 1.08])}>
      <Suelo oscuro={1} />
      <Manchas
        brillo={interpolate(t, [T.porque2, T.porque2 + 1], [0.3, 1], clamp)}
        t={t}
      />
    </Lienzo>
  );
};
