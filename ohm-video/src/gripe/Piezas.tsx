import { random } from "remotion";
import { C, mono } from "../theme";

// Recorrido de los aromas (coordenadas de CabezaPerfil): boca -> garganta -> nariz -> zona olfativa
const RUTA: [number, number][] = [
  [830, 1062],
  [740, 1068],
  [690, 1050],
  [680, 1000],
  [705, 955],
  [745, 912],
];
const punto = (f: number): [number, number] => {
  const seg = Math.min(RUTA.length - 2, Math.floor(f * (RUTA.length - 1)));
  const u = f * (RUTA.length - 1) - seg;
  const [ax, ay] = RUTA[seg];
  const [bx, by] = RUTA[seg + 1];
  return [ax + (bx - ax) * u, ay + (by - ay) * u];
};

// Interior: cavidad nasal, boca, zona olfativa y aromas que suben. tapon 0..1 bloquea el paso.
export const Interior: React.FC<{
  readonly t: number;
  readonly aromas: number;
  readonly zona: number;
  readonly tapon: number;
  readonly senal: number;
}> = ({ t, aromas, zona, tapon, senal }) => (
  <g>
    <path
      d="M 870 1012 C 820 990 760 960 700 960 C 670 965 665 1000 675 1040 L 680 1150"
      stroke="#5A4A7A"
      strokeWidth={34}
      fill="none"
      strokeLinecap="round"
      opacity={0.85}
    />
    <path
      d="M 860 1064 C 800 1070 740 1072 690 1060"
      stroke="#7A3A4A"
      strokeWidth={30}
      fill="none"
      strokeLinecap="round"
      opacity={0.85}
    />
    <ellipse
      cx={745}
      cy={905}
      rx={46}
      ry={18}
      fill={C.yellow}
      opacity={0.25 + 0.6 * zona}
    />
    {zona > 0 ? (
      <text
        x={760}
        y={860}
        textAnchor="middle"
        fill={C.yellow}
        fontFamily={mono}
        fontSize={26}
        fontWeight={700}
        opacity={zona}
      >
        zona olfativa
      </text>
    ) : null}
    {tapon > 0 ? (
      <g opacity={tapon}>
        {new Array(9).fill(0).map((_, k) => (
          <circle
            key={k}
            cx={700 + random(`tp${k}`) * 70}
            cy={960 + random(`tq${k}`) * 70}
            r={14 + random(`tr${k}`) * 10}
            fill="#B8D870"
          />
        ))}
      </g>
    ) : null}
    {aromas > 0
      ? new Array(12).fill(0).map((_, k) => {
          let f = (t * 0.35 + k / 12) % 1;
          if (tapon > 0.5) {
            f = Math.min(f, 0.52);
          }
          const [px, py] = punto(f);
          return (
            <circle
              key={`a${k}`}
              cx={px + Math.sin(t * 5 + k) * 6}
              cy={py}
              r={9}
              fill={C.orange}
              opacity={aromas * (tapon > 0.5 && f >= 0.52 ? 0.4 : 0.9)}
            />
          );
        })
      : null}
    {senal > 0 ? (
      <path
        d={`M 745 890 C 720 840 660 820 600 820`}
        stroke={C.cyan}
        strokeWidth={6}
        strokeDasharray="14 10"
        strokeDashoffset={-t * 80}
        fill="none"
        opacity={senal}
      />
    ) : null}
  </g>
);

// Porción de pizza
export const Pizza: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op?: number;
}> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path
      d="M 0 -160 L 140 120 Q 0 160 -140 120 Z"
      fill="#F0C060"
      stroke="#C88A30"
      strokeWidth={6}
    />
    <path
      d="M -150 110 Q 0 170 150 110 L 140 140 Q 0 190 -140 140 Z"
      fill="#C8803A"
    />
    {[
      [0, -40],
      [-50, 50],
      [50, 60],
      [0, 90],
    ].map(([cx, cy], k) => (
      <circle key={k} cx={cx} cy={cy} r={24} fill="#C83A3A" />
    ))}
  </g>
);

// Gomita de fresa
export const Gomita: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly op?: number;
}> = ({ x, y, s = 1, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path
      d="M 0 -70 C 70 -70 90 0 50 60 C 30 90 -30 90 -50 60 C -90 0 -70 -70 0 -70 Z"
      fill="#E8414F"
      stroke="#A82030"
      strokeWidth={5}
      opacity={0.9}
    />
    <path d="M -30 -70 L 0 -95 L 30 -70 Z" fill="#5CBF6A" />
    {new Array(8).fill(0).map((_, k) => (
      <ellipse
        key={k}
        cx={-30 + (k % 3) * 30}
        cy={-30 + Math.floor(k / 3) * 35}
        rx={4}
        ry={6}
        fill="#F8D8A8"
      />
    ))}
  </g>
);

// Mano pinzando la nariz (coordenadas de CabezaPerfil)
export const Pinza: React.FC<{ readonly op: number }> = ({ op }) => (
  <g opacity={op}>
    <path
      d="M 960 1100 C 1000 1040 980 980 930 960"
      stroke="#E8B898"
      strokeWidth={38}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 960 1100 C 1010 1060 1010 1010 935 1010"
      stroke="#D8A888"
      strokeWidth={34}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);
