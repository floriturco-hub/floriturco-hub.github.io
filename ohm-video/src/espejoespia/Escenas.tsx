import { interpolate } from "remotion";
import { C, clamp, H, mono, useT, W } from "../theme";
import {
  Celular,
  CorteEspejo,
  Cuartos,
  Dedo,
  Persona,
  VistaFrente,
} from "./Piezas";

// Instantes clave (s) de public/audio/espejo-espia/narracion.wav (voz x1,05), sacados con Whisper
export const T = {
  espejo: 1.0,
  toca: 1.84,
  espacio: 3.72,
  dicen: 5.34,
  mirando: 6.42,
  verdad: 8.32,
  parte: 9.22,
  normal: 10.48,
  detras: 13.24,
  dedo: 14.28,
  reflejo: 16.0,
  capa: 19.12,
  espacio2: 20.18,
  espia: 23.26,
  delante: 25.06,
  noHay: 27.44,
  toca2: 29.24,
  falla: 31.08,
  normales: 32.46,
  espias: 34.4,
  luz: 37.02,
  oscuro: 40.36,
  apaga: 43.28,
  linterna: 44.14,
  tunel: 46.34,
  cuarto: 48.92,
  verte: 50.92,
  protege: 52.46,
  luzSi: 54.74,
  fin: 55.5,
};

const aparece = (t: number, d: number) =>
  interpolate(t, [d - 0.1, d + 0.3], [0, 1], clamp);

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

// Montaje en corte: dedo a la izquierda tocando el vidrio y su imagen detrás de la capa
const Montaje: React.FC<{
  readonly t: number;
  readonly capaDelante: boolean;
  readonly etiquetas: number;
  readonly imagen: number;
  readonly medida: number;
}> = ({ capaDelante, etiquetas, imagen, medida }) => {
  const x = 520;
  const g = 50;
  const y = 700;
  const capaX = capaDelante ? x : x + g;
  const imgTip = capaX + (capaX - x);
  return (
    <g>
      <Dedo x={x} y={y} s={0.9} />
      <g opacity={imagen}>
        <Dedo x={imgTip} y={y} s={0.9} fantasma espejo />
      </g>
      <CorteEspejo
        x={x}
        y={y}
        h={420}
        g={g}
        capaDelante={capaDelante}
        etiquetas={etiquetas}
      />
      {medida > 0 && imgTip > x + 4 ? (
        <g opacity={medida}>
          <line
            x1={x}
            y1={y + 110}
            x2={imgTip}
            y2={y + 110}
            stroke={C.yellow}
            strokeWidth={6}
          />
          <line
            x1={x}
            y1={y + 90}
            x2={x}
            y2={y + 130}
            stroke={C.yellow}
            strokeWidth={6}
          />
          <line
            x1={imgTip}
            y1={y + 90}
            x2={imgTip}
            y2={y + 130}
            stroke={C.yellow}
            strokeWidth={6}
          />
          <text
            x={(x + imgTip) / 2}
            y={y + 175}
            textAnchor="middle"
            fill={C.yellow}
            fontFamily={mono}
            fontSize={32}
            fontWeight={700}
          >
            espacio
          </text>
        </g>
      ) : null}
      {medida > 0 && imgTip <= x + 4 ? (
        <g opacity={medida}>
          <circle
            cx={x}
            cy={y}
            r={40}
            fill="none"
            stroke={C.red}
            strokeWidth={6}
          />
          <text
            x={x}
            y={y + 120}
            textAnchor="middle"
            fill={C.red}
            fontFamily={mono}
            fontSize={32}
            fontWeight={700}
          >
            sin espacio
          </text>
        </g>
      ) : null}
    </g>
  );
};

// A. Gancho: el dedo toca su reflejo… ¿alguien te mira?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const hueco = interpolate(t, [T.espejo, T.toca + 0.4], [140, 0], clamp);
  const ojos = aparece(t, T.mirando);
  const flash = interpolate(
    t,
    [T.mirando, T.mirando + 0.08, T.mirando + 0.45],
    [0, 0.25, 0],
    clamp,
  );
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.normal], [1, 1.07])}>
        <VistaFrente
          x={540}
          y={860}
          r={380}
          hueco={hueco}
          id="g"
          marco={ojos > 0.5 ? C.red : "#8C88A8"}
        />
        <g opacity={ojos * 0.85}>
          <ellipse cx={420} cy={600} rx={26} ry={12} fill={C.white} />
          <ellipse cx={660} cy={600} rx={26} ry={12} fill={C.white} />
          <circle cx={420} cy={600} r={7} fill={C.bg} />
          <circle cx={660} cy={600} r={7} fill={C.bg} />
        </g>
        <Texto
          x={540}
          y={1330}
          color={C.yellow}
          size={120}
          op={aparece(t, T.verdad)}
        >
          ?
        </Texto>
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

// B. Espejo normal: capa detrás, hay espacio
export const Normal: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.normal, T.espia], [1, 1.04])}>
      <Texto
        x={540}
        y={380}
        color={C.white}
        size={48}
        op={aparece(t, T.normal)}
      >
        espejo normal
      </Texto>
      <Montaje
        t={t}
        capaDelante={false}
        etiquetas={aparece(t, T.detras - 0.6)}
        imagen={aparece(t, T.reflejo)}
        medida={aparece(t, T.espacio2)}
      />
      <g opacity={aparece(t, T.espacio2)}>
        <VistaFrente x={540} y={1220} r={200} hueco={70} id="n" />
      </g>
    </Lienzo>
  );
};

// C. Espejo espía: capa delante, sin espacio
export const Espia: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.espia, T.falla], [1, 1.04])}>
      <Texto x={540} y={380} color={C.red} size={48} op={aparece(t, T.espia)}>
        espejo espía
      </Texto>
      <g opacity={0.35}>
        <Persona x={880} y={760} s={0.8} color="#141228" ojos />
      </g>
      <Montaje
        t={t}
        capaDelante
        etiquetas={aparece(t, T.delante)}
        imagen={aparece(t, T.noHay)}
        medida={aparece(t, T.toca2)}
      />
      <g opacity={aparece(t, T.toca2)}>
        <VistaFrente x={540} y={1220} r={200} hueco={0} id="e" marco={C.red} />
      </g>
    </Lienzo>
  );
};

// D. La prueba falla
const Mini: React.FC<{
  readonly x: number;
  readonly titulo: string;
  readonly capaDelante: boolean;
  readonly hueco: number;
  readonly op: number;
  readonly id: string;
}> = ({ x, titulo, capaDelante, hueco, op, id }) => (
  <g opacity={op}>
    <text
      x={x}
      y={560}
      textAnchor="middle"
      fill={C.white}
      fontFamily={mono}
      fontSize={36}
      fontWeight={700}
    >
      {titulo}
    </text>
    <text
      x={x}
      y={610}
      textAnchor="middle"
      fill={C.grey}
      fontFamily={mono}
      fontSize={28}
      fontWeight={700}
    >
      {capaDelante ? "capa delante" : "capa detrás"}
    </text>
    <VistaFrente x={x} y={880} r={190} hueco={hueco} id={id} />
  </g>
);
export const Falla: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.falla, T.luz], [1, 1.04])}>
      <Mini
        x={290}
        titulo="normal"
        capaDelante
        hueco={0}
        op={aparece(t, T.normales)}
        id="m1"
      />
      <Mini
        x={790}
        titulo="espía"
        capaDelante={false}
        hueco={70}
        op={aparece(t, T.espias)}
        id="m2"
      />
      <g opacity={aparece(t, T.falla)}>
        <Texto x={540} y={1250} color={C.red} size={60}>
          la prueba falla
        </Texto>
      </g>
    </Lienzo>
  );
};

// E. Lo que delata: la luz. Linterna, túnel con las manos y el cuarto al otro lado
export const Luz: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const rayo = aparece(t, T.linterna) * (1 - aparece(t, T.tunel));
  const ver =
    t > T.cuarto
      ? interpolate(t, [T.cuarto, T.cuarto + 0.8], [0, 0.6], clamp)
      : rayo * 0.35;
  return (
    <Lienzo zoom={interpolate(t, [T.luz, T.protege], [1, 1.05])}>
      <Cuartos t={t} luzOtro={ver} mirada={aparece(t, T.oscuro)} rayo={rayo} />
      <g opacity={rayo}>
        <Celular x={420} y={790} s={0.6} luz={1} />
      </g>
      <g
        opacity={aparece(t, T.tunel) * (1 - aparece(t, T.cuarto))}
        transform="translate(470 780)"
      >
        <path
          d="M -60 -90 Q -120 0 -60 90"
          stroke="#E8B898"
          strokeWidth={34}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 40 -90 Q 100 0 40 90"
          stroke="#E8B898"
          strokeWidth={34}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      <Texto x={540} y={430} color={C.yellow} size={44} op={aparece(t, T.luz)}>
        la clave es la luz
      </Texto>
      <Texto x={540} y={1310} color={C.red} size={48} op={aparece(t, T.verte)}>
        alguien podría verte
      </Texto>
    </Lienzo>
  );
};

// F. Cierre: el dedo no te protege, la luz sí
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.protege, T.fin + 0.5], [1, 1.05])}>
      <g opacity={aparece(t, T.protege)}>
        <g transform="translate(250 700) rotate(-90)">
          <Dedo x={140} y={0} s={0.6} />
        </g>
        <path
          d="M 140 520 L 360 880 M 360 520 L 140 880"
          stroke={C.red}
          strokeWidth={18}
          strokeLinecap="round"
        />
        <text
          x={250}
          y={980}
          textAnchor="middle"
          fill={C.white}
          fontFamily={mono}
          fontSize={40}
          fontWeight={700}
        >
          el dedo
        </text>
      </g>
      <g opacity={aparece(t, T.luzSi)}>
        <Celular x={800} y={700} s={1.1} luz={1} />
        <path
          d="M 844 584 L 1000 420 L 1060 520 Z"
          fill="#FFF2C8"
          opacity={0.4}
        />
        <circle cx={800} cy={940} r={48} fill={C.yellow} />
        <path
          d="M 776 940 L 794 960 L 826 920"
          stroke={C.bg}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x={800}
          y={1060}
          textAnchor="middle"
          fill={C.yellow}
          fontFamily={mono}
          fontSize={40}
          fontWeight={700}
        >
          la luz
        </text>
      </g>
    </Lienzo>
  );
};
