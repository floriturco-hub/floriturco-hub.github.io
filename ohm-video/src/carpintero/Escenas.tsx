import { interpolate } from "remotion";
import { CabezaPerfil } from "../components/CabezaPerfil";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  Astillas,
  BarrasG,
  Carpintero,
  CerebroMini,
  Martillo,
  Muelle,
  Tronco,
} from "./Piezas";

// Instantes clave (s) de public/audio/carpintero/narracion.wav (voz x1,17), sacados con Whisper
export const T = {
  g1200: 0.86,
  carpintero: 2.44,
  veinte: 4.74,
  miles: 6.26,
  frenazo: 7.82,
  g1200b: 9.2,
  persona: 10.72,
  cien: 12.5,
  conmocion: 13.94,
  durante: 14.94,
  casco: 17.34,
  amortiguadores: 18.0,
  pero: 19.0,
  filmaron: 20.96,
  superlenta: 22.04,
  contrario: 23.66,
  noAmortigua: 24.66,
  martillo: 26.76,
  absorbiera: 28.22,
  fuerza: 30.2,
  sobrevive: 30.96,
  tamano: 32.96,
  diminuto: 34.1,
  gramos: 35.48,
  ajustado: 37.02,
  rebotar: 38.92,
  pequeno: 40.36,
  tolera: 42.04,
  ti: 43.68,
  afecta: 45.46,
  recta: 47.08,
  girar: 48.9,
  milisegundo: 50.0,
  aunAsi: 52.68,
  dano: 54.8,
  quiza: 56.96,
  fin: 59.0,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);
// Picoteo visible (6 golpes/s para que se lea a 30 fps)
const pico = (t: number) => Math.pow(Math.max(0, Math.sin(t * Math.PI * 6)), 3);

const Lienzo: React.FC<{
  readonly children: React.ReactNode;
  readonly zoom?: number;
  readonly cy?: number;
}> = ({ children, zoom = 1, cy = 960 }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <g
      transform={`translate(${540 - 540 * zoom} ${cy - cy * zoom}) scale(${zoom})`}
    >
      {children}
    </g>
  </svg>
);

const Texto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly op?: number;
  readonly size?: number;
}> = ({ x, y, children, color = C.white, op = 1, size = 36 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily={mono}
    fontSize={size}
    fontWeight={700}
    opacity={op}
  >
    {children}
  </text>
);

// A. Gancho: picoteando a 1.200 G
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const g = pico(t);
  const flash = interpolate(
    t,
    [T.g1200, T.g1200 + 0.08, T.g1200 + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  const golpes = Math.round(
    interpolate(t, [T.miles, T.frenazo], [20, 12000], clamp),
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.frenazo], [1.05, 1])}>
        <Tronco
          x={760}
          hueco={interpolate(t, [0, T.frenazo], [0.2, 1], clamp)}
          yHueco={820}
        />
        <Carpintero x={500} y={950} s={1.3} golpe={g} />
        <Astillas x={765} y={820} t={t} op={1} />
        {g > 0.85 ? (
          <path
            d="M 770 760 l 30 -30 M 790 820 l 44 0 M 770 880 l 30 30"
            stroke={C.yellow}
            strokeWidth={8}
            strokeLinecap="round"
          />
        ) : null}
        <Texto
          x={380}
          y={420}
          color={C.red}
          size={110}
          op={aparece(t, T.g1200)}
        >
          1.200 G
        </Texto>
        <g opacity={aparece(t, T.veinte)}>
          <Texto x={380} y={1400} color={C.yellow} size={48}>
            {t < T.miles
              ? "20 golpes / segundo"
              : `${golpes.toLocaleString("es-CO")} al día`}
          </Texto>
        </g>
      </Lienzo>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: flash,
        }}
      />
    </>
  );
};

// B. 1.200 G frente a los ~100 G de una conmoción humana
export const Comparacion: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.frenazo, T.durante], [1, 1.04])}>
      <BarrasG
        x={120}
        y={760}
        w={840}
        p={interpolate(t, [T.frenazo + 0.3, T.g1200b + 0.6], [0, 1], clamp)}
        humano={aparece(t, T.persona)}
      />
      <Texto
        x={540}
        y={1300}
        color={C.yellow}
        size={52}
        op={aparece(t, T.conmocion)}
      >
        ¡12 veces más!
      </Texto>
    </Lienzo>
  );
};

// C. Se creía que el cráneo era un casco con amortiguadores
export const Casco: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.durante, T.pero], [1, 1.05])}>
      <Carpintero x={420} y={1000} s={1.5} golpe={0} />
      <g opacity={aparece(t, T.amortiguadores)}>
        <Muelle x={520} y={560} h={180} op={1} />
        <Muelle x={600} y={540} h={180} op={1} />
        <Muelle x={680} y={570} h={160} op={1} />
      </g>
      <Texto x={540} y={380} color={C.white} size={44} op={aparece(t, T.casco)}>
        ¿un casco con amortiguadores?
      </Texto>
    </Lienzo>
  );
};

// D. Cámara superlenta: no amortigua, es un martillo
export const Superlenta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const tachado = aparece(t, T.noAmortigua);
  const martillo = aparece(t, T.martillo);
  const lento = pico(t * 0.25);
  return (
    <Lienzo zoom={interpolate(t, [T.pero, T.sobrevive], [1, 1.04])}>
      <g opacity={1 - martillo}>
        <rect x={60} y={420} width={960} height={70} fill="#1A1A2A" />
        <rect x={60} y={1290} width={960} height={70} fill="#1A1A2A" />
        {new Array(12).fill(0).map((_, k) => (
          <g key={k}>
            <rect
              x={80 + k * 80}
              y={440}
              width={40}
              height={30}
              rx={4}
              fill={C.bg}
            />
            <rect
              x={80 + k * 80}
              y={1310}
              width={40}
              height={30}
              rx={4}
              fill={C.bg}
            />
          </g>
        ))}
        <Tronco x={800} w={180} />
        <Carpintero x={560} y={980} s={1.1} golpe={lento} />
        <Texto
          x={300}
          y={560}
          color={C.yellow}
          size={40}
          op={aparece(t, T.superlenta)}
        >
          cámara superlenta
        </Texto>
        <g opacity={tachado}>
          <Muelle x={600} y={640} h={150} op={1} />
          <line
            x1={520}
            y1={620}
            x2={700}
            y2={820}
            stroke={C.red}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <line
            x1={700}
            y1={620}
            x2={520}
            y2={820}
            stroke={C.red}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <Texto x={300} y={640} color={C.red} size={40}>
            no amortigua
          </Texto>
        </g>
      </g>
      <g opacity={martillo}>
        <Martillo
          x={540}
          y={820}
          s={1.4}
          op={1}
          rot={interpolate(lento, [0, 1], [-30, 0])}
        />
        <Texto x={540} y={1300} color={C.yellow} size={52}>
          un martillo rígido
        </Texto>
        <g opacity={aparece(t, T.absorbiera)}>
          <Texto x={540} y={420} color={C.white} size={38}>
            si amortiguara, perdería fuerza
          </Texto>
        </g>
      </g>
    </Lienzo>
  );
};

// E. El tamaño: un cerebro diminuto y bien ajustado
export const Tamano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ajuste = aparece(t, T.ajustado);
  return (
    <Lienzo zoom={interpolate(t, [T.sobrevive, T.pequeno], [1, 1.05])}>
      <g opacity={1 - ajuste}>
        <CerebroMini x={380} y={850} s={2.6} />
        <CerebroMini x={840} y={900} s={0.35} />
        <Texto
          x={380}
          y={1180}
          color={C.white}
          size={36}
          op={aparece(t, T.diminuto)}
        >
          humano ~1.400 g
        </Texto>
        <Texto
          x={840}
          y={1180}
          color={C.yellow}
          size={36}
          op={aparece(t, T.gramos)}
        >
          carpintero: pocos g
        </Texto>
      </g>
      <g opacity={ajuste}>
        <Carpintero x={460} y={1060} s={1.8} golpe={0} cerebro={1} />
        <Texto x={540} y={420} color={C.yellow} size={44}>
          ajustado: sin espacio para rebotar
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Cerebro más pequeño, más tolerancia: a ti te noquearía, a él no
export const Tolera: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const ko = aparece(t, T.ti);
  return (
    <Lienzo zoom={interpolate(t, [T.pequeno, T.recta], [1, 1.04])}>
      <Texto
        x={540}
        y={420}
        color={C.white}
        size={40}
        op={aparece(t, T.pequeno)}
      >
        más pequeño = tolera más
      </Texto>
      <g opacity={aparece(t, T.pequeno) * (1 - ko)}>
        <CerebroMini x={330} y={880} s={2.2} />
        <CerebroMini x={820} y={900} s={0.4} />
        <text
          x={330}
          y={1180}
          textAnchor="middle"
          fill={C.red}
          fontFamily={mono}
          fontSize={34}
          fontWeight={700}
        >
          menos aguante
        </text>
        <text
          x={820}
          y={1180}
          textAnchor="middle"
          fill={C.cyan}
          fontFamily={mono}
          fontSize={34}
          fontWeight={700}
        >
          más aguante
        </text>
      </g>
      <g opacity={ko} transform="translate(-60 120) scale(0.75)">
        <CabezaPerfil />
        {[0, 1, 2].map((k) => {
          const a = t * 3 + (k * Math.PI * 2) / 3;
          return (
            <path
              key={k}
              d={`M ${620 + Math.cos(a) * 160} ${560 + Math.sin(a) * 40} l 12 26 l 28 4 l -20 20 l 6 28 l -26 -14 l -26 14 l 6 -28 l -20 -20 l 28 -4 Z`}
              fill={C.yellow}
            />
          );
        })}
      </g>
      <Texto x={300} y={1400} color={C.red} size={40} op={ko}>
        a ti: KO
      </Texto>
      <g opacity={aparece(t, T.afecta)}>
        <Carpintero x={770} y={950} s={0.8} golpe={pico(t)} />
        <Texto x={790} y={1300} color={C.cyan} size={40}>
          a él: nada
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. En línea recta y en menos de un milisegundo
export const Recta: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.recta, T.aunAsi], [1, 1.04])}>
      <g opacity={aparece(t, T.recta)}>
        <line
          x1={200}
          y1={620}
          x2={820}
          y2={620}
          stroke={C.cyan}
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path d="M 790 590 L 850 620 L 790 650 Z" fill={C.cyan} />
        <Texto x={510} y={560} color={C.cyan} size={40}>
          en línea recta
        </Texto>
      </g>
      <g opacity={aparece(t, T.girar)}>
        <path
          d="M 300 980 A 200 200 0 1 1 560 1150"
          stroke={C.grey}
          strokeWidth={14}
          fill="none"
        />
        <line
          x1={260}
          y1={860}
          x2={620}
          y2={1180}
          stroke={C.red}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <line
          x1={620}
          y1={860}
          x2={260}
          y2={1180}
          stroke={C.red}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <Texto x={760} y={1020} color={C.grey} size={36}>
          sin girar
        </Texto>
      </g>
      <Texto
        x={540}
        y={1380}
        color={C.yellow}
        size={60}
        op={aparece(t, T.milisegundo)}
      >
        menos de 1 ms
      </Texto>
    </Lienzo>
  );
};

// H. Aun así, quizá no sale ileso
export const Dano: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.aunAsi, T.fin + 0.5], [1, 1.06])}>
      <Tronco x={800} w={200} hueco={1} yHueco={760} />
      <Carpintero
        x={520}
        y={900}
        s={1.3}
        golpe={pico(t) * 0.8}
        cerebro={aparece(t, T.dano)}
      />
      <g opacity={aparece(t, T.dano)}>
        <circle cx={600} cy={620} r={20} fill={C.red} />
        <text
          x={600}
          y={632}
          textAnchor="middle"
          fill={C.white}
          fontFamily={mono}
          fontSize={30}
          fontWeight={700}
        >
          !
        </text>
        <Texto x={380} y={420} color={C.red} size={40}>
          posible daño
        </Texto>
      </g>
      <Texto
        x={380}
        y={1400}
        color={C.yellow}
        size={120}
        op={aparece(t, T.quiza)}
      >
        ?
      </Texto>
    </Lienzo>
  );
};
