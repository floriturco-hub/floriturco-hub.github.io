import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/plumon/narracion.wav (voz x1,15), sacados con Whisper
export const T = {
  raya: 2.04,
  magia: 5.44,
  quimica: 6.78,
  yodo: 8.12,
  almidon: 12.3,
  papa: 13.28,
  mancha: 16.56,
  papel: 18.8,
  pulpa: 21.5,
  falsificador: 25.3,
  oscurece: 27.1,
  autenticos: 29.22,
  algodon: 31.1,
  amarilla: 34.9,
  limites: 37.18,
  blanquear: 41.14,
  plastico: 44.62,
  hilos: 46.58,
  agua: 48.4,
  tintas: 49.26,
  final: 50.94,
  fin: 53.3,
};

const VERDE_BILLETE = "#4E8A5E";
const OSCURO = "#1A1440";
const AMBAR = "#E8B040";

// Billete esquemático
const Billete: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly color?: string;
  readonly op?: number;
}> = ({ x, y, s = 1, color = VERDE_BILLETE, op = 1 }) => (
  <g opacity={op} transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-360}
      y={-170}
      width={720}
      height={340}
      rx={20}
      fill={color}
      stroke="#2E5A3A"
      strokeWidth={8}
    />
    <rect
      x={-330}
      y={-140}
      width={660}
      height={280}
      rx={14}
      fill="none"
      stroke="#C8E8C8"
      strokeWidth={3}
      opacity={0.5}
    />
    <circle
      cx={-170}
      cy={0}
      r={90}
      fill="none"
      stroke="#C8E8C8"
      strokeWidth={6}
      opacity={0.6}
    />
    <text
      x={220}
      y={50}
      textAnchor="middle"
      fill="#E8F8E8"
      fontFamily={mono}
      fontSize={130}
      fontWeight={700}
      opacity={0.85}
    >
      100
    </text>
  </g>
);

// Plumón que traza una raya; prog 0..1
const Raya: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly prog: number;
  readonly color: string;
  readonly largo?: number;
  readonly pluma?: number;
}> = ({ x, y, prog, color, largo = 460, pluma = 1 }) => {
  const px = x + prog * largo;
  const py = y - prog * largo * 0.35;
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={px}
        y2={py}
        stroke={color}
        strokeWidth={26}
        strokeLinecap="round"
        opacity={0.9}
      />
      <g opacity={pluma} transform={`translate(${px} ${py}) rotate(-40)`}>
        <rect x={-22} y={-300} width={44} height={260} rx={14} fill="#E8E6F0" />
        <rect x={-22} y={-300} width={44} height={60} rx={14} fill={C.yellow} />
        <path d="M -22 -40 L 22 -40 L 6 0 L -6 0 Z" fill="#3A3A4A" />
      </g>
    </g>
  );
};

// A. Gancho: el plumón delata el billete falso
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [0.1, 0.9], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.raya], [1.08, 1])}>
        <Billete x={540} y={880} />
        <Raya x={300} y={1000} prog={p} color={OSCURO} />
        <g
          opacity={aparece(t, 1.0)}
          transform={`translate(540 1250) rotate(-8) scale(${interpolate(t, [1.0, 1.2], [1.8, 1], clamp)})`}
        >
          <rect
            x={-200}
            y={-66}
            width={400}
            height={132}
            rx={16}
            fill="none"
            stroke={C.red}
            strokeWidth={12}
          />
          <Texto x={0} y={26} color={C.red} size={80}>
            FALSO
          </Texto>
        </g>
      </Lienzo>
      <Flash t={t} d={1.0} color={C.red} />
    </>
  );
};

// B. Una raya y un segundo: química de cocina
export const UnaRaya: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.raya, T.raya + 1], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.raya, T.yodo], [1, 1.04])}>
      <Billete x={540} y={780} />
      <Raya x={300} y={900} prog={p} color={AMBAR} />
      <Tarjeta x={340} y={1040} w={400} h={140} op={aparece(t, T.raya + 0.8)}>
        <Texto x={540} y={1130} color={C.yellow} size={60}>
          {"1 s"}
        </Texto>
      </Tarjeta>
      <Texto
        x={540}
        y={1280}
        color={C.grey}
        size={44}
        op={aparece(t, T.magia) * (1 - aparece(t, T.quimica))}
      >
        ¿magia?
      </Texto>
      <Texto
        x={540}
        y={1280}
        color={C.yellow}
        size={50}
        op={aparece(t, T.quimica)}
      >
        química de cocina
      </Texto>
    </Lienzo>
  );
};

// Papa cortada
const Papa: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly mancha: number;
}> = ({ x, y, mancha }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse
      rx={150}
      ry={110}
      fill="#C8A060"
      stroke="#8A6A3A"
      strokeWidth={8}
    />
    <ellipse rx={130} ry={92} fill="#F0E0B0" />
    <circle
      cx={0}
      cy={0}
      r={20 + 50 * mancha}
      fill={mancha > 0.5 ? OSCURO : "#A0602A"}
      opacity={0.3 + 0.7 * Math.min(1, mancha * 2)}
    />
  </g>
);

// C. Yodo + almidón = azul oscuro
export const Yodo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const gota = interpolate(t, [T.mancha - 0.8, T.mancha], [0, 1], clamp);
  const mancha = interpolate(t, [T.mancha, T.mancha + 0.8], [0, 1], clamp);
  return (
    <Lienzo zoom={interpolate(t, [T.yodo, T.papel], [1, 1.04])}>
      <g opacity={aparece(t, T.yodo)}>
        <rect
          x={420}
          y={420}
          width={240}
          height={260}
          rx={30}
          fill="#7A3A10"
          opacity={0.85}
        />
        <rect x={470} y={360} width={140} height={70} rx={10} fill="#3A3A4A" />
        <Texto x={540} y={570} color={C.white} size={48}>
          yodo
        </Texto>
        <circle
          cx={540}
          cy={interpolate(gota, [0, 1], [700, 920])}
          r={18}
          fill="#A0602A"
          opacity={gota > 0 && mancha === 0 ? 1 : 0}
        />
      </g>
      <g opacity={aparece(t, T.almidon)}>
        <Papa x={540} y={1000} mancha={mancha} />
        <Texto x={540} y={1170} color={C.white} size={40}>
          almidón
        </Texto>
      </g>
      <g opacity={aparece(t, T.papa)}>
        <Texto x={210} y={1290} color={C.grey} size={34}>
          papa
        </Texto>
        <Texto x={540} y={1290} color={C.grey} size={34}>
          arroz
        </Texto>
        <Texto x={870} y={1290} color={C.grey} size={34}>
          harina
        </Texto>
      </g>
      <Texto
        x={540}
        y={1400}
        color={C.cyan}
        size={44}
        op={aparece(t, T.mancha)}
      >
        = azul casi negro
      </Texto>
    </Lienzo>
  );
};

// Lupa con fibras
const Fibras: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly almidon: boolean;
  readonly color: string;
  readonly op?: number;
}> = ({ x, y, almidon, color, op = 1 }) => (
  <g opacity={op}>
    <circle
      cx={x}
      cy={y}
      r={170}
      fill="#241E44"
      stroke="#6A5A9A"
      strokeWidth={6}
    />
    {new Array(9).fill(0).map((_, k) => (
      <path
        key={k}
        d={`M ${x - 140} ${y - 120 + k * 30} q 70 ${random(`f${k}${almidon}`) * 60 - 30} 140 0 t 140 0`}
        stroke={color}
        strokeWidth={8}
        fill="none"
        opacity={0.8}
      />
    ))}
    {almidon
      ? new Array(16)
          .fill(0)
          .map((_, k) => (
            <circle
              key={k}
              cx={x + (random(`ax${k}`) - 0.5) * 260}
              cy={y + (random(`ay${k}`) - 0.5) * 260}
              r={12}
              fill={C.white}
            />
          ))
      : null}
  </g>
);

// D. Papel normal: pulpa de madera con almidón, la raya se oscurece
export const PapelNormal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.falsificador, T.oscurece + 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.papel, T.autenticos], [1, 1.04])}>
      <g opacity={aparece(t, T.papel)}>
        <rect x={200} y={420} width={680} height={440} rx={12} fill="#E8E6F0" />
        {new Array(8).fill(0).map((_, k) => (
          <line
            key={k}
            x1={200}
            y1={480 + k * 50}
            x2={880}
            y2={480 + k * 50}
            stroke="#8AB0E8"
            strokeWidth={3}
          />
        ))}
        <line
          x1={280}
          y1={420}
          x2={280}
          y2={860}
          stroke={C.red}
          strokeWidth={3}
        />
        <Raya
          x={340}
          y={760}
          prog={p}
          color={OSCURO}
          largo={420}
          pluma={1 - aparece(t, T.oscurece + 0.5)}
        />
      </g>
      <Fibras
        x={540}
        y={1100}
        almidon
        color="#B89060"
        op={aparece(t, T.pulpa)}
      />
      <Texto
        x={540}
        y={1340}
        color={C.white}
        size={36}
        op={aparece(t, T.pulpa)}
      >
        madera + almidón
      </Texto>
      <Texto
        x={540}
        y={1410}
        color={C.red}
        size={44}
        op={aparece(t, T.oscurece)}
      >
        raya oscura: falso
      </Texto>
    </Lienzo>
  );
};

// E. Billete auténtico: algodón sin almidón, la raya queda amarilla
export const Autentico: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.algodon + 0.5, T.amarilla + 0.3], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.autenticos, T.limites], [1, 1.04])}>
      <Billete x={540} y={640} op={aparece(t, T.autenticos)} />
      <Raya
        x={300}
        y={760}
        prog={p}
        color={AMBAR}
        pluma={1 - aparece(t, T.amarilla + 0.6)}
      />
      <Fibras
        x={540}
        y={1060}
        almidon={false}
        color="#E8E6F0"
        op={aparece(t, T.algodon)}
      />
      <Texto
        x={540}
        y={1300}
        color={C.white}
        size={36}
        op={aparece(t, T.algodon)}
      >
        algodón, sin almidón
      </Texto>
      <Texto
        x={540}
        y={1380}
        color={AMBAR}
        size={44}
        op={aparece(t, T.amarilla)}
      >
        raya amarilla
      </Texto>
    </Lienzo>
  );
};

// F. Límites del truco
export const Limites: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const filas = [
    ["papel sin almidón", T.limites + 1.5],
    ["billete blanqueado", T.blanquear],
    ["billete de plástico", T.plastico],
  ] as const;
  return (
    <Lienzo zoom={interpolate(t, [T.limites, T.hilos], [1, 1.04])}>
      <g opacity={aparece(t, T.limites)} transform="translate(540 560)">
        <polygon
          points="0,-130 130,100 -130,100"
          fill="none"
          stroke={C.orange}
          strokeWidth={16}
          strokeLinejoin="round"
        />
        <Texto x={0} y={70} color={C.orange} size={120}>
          !
        </Texto>
      </g>
      {filas.map(([txt, d], k) => (
        <g key={txt} opacity={aparece(t, d)}>
          <rect
            x={160}
            y={800 + k * 170}
            width={760}
            height={130}
            rx={20}
            fill={C.card}
            stroke={C.cardBorder}
            strokeWidth={2}
          />
          <Texto x={540} y={880 + k * 170} color={C.white} size={42}>
            {txt}
          </Texto>
        </g>
      ))}
    </Lienzo>
  );
};

// G. Otras medidas: hilo, marca de agua, tinta que cambia de color
export const Seguridad: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tono = (Math.sin(t * 3) + 1) / 2;
  return (
    <Lienzo zoom={interpolate(t, [T.hilos, T.final], [1, 1.04])}>
      <Billete x={540} y={800} />
      <rect
        x={510}
        y={630}
        width={14}
        height={340}
        fill="#1A1A2A"
        opacity={aparece(t, T.hilos)}
      />
      <circle
        cx={370}
        cy={800}
        r={90}
        fill="#E8F8E8"
        opacity={aparece(t, T.agua) * 0.35}
      />
      <text
        x={760}
        y={850}
        textAnchor="middle"
        fill={tono > 0.5 ? "#C89A30" : "#3A9A6A"}
        fontFamily={mono}
        fontSize={130}
        fontWeight={700}
        opacity={aparece(t, T.tintas)}
      >
        100
      </text>
      <Texto
        x={540}
        y={1130}
        color={C.white}
        size={38}
        op={aparece(t, T.hilos)}
      >
        hilo de seguridad
      </Texto>
      <Texto x={540} y={1200} color={C.white} size={38} op={aparece(t, T.agua)}>
        marca de agua
      </Texto>
      <Texto
        x={540}
        y={1270}
        color={C.yellow}
        size={38}
        op={aparece(t, T.tintas)}
      >
        tinta que cambia de color
      </Texto>
    </Lienzo>
  );
};

// H. Cierre: raya amarilla
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const p = interpolate(t, [T.final, T.final + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.final, T.fin + 0.5], [1, 1.05])}>
      <Billete x={540} y={860} />
      <Raya
        x={300}
        y={980}
        prog={p}
        color={AMBAR}
        pluma={1 - aparece(t, T.final + 1)}
      />
      <path
        d="M 420 1250 L 510 1340 L 680 1160"
        stroke="#5AC878"
        strokeWidth={26}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={aparece(t, T.final + 1)}
      />
    </Lienzo>
  );
};
