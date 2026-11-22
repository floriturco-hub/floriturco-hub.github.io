import { interpolate, random } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, mono, useT } from "../theme";

// Instantes clave (s) de public/audio/radiolofi/narracion.wav (voz x1,12), sacados con Whisper
export const T = {
  estudio: 2.38,
  escanearon: 4.2,
  escalofrios: 8.94,
  dopamina: 10.76,
  recompensa: 12.56,
  comida: 14.64,
  pero: 15.36,
  estudiar: 17.92,
  estorba: 19.2,
  compiten: 22.14,
  sinletra: 23.56,
  menos: 26.82,
  dormir: 27.58,
  bpm: 29.76,
  relajarte: 31.7,
  estudios: 33.26,
  constantes: 36.28,
  lluvia: 37.88,
  tapan: 39.56,
  lofi: 42.46,
  asi: 44.96,
  radio: 46.46,
  toca: 49.06,
  canal: 50.3,
  fin: 51.7,
};

const ROSA = "#E87AB8";
const LILA = "#9A7AE8";

// Cerebro de perfil (dos hemisferios estilizados con circunvoluciones)
const Cerebro: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s: number;
  readonly brillo?: number;
  readonly t: number;
}> = ({ x, y, s, brillo = 0, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -200 20 C -220 -110 -110 -190 0 -180 C 130 -190 230 -110 210 10 C 230 90 150 150 60 140 C 20 180 -60 180 -90 140 C -170 150 -230 100 -200 20 Z"
      fill="#3A2A5A"
      stroke={ROSA}
      strokeWidth={10}
    />
    {[
      "M -150 -60 q 40 -40 80 0 q 40 40 80 0",
      "M -170 30 q 50 -40 100 0 q 50 40 100 0 q 40 -30 80 0",
      "M -60 -130 q 30 30 60 0 q 30 -30 60 0",
      "M -120 100 q 40 -30 80 0 q 40 30 80 0",
    ].map((d, k) => (
      <path
        key={k}
        d={d}
        stroke={ROSA}
        strokeWidth={8}
        fill="none"
        opacity={0.6}
        strokeLinecap="round"
      />
    ))}
    <circle
      cx={10}
      cy={20}
      r={60}
      fill={C.yellow}
      opacity={brillo * (0.35 + 0.15 * Math.sin(t * 8))}
    />
    {brillo > 0
      ? new Array(10).fill(0).map((_, k) => {
          const a = (k / 10) * Math.PI * 2 + t;
          const d = 70 + 40 * ((t * 1.5 + k / 10) % 1);
          return (
            <circle
              key={k}
              cx={10 + Math.cos(a) * d}
              cy={20 + Math.sin(a) * d}
              r={10}
              fill={C.yellow}
              opacity={brillo * (1 - ((t * 1.5 + k / 10) % 1))}
            />
          );
        })
      : null}
  </g>
);

// Notas musicales flotando
const Notas: React.FC<{
  readonly t: number;
  readonly x: number;
  readonly y: number;
  readonly op: number;
  readonly n?: number;
}> = ({ t, x, y, op, n = 6 }) => (
  <g opacity={op}>
    {new Array(n).fill(0).map((_, k) => {
      const u = (t * 0.35 + k / n) % 1;
      return (
        <text
          key={k}
          x={x + (k - n / 2) * 70 + 30 * Math.sin(t * 2 + k)}
          y={y - u * 300}
          fill={[C.cyan, ROSA, C.yellow][k % 3]}
          opacity={Math.sin(u * Math.PI)}
          fontSize={60}
          fontFamily={mono}
          fontWeight={700}
        >
          {["♪", "♫", "♩"][k % 3]}
        </text>
      );
    })}
  </g>
);

// A. Gancho: el cerebro libera dopamina con música
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.estudio], [1.08, 1])}>
        <Cerebro x={540} y={880} s={1.7} brillo={aparece(t, 0.9)} t={t} />
        <path
          d="M 230 880 A 320 320 0 0 1 850 880"
          stroke="#2A2440"
          strokeWidth={30}
          fill="none"
        />
        <rect x={190} y={850} width={70} height={130} rx={30} fill={LILA} />
        <rect x={820} y={850} width={70} height={130} rx={30} fill={LILA} />
        <Notas t={t} x={540} y={560} op={aparece(t, 0.3)} />
      </Lienzo>
      <Flash t={t} d={1.0} color={C.yellow} />
    </>
  );
};

// Escáner con cabeza de perfil
const Escaner: React.FC<{ readonly t: number; readonly brillo: number }> = ({
  t,
  brillo,
}) => (
  <g>
    <circle
      cx={540}
      cy={820}
      r={330}
      fill="none"
      stroke="#C8C4D8"
      strokeWidth={80}
    />
    <circle
      cx={540}
      cy={820}
      r={330}
      fill="none"
      stroke={C.grey}
      strokeWidth={4}
    />
    <circle cx={540} cy={820} r={240} fill="#1A1636" />
    <g transform="translate(540 820) scale(0.9)">
      <path
        d="M -60 160 L -60 80 C -150 40 -170 -60 -150 -120 C -120 -200 -20 -230 60 -200 C 140 -170 170 -90 150 -20 C 170 0 180 30 160 40 C 150 60 140 100 100 120 L 90 160 Z"
        fill="#3A3460"
      />
      <circle
        cx={10}
        cy={-90}
        r={34}
        fill={C.yellow}
        opacity={brillo * (0.5 + 0.3 * Math.sin(t * 8))}
      />
    </g>
  </g>
);

// B. Estudio de 2011: escalofríos y dopamina
export const Estudio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const brillo = aparece(t, T.dopamina);
  return (
    <Lienzo zoom={interpolate(t, [T.estudio, T.pero], [1, 1.04])}>
      <Tarjeta x={340} y={250} w={400} h={140} op={aparece(t, T.estudio)}>
        <Texto x={540} y={342} color={C.yellow} size={66}>
          2011
        </Texto>
      </Tarjeta>
      <g opacity={aparece(t, T.escanearon)}>
        <Escaner t={t} brillo={brillo} />
      </g>
      <Notas
        t={t}
        x={540}
        y={700}
        op={aparece(t, T.escanearon + 1) * (1 - brillo * 0.5)}
        n={4}
      />
      <Texto
        x={540}
        y={1250}
        color={C.cyan}
        size={44}
        op={aparece(t, T.escalofrios)}
      >
        escalofríos
      </Texto>
      <Texto x={540} y={1340} color={C.yellow} size={56} op={brillo}>
        + dopamina
      </Texto>
      <Texto
        x={540}
        y={1420}
        color={C.grey}
        size={36}
        op={aparece(t, T.comida)}
      >
        como con la comida
      </Texto>
    </Lienzo>
  );
};

// C. Para estudiar: la letra compite con lo que lees
export const Estudiar: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const choque = aparece(t, T.compiten);
  const sinLetra = aparece(t, T.sinletra);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.dormir], [1, 1.03])}>
      <Texto x={540} y={440} color={C.white} size={48} op={aparece(t, T.pero)}>
        no toda la música sirve igual
      </Texto>
      {/* libro abierto */}
      <g opacity={aparece(t, T.estudiar)} transform="translate(540 860)">
        <path
          d="M -300 -160 L 0 -130 L 300 -160 L 300 160 L 0 190 L -300 160 Z"
          fill="#F0EEF8"
        />
        <line
          x1={0}
          y1={-130}
          x2={0}
          y2={190}
          stroke="#C8C4D8"
          strokeWidth={4}
        />
        {new Array(8).fill(0).map((_, k) => (
          <g key={k}>
            <rect
              x={-270}
              y={-110 + k * 34}
              width={220}
              height={10}
              rx={5}
              fill="#8C88A8"
              opacity={0.6}
            />
            <rect
              x={30}
              y={-110 + k * 34}
              width={220}
              height={10}
              rx={5}
              fill="#8C88A8"
              opacity={0.6}
            />
          </g>
        ))}
      </g>
      {/* palabras de la canción que chocan con el texto */}
      <g opacity={aparece(t, T.estorba) * (1 - sinLetra)}>
        {["la", "amor", "baby", "oh", "yeah"].map((w, k) => {
          const x = 180 + k * 180 + 20 * Math.sin(t * 3 + k);
          const y =
            interpolate(choque, [0, 1], [560, 760 + (k % 2) * 80]) +
            10 * Math.cos(t * 4 + k);
          return (
            <g key={w}>
              <rect
                x={x - 70}
                y={y - 44}
                width={140}
                height={64}
                rx={20}
                fill={ROSA}
                opacity={0.9}
              />
              <Texto x={x} y={y} color="#1A1030" size={34}>
                {w}
              </Texto>
            </g>
          );
        })}
      </g>
      <g opacity={sinLetra}>
        <path
          d={`M 140 640 ${new Array(16)
            .fill(0)
            .map((_, k) => `q 25 ${k % 2 ? 26 : -26} 50 0`)
            .join(" ")}`}
          stroke={C.cyan}
          strokeWidth={10}
          fill="none"
          transform={`translate(${-((t * 60) % 100)} 0)`}
        />
        <Texto x={540} y={1170} color={C.cyan} size={48}>
          sin letra: distrae menos
        </Texto>
      </g>
      <Texto
        x={540}
        y={1260}
        color={ROSA}
        size={42}
        op={aparece(t, T.compiten) * (1 - sinLetra)}
      >
        palabras contra palabras
      </Texto>
    </Lienzo>
  );
};

// D. Para dormir: 60-80 golpes por minuto
export const Dormir: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const lento = interpolate(t, [T.bpm, T.relajarte + 1], [0, 1], suave);
  const frecuencia = 2.2 - 1.1 * lento;
  const ecg = new Array(121)
    .fill(0)
    .map((_, k) => {
      const x = 120 + k * 7;
      const ph = ((k / 120) * 6 * frecuencia - t * frecuencia) % 1;
      const p = ((ph % 1) + 1) % 1;
      const v =
        p < 0.05
          ? -160 * Math.sin((p / 0.05) * Math.PI)
          : p < 0.1
            ? 50 * Math.sin(((p - 0.05) / 0.05) * Math.PI)
            : 0;
      return `${k === 0 ? "M" : "L"} ${x} ${880 + v}`;
    })
    .join(" ");
  return (
    <Lienzo zoom={interpolate(t, [T.dormir, T.constantes], [1, 1.03])}>
      <path
        d="M 820 380 A 90 90 0 1 0 900 520 A 70 70 0 1 1 820 380 Z"
        fill={C.yellow}
        opacity={aparece(t, T.dormir)}
      />
      <Tarjeta x={160} y={400} w={500} h={160} op={aparece(t, T.bpm)}>
        <Texto x={410} y={500} color={C.cyan} size={54}>
          60-80 BPM
        </Texto>
      </Tarjeta>
      <Tarjeta x={100} y={680} w={880} h={400} op={aparece(t, T.dormir + 0.5)}>
        <path
          d={ecg}
          stroke={C.red}
          strokeWidth={8}
          fill="none"
          strokeLinejoin="round"
        />
      </Tarjeta>
      <Texto
        x={540}
        y={1200}
        color={C.white}
        size={42}
        op={aparece(t, T.relajarte)}
      >
        ritmo lento: te relaja
      </Texto>
      <Texto
        x={540}
        y={1290}
        color={C.yellow}
        size={40}
        op={aparece(t, T.estudios)}
      >
        mejor calidad de sueño
      </Texto>
    </Lienzo>
  );
};

// E. Sonidos constantes tapan los ruidos repentinos
export const Constantes: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tapa = interpolate(t, [T.tapan, T.tapan + 0.8], [0, 1], suave);
  return (
    <Lienzo zoom={interpolate(t, [T.constantes, T.lofi], [1, 1.03])}>
      <Tarjeta x={100} y={460} w={880} h={620} op={aparece(t, T.constantes)}>
        <line
          x1={160}
          y1={1000}
          x2={920}
          y2={1000}
          stroke={C.grey}
          strokeWidth={4}
        />
        {/* picos de ruidos repentinos */}
        {[260, 520, 760].map((x, k) => (
          <g key={x}>
            <path
              d={`M ${x - 30} 1000 L ${x} ${640 + k * 40} L ${x + 30} 1000`}
              fill={C.red}
              opacity={0.85}
            />
            <Texto x={x} y={620 + k * 40} color={C.red} size={28}>
              {["¡pum!", "¡bip!", "¡clac!"][k]}
            </Texto>
          </g>
        ))}
        {/* manto de ruido constante (lluvia / vinilo) */}
        <path
          d={`M 160 1000 ${new Array(38)
            .fill(0)
            .map(
              (_, k) =>
                `L ${160 + k * 20} ${1000 - interpolate(tapa, [0, 1], [60, 300]) - 20 * random(`rn${k}${Math.floor(t * 8)}`)}`,
            )
            .join(" ")} L 920 1000 Z`}
          fill={C.cyan}
          opacity={0.55 * aparece(t, T.lluvia)}
        />
      </Tarjeta>
      <Texto
        x={540}
        y={1200}
        color={C.cyan}
        size={42}
        op={aparece(t, T.lluvia)}
      >
        lluvia, vinilo...
      </Texto>
      <Texto
        x={540}
        y={1290}
        color={C.yellow}
        size={42}
        op={aparece(t, T.tapan)}
      >
        tapan los ruidos repentinos
      </Texto>
    </Lienzo>
  );
};

// F. Así es el lo-fi: sin letra, lento, constante
export const Lofi: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const items = [
    ["sin letra", T.lofi],
    ["lento", T.lofi + 0.8],
    ["constante", T.lofi + 1.5],
  ] as const;
  return (
    <Lienzo zoom={interpolate(t, [T.lofi, T.radio], [1, 1.03])}>
      {/* vinilo girando */}
      <g transform={`translate(540 680) rotate(${t * 60})`}>
        <circle r={220} fill="#0E0C14" />
        {[190, 160, 130, 100].map((r) => (
          <circle key={r} r={r} fill="none" stroke="#2A2632" strokeWidth={3} />
        ))}
        <circle r={70} fill={ROSA} />
        <circle r={10} fill="#0E0C14" />
      </g>
      {items.map(([txt, d], k) => (
        <g key={txt} opacity={aparece(t, d)}>
          <path
            d={`M 330 ${1012 + k * 100} l 24 24 l 44 -48`}
            stroke="#5AC878"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Texto
            x={430}
            y={1040 + k * 100}
            color={C.white}
            size={52}
            anchor="start"
          >
            {txt}
          </Texto>
        </g>
      ))}
      <Texto x={540} y={1400} color={C.yellow} size={60} op={aparece(t, T.asi)}>
        = lo-fi
      </Texto>
    </Lienzo>
  );
};

// G. Cierre: Radio Lofi de Frecuencia Cero, toca el video relacionado
export const Radio: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.radio, T.fin + 0.5], [1, 1.03])}>
      {/* miniatura de la radio: ventana con lluvia */}
      <g opacity={aparece(t, T.radio)}>
        <rect
          x={140}
          y={460}
          width={800}
          height={460}
          rx={30}
          fill="#1A1530"
          stroke={C.cardBorder}
          strokeWidth={3}
        />
        <rect x={220} y={520} width={640} height={300} rx={12} fill="#141A38" />
        {new Array(16).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={240 + random(`rb${k}`) * 600}
            cy={640 + random(`rby${k}`) * 160}
            r={12 + random(`rbr${k}`) * 20}
            fill={[C.yellow, C.orange, "#7AA8E8"][k % 3]}
            opacity={0.25}
          />
        ))}
        {new Array(30).fill(0).map((_, k) => {
          const u = (t * 1.6 + random(`rl${k}`)) % 1;
          return (
            <line
              key={k}
              x1={230 + random(`rlx${k}`) * 620}
              y1={520 + u * 300}
              x2={226 + random(`rlx${k}`) * 620}
              y2={540 + u * 300}
              stroke="#9AA8D8"
              strokeWidth={2}
              opacity={0.6}
            />
          );
        })}
        <rect
          x={220}
          y={520}
          width={640}
          height={300}
          rx={12}
          fill="none"
          stroke="#2E2540"
          strokeWidth={16}
        />
        <circle cx={540} cy={670} r={70} fill="#00000088" />
        <path d="M 515 630 L 515 710 L 585 670 Z" fill={C.white} />
        <Texto x={540} y={880} color={C.white} size={40}>
          Radio Lofi · Frecuencia Cero
        </Texto>
      </g>
      {/* flecha hacia el video relacionado */}
      <g
        opacity={aparece(t, T.toca)}
        transform={`translate(0 ${12 * Math.sin(t * 5)})`}
      >
        <Texto x={540} y={1080} color={C.yellow} size={46}>
          video relacionado
        </Texto>
        <path
          d="M 540 1120 L 540 1250 M 490 1200 L 540 1250 L 590 1200"
          stroke={C.yellow}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <Texto x={540} y={1340} color={C.cyan} size={40} op={aparece(t, T.canal)}>
        y más en el canal
      </Texto>
    </Lienzo>
  );
};
