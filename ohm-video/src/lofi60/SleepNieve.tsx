import React from "react";
import { random } from "remotion";
import {
  Acabado,
  avance,
  bulto,
  Capa,
  ciclos,
  Estrellas,
  frac,
  H,
  Luz,
  Marca,
  osc,
  ruido,
  TAU,
  useBucle,
  Vertical,
  W,
} from "./Kit";

// ───────── Dormir 2: cabaña en la nieve ─────────
// Noche azul con aurora y luna, montañas nevadas, una cabaña con las ventanas
// encendidas, humo en la chimenea y nieve cayendo en tres planos.

const HORIZ = 640; // línea del lago
const CX = 1360; // eje de la cabaña
const SUELO = 772; // base de la cabaña

// Cresta dentada de montaña como camino cerrado hasta `fondo`
const cresta = (
  semilla: string,
  base: number,
  amp: number,
  paso: number,
  fondo: number,
) => {
  const pts: [number, number][] = [];
  for (let x = -60; x <= W + 60; x += paso) {
    const p =
      Math.abs(Math.sin(x / 310 + random(`${semilla}a`) * 6)) * 0.55 +
      (0.5 + 0.5 * Math.sin(x / 140 + random(`${semilla}b`) * 6)) * 0.3 +
      random(`${semilla}n${x}`) * 0.15;
    pts.push([x, base - amp * p]);
  }
  return {
    pts,
    d: `M -60 ${fondo} ${pts.map(([x, y]) => `L ${x} ${y}`).join(" ")} L ${W + 60} ${fondo} Z`,
  };
};

const Pino: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly h: number;
  readonly w: number;
  readonly color: string;
  readonly nieve?: string;
  readonly pisos?: number;
}> = ({ x, y, h, w, color, nieve, pisos = 5 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect
      x={-w * 0.05}
      y={-h * 0.12}
      width={w * 0.1}
      height={h * 0.12}
      fill="#0A1322"
    />
    {new Array(pisos).fill(0).map((_, i) => {
      const top = -h + (i * h * 0.78) / pisos;
      const alto = (h * 1.5) / pisos;
      const medio = (w / 2) * (0.34 + (0.66 * (i + 1)) / pisos);
      return (
        <g key={i}>
          <path
            d={`M 0 ${top} Q ${medio * 0.45} ${top + alto * 0.55} ${medio} ${top + alto} Q ${medio * 0.4} ${top + alto * 0.86} 0 ${top + alto * 0.9} Q ${-medio * 0.4} ${top + alto * 0.86} ${-medio} ${top + alto} Q ${-medio * 0.45} ${top + alto * 0.55} 0 ${top} Z`}
            fill={color}
          />
          {nieve ? (
            <path
              d={`M 0 ${top} Q ${-medio * 0.42} ${top + alto * 0.52} ${-medio * 0.94} ${top + alto * 0.96} Q ${-medio * 0.5} ${top + alto * 0.7} ${-medio * 0.12} ${top + alto * 0.62} Q ${medio * 0.1} ${top + alto * 0.5} ${medio * 0.3} ${top + alto * 0.56} Q ${medio * 0.12} ${top + alto * 0.3} 0 ${top} Z`}
              fill={nieve}
            />
          ) : null}
        </g>
      );
    })}
  </g>
);

// ── capa fija: cielo, vía láctea y luna ──
const Cielo = React.memo(() => (
  <Capa fija>
    <defs>
      <Vertical
        id="sn-cielo"
        paradas={[
          [0, "#030614"],
          [0.3, "#07112C"],
          [0.5, "#0E2248"],
          [0.62, "#1B3F66"],
          [1, "#1B3F66"],
        ]}
      />
      <filter id="sn-b30" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="34" />
      </filter>
    </defs>
    <rect width={W} height={H} fill="url(#sn-cielo)" />
    {/* vía láctea */}
    <g transform="rotate(-24 1100 240)">
      <ellipse
        cx={1100}
        cy={240}
        rx={900}
        ry={90}
        fill="#8FA8FF"
        opacity={0.1}
        filter="url(#sn-b30)"
      />
      {new Array(520).fill(0).map((_, k) => {
        const u = random(`sn-vx${k}`);
        const g = (random(`sn-vy${k}`) + random(`sn-vz${k}`) - 1) * 110;
        return (
          <circle
            key={k}
            cx={200 + u * 1800}
            cy={240 + g}
            r={0.5 + random(`sn-vr${k}`) ** 3 * 1.5}
            fill="#DCE6FF"
            opacity={0.25 + random(`sn-vo${k}`) * 0.5}
          />
        );
      })}
    </g>
    {/* estrellas quietas */}
    {new Array(320).fill(0).map((_, k) => (
      <circle
        key={k}
        cx={random(`sn-ex${k}`) * W}
        cy={random(`sn-ey${k}`) ** 1.3 * 540}
        r={0.5 + random(`sn-er${k}`) ** 3 * 1.6}
        fill="#E6ECFF"
        opacity={0.3 + random(`sn-eo${k}`) * 0.6}
      />
    ))}
  </Capa>
));

// ── capa viva: aurora, estrellas que titilan y estrella fugaz ──
const AuroraYEstrellas: React.FC = () => {
  const { fase } = useBucle();
  const paso = 10;
  const cintas = [
    { y: 210, alto: 230, n: 1, color: "sn-au1", op: 0.5, sem: 0.1 },
    { y: 120, alto: 190, n: 2, color: "sn-au2", op: 0.34, sem: 0.57 },
    { y: 300, alto: 170, n: 1, color: "sn-au1", op: 0.26, sem: 0.83 },
  ];
  const fugaz = avance(fase, 0.37, 0.009);
  const fugazOp = bulto(fase, 0.37, 0.009);
  return (
    <Capa>
      <defs>
        <Vertical
          id="sn-au1"
          paradas={[
            [0, "#9A7CFF", 0],
            [0.25, "#58E8C0", 0.55],
            [0.55, "#4CF0A8", 1],
            [1, "#3CD0A0", 0],
          ]}
        />
        <Vertical
          id="sn-au2"
          paradas={[
            [0, "#B08CFF", 0],
            [0.35, "#7C9CFF", 0.7],
            [0.7, "#4CE0C8", 0.9],
            [1, "#4CE0C8", 0],
          ]}
        />
        <linearGradient id="sn-fugaz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>
      {cintas.map((c, ci) => (
        <g key={ci} opacity={c.op}>
          {new Array(Math.ceil((W + 40) / paso)).fill(0).map((_, k) => {
            const x = -20 + k * paso;
            const top =
              c.y +
              46 * Math.sin(x / 270 + TAU * (c.n * fase + c.sem)) +
              22 * Math.sin(x / 96 - TAU * (2 * c.n * fase + c.sem));
            const alto =
              c.alto *
              (0.72 +
                0.28 * Math.sin(x / 150 + TAU * (c.n * fase + c.sem * 2)));
            const b =
              0.36 +
              0.2 * Math.sin(x / 110 + TAU * (3 * fase + c.sem)) +
              0.05 * Math.sin(x / 31 - TAU * (5 * fase + c.sem));
            const dentro = Math.sin((Math.PI * (x + 20)) / (W + 40)) ** 0.6;
            return (
              <rect
                key={k}
                x={x}
                y={top}
                width={paso + 0.6}
                height={alto}
                fill={`url(#${c.color})`}
                opacity={Math.max(0, b) * dentro}
              />
            );
          })}
        </g>
      ))}
      <Estrellas fase={fase} cuantas={150} h={520} semilla="sn-t" rMax={2.6} />
      {fugazOp > 0 ? (
        <g
          transform={`translate(${1290 - fugaz * 360} ${96 + fugaz * 170}) rotate(155)`}
          opacity={fugazOp}
        >
          <rect
            x={-150}
            y={-1.5}
            width={150}
            height={3}
            fill="url(#sn-fugaz)"
          />
          <circle r={3.2} fill="#FFFFFF" />
        </g>
      ) : null}
    </Capa>
  );
};

// ── capa fija: montañas, lago, nieve, cabaña y primer plano ──
const Paisaje = React.memo(() => {
  const lejos = cresta("sn-m1", 560, 230, 46, HORIZ + 10);
  const cerca = cresta("sn-m2", 600, 150, 34, HORIZ + 10);
  return (
    <Capa fija>
      <defs>
        <radialGradient id="sn-luna" cx="0.4" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#FFFDF2" />
          <stop offset="1" stopColor="#DDE4F4" />
        </radialGradient>
        <Vertical
          id="sn-mont1"
          paradas={[
            [0, "#3A5890"],
            [0.5, "#24406E"],
            [1, "#1C3560"],
          ]}
        />
        <Vertical
          id="sn-mont2"
          paradas={[
            [0, "#27457A"],
            [1, "#152C52"],
          ]}
        />
        <Vertical
          id="sn-lago"
          paradas={[
            [0, "#24477A"],
            [1, "#16305A"],
          ]}
        />
        <Vertical
          id="sn-nieve1"
          paradas={[
            [0, "#3A588E"],
            [1, "#263E6C"],
          ]}
        />
        <Vertical
          id="sn-nieve2"
          paradas={[
            [0, "#5475AE"],
            [0.4, "#3C5A92"],
            [1, "#263C6C"],
          ]}
        />
        <Vertical
          id="sn-nieve3"
          paradas={[
            [0, "#7C9CD6"],
            [0.25, "#4E6CA8"],
            [1, "#22355F"],
          ]}
        />
        <Vertical
          id="sn-bruma"
          paradas={[
            [0, "#B8D0FF", 0],
            [1, "#B8D0FF", 0.2],
          ]}
        />
        <Vertical
          id="sn-tejado"
          paradas={[
            [0, "#E4EEFF"],
            [1, "#9DB6E8"],
          ]}
        />
        <Vertical
          id="sn-pared"
          paradas={[
            [0, "#3E2C32"],
            [1, "#2A1D24"],
          ]}
        />
        <Vertical
          id="sn-vent"
          paradas={[
            [0, "#FFE2A0"],
            [1, "#FFA84A"],
          ]}
        />
        <linearGradient id="sn-derrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB054" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFB054" stopOpacity="0" />
        </linearGradient>
        <filter id="sn-b8" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="sn-b14" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="sn-b5" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* luna (por delante de la aurora) */}
      <Luz
        id="sn-halo-luna"
        cx={700}
        cy={196}
        r={340}
        color="#B4C8FF"
        op={0.5}
      />
      <circle cx={700} cy={196} r={60} fill="url(#sn-luna)" />
      <g fill="#B4BED8" opacity={0.3}>
        <circle cx={682} cy={182} r={10} />
        <circle cx={720} cy={210} r={14} />
        <circle cx={694} cy={224} r={6} />
        <circle cx={724} cy={174} r={5} />
      </g>
      {/* montañas lejanas con la cara iluminada por la luna */}
      <path d={lejos.d} fill="url(#sn-mont1)" />
      {lejos.pts.map(([x, y], k) => {
        const a = lejos.pts[k - 1];
        const b = lejos.pts[k + 1];
        if (!a || !b || y > a[1] || y > b[1]) return null;
        return (
          <path
            key={k}
            d={`M ${x} ${y} L ${a[0]} ${a[1]} L ${a[0] - 20} ${a[1] + 70} L ${x - 34} ${y + 78} L ${x - 20} ${y + 132} L ${x - 2} ${y + 74} L ${x + 12} ${y + 104} L ${x + 16} ${y + 34} Z`}
            fill="#A8C4FF"
            opacity={0.2}
          />
        );
      })}
      <path d={cerca.d} fill="url(#sn-mont2)" />
      {cerca.pts.map(([x, y], k) => {
        const a = cerca.pts[k - 1];
        const b = cerca.pts[k + 1];
        if (!a || !b || y > a[1] || y > b[1]) return null;
        return (
          <path
            key={k}
            d={`M ${x} ${y} L ${a[0]} ${a[1]} L ${a[0] - 12} ${a[1] + 40} L ${x - 22} ${y + 52} L ${x - 12} ${y + 86} L ${x} ${y + 48} L ${x + 9} ${y + 66} L ${x + 11} ${y + 22} Z`}
            fill="#9CBAF8"
            opacity={0.16}
          />
        );
      })}
      <rect
        x={0}
        y={HORIZ - 150}
        width={W}
        height={160}
        fill="url(#sn-bruma)"
      />

      {/* lago helado y bosque de la orilla */}
      <rect x={0} y={HORIZ} width={W} height={90} fill="url(#sn-lago)" />
      <ellipse
        cx={700}
        cy={HORIZ + 40}
        rx={190}
        ry={36}
        fill="#BFD2FF"
        opacity={0.16}
        filter="url(#sn-b8)"
      />
      {new Array(74).fill(0).map((_, k) => {
        const h = 26 + random(`sn-bh${k}`) * 46;
        return (
          <Pino
            key={k}
            x={(k / 74) * (W + 60) - 30 + random(`sn-bx${k}`) * 18}
            y={HORIZ + 6 + random(`sn-by${k}`) * 5}
            h={h}
            w={h * 0.5}
            color="#0D1D38"
            pisos={3}
          />
        );
      })}

      {/* campos de nieve */}
      <path
        d={`M -20 ${HORIZ + 78} C 300 ${HORIZ + 52} 620 ${HORIZ + 92} 900 ${HORIZ + 70} C 1200 ${HORIZ + 46} 1500 ${HORIZ + 84} ${W + 20} ${HORIZ + 60} V ${H} H -20 Z`}
        fill="url(#sn-nieve1)"
      />
      <path
        d={`M -20 812 C 240 770 520 800 760 786 C 980 772 1140 752 1360 ${SUELO - 4} C 1580 ${SUELO - 12} 1760 760 ${W + 20} 742 V ${H} H -20 Z`}
        fill="url(#sn-nieve2)"
      />
      <path
        d={`M -20 812 C 240 770 520 800 760 786 C 980 772 1140 752 1360 ${SUELO - 4} C 1580 ${SUELO - 12} 1760 760 ${W + 20} 742`}
        fill="none"
        stroke="#A9C6FF"
        strokeWidth={3}
        opacity={0.5}
      />

      {/* valla medio enterrada */}
      {new Array(9).fill(0).map((_, k) => {
        const x = 640 + k * 62;
        const y = 792 - k * 3.4;
        return (
          <g key={k}>
            <rect x={x - 6} y={y - 44} width={12} height={50} fill="#2A2028" />
            <path d={`M ${x - 10} ${y - 44} q 10 -12 20 0 Z`} fill="#D6E4FF" />
          </g>
        );
      })}
      <path
        d="M 640 766 L 1136 739 M 640 780 L 1136 753"
        stroke="#2A2028"
        strokeWidth={6}
      />
      <path
        d="M 640 763 L 1136 736"
        stroke="#C4D6FF"
        strokeWidth={3}
        opacity={0.7}
      />

      {/* muñeco de nieve */}
      <g transform="translate(1016 770)">
        <ellipse cx={4} cy={2} rx={48} ry={9} fill="#162849" opacity={0.6} />
        <circle cx={0} cy={-30} r={34} fill="#C9D9FA" />
        <circle cx={0} cy={-78} r={24} fill="#D6E3FF" />
        <circle cx={-9} cy={-36} r={30} fill="#FFFFFF" opacity={0.18} />
        <path
          d="M -24 -62 q 24 12 48 0 l 0 10 q -24 12 -48 0 Z"
          fill="#C8483E"
        />
        <path d="M 14 -54 l 10 30 l -12 2 l -6 -28 Z" fill="#A83C34" />
        <rect x={-18} y={-116} width={36} height={22} rx={3} fill="#1E1A2C" />
        <rect x={-26} y={-98} width={52} height={6} rx={3} fill="#1E1A2C" />
        <circle cx={-8} cy={-82} r={2.6} fill="#141826" />
        <circle cx={8} cy={-82} r={2.6} fill="#141826" />
        <path d="M 0 -76 l 18 4 l -18 3 Z" fill="#F08A3C" />
        <path
          d="M -30 -40 l -30 -22 M 30 -40 l 28 -24"
          stroke="#2A2028"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </g>

      {/* luz de las ventanas derramada en la nieve */}
      <g filter="url(#sn-b14)" opacity={0.85}>
        <path
          d={`M ${CX - 152} ${SUELO} L ${CX - 84} ${SUELO} L ${CX - 30} ${SUELO + 170} L ${CX - 300} ${SUELO + 170} Z`}
          fill="url(#sn-derrame)"
        />
        <path
          d={`M ${CX + 84} ${SUELO} L ${CX + 152} ${SUELO} L ${CX + 300} ${SUELO + 170} L ${CX + 30} ${SUELO + 170} Z`}
          fill="url(#sn-derrame)"
        />
        <path
          d={`M ${CX - 34} ${SUELO} L ${CX + 34} ${SUELO} L ${CX + 90} ${SUELO + 120} L ${CX - 90} ${SUELO + 120} Z`}
          fill="url(#sn-derrame)"
          opacity={0.55}
        />
      </g>

      {/* cabaña */}
      <g>
        {/* leñera */}
        <g transform={`translate(${CX - 262} ${SUELO})`}>
          {[0, 1, 2].map((r) =>
            new Array(4 - r).fill(0).map((_, i) => (
              <g key={`${r}-${i}`}>
                <circle
                  cx={i * 26 + r * 13}
                  cy={-13 - r * 22}
                  r={12.5}
                  fill="#4A3432"
                />
                <circle
                  cx={i * 26 + r * 13}
                  cy={-13 - r * 22}
                  r={7}
                  fill="#6A4C44"
                />
              </g>
            )),
          )}
          <path
            d="M -16 -62 q 20 -22 52 -16 q 34 -6 56 22 l 4 12 q -40 -14 -64 -22 q -30 6 -48 4 Z"
            fill="#D6E4FF"
          />
        </g>
        {/* chimenea */}
        <rect x={CX + 86} y={470} width={50} height={110} fill="#4C434F" />
        <path
          d={`M ${CX + 86} 500 h 50 M ${CX + 86} 530 h 50 M ${CX + 110} 470 v 30 M ${CX + 100} 500 v 30 M ${CX + 120} 530 v 30`}
          stroke="#352E3A"
          strokeWidth={3}
        />
        <path
          d={`M ${CX + 78} 474 q 6 -22 34 -18 q 28 -4 34 18 Z`}
          fill="#E4EEFF"
        />
        {/* pared de troncos */}
        <path
          d={`M ${CX - 190} ${SUELO} V 624 L ${CX} 484 L ${CX + 190} 624 V ${SUELO} Z`}
          fill="url(#sn-pared)"
        />
        {new Array(8).fill(0).map((_, k) => (
          <line
            key={k}
            x1={CX - 190}
            y1={640 + k * 19}
            x2={CX + 190}
            y2={640 + k * 19}
            stroke="#1E1419"
            strokeWidth={3}
            opacity={0.8}
          />
        ))}
        {new Array(8).fill(0).map((_, k) => (
          <line
            key={k}
            x1={CX - 190}
            y1={631 + k * 19}
            x2={CX + 190}
            y2={631 + k * 19}
            stroke="#5A4046"
            strokeWidth={2}
            opacity={0.5}
          />
        ))}
        {/* ventanas y puerta */}
        {[-118, 118].map((dx) => (
          <g key={dx}>
            <rect
              x={CX + dx - 40}
              y={652}
              width={80}
              height={76}
              rx={4}
              fill="#2A1C22"
            />
            <rect
              x={CX + dx - 34}
              y={658}
              width={68}
              height={64}
              fill="url(#sn-vent)"
            />
            <path
              d={`M ${CX + dx} 658 v 64 M ${CX + dx - 34} 690 h 68`}
              stroke="#2A1C22"
              strokeWidth={5}
            />
            <path
              d={`M ${CX + dx - 34} 658 q 14 22 4 64 Z M ${CX + dx + 34} 658 q -14 22 -4 64 Z`}
              fill="#C8483E"
              opacity={0.55}
            />
            <path
              d={`M ${CX + dx - 46} 728 h 92 l -6 10 h -80 Z`}
              fill="#DCE8FF"
            />
          </g>
        ))}
        <circle cx={CX} cy={566} r={27} fill="#2A1C22" />
        <circle cx={CX} cy={566} r={21} fill="url(#sn-vent)" />
        <path
          d={`M ${CX} 545 v 42 M ${CX - 21} 566 h 42`}
          stroke="#2A1C22"
          strokeWidth={4}
        />
        <rect
          x={CX - 38}
          y={664}
          width={76}
          height={108}
          rx={4}
          fill="#231820"
        />
        <rect x={CX - 31} y={671} width={62} height={101} fill="#4A3034" />
        <rect
          x={CX - 20}
          y={684}
          width={40}
          height={34}
          fill="url(#sn-vent)"
          opacity={0.9}
        />
        <circle cx={CX + 20} cy={730} r={4} fill="#E8C070" />
        {/* corona en la puerta */}
        <circle
          cx={CX}
          cy={701}
          r={15}
          fill="none"
          stroke="#2F6A4A"
          strokeWidth={7}
        />
        <path
          d={`M ${CX - 7} 713 l 7 -6 l 7 6 l -2 8 l -5 -5 l -5 5 Z`}
          fill="#D0483E"
        />
        {/* escalón nevado */}
        <path
          d={`M ${CX - 60} ${SUELO} q 60 -16 120 0 l 8 10 h -136 Z`}
          fill="#E0EAFF"
        />
        {/* tejado con nieve y carámbanos */}
        <path
          d={`M ${CX - 232} 646 L ${CX} 468 L ${CX + 232} 646 L ${CX + 214} 664 L ${CX} 506 L ${CX - 214} 664 Z`}
          fill="#2A1C22"
        />
        <path
          d={`M ${CX - 246} 640 Q ${CX - 240} 618 ${CX - 214} 606 L ${CX - 12} 452 Q ${CX} 442 ${CX + 12} 452 L ${CX + 214} 606 Q ${CX + 240} 618 ${CX + 246} 640 Q ${CX + 236} 652 ${CX + 220} 646 L ${CX} 486 L ${CX - 220} 646 Q ${CX - 236} 652 ${CX - 246} 640 Z`}
          fill="url(#sn-tejado)"
        />
        <path
          d={`M ${CX - 214} 606 L ${CX - 12} 452 Q ${CX} 442 ${CX + 12} 452`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={4}
          opacity={0.6}
          strokeLinecap="round"
        />
        {new Array(13).fill(0).map((_, k) => {
          const u = (k + 0.5) / 13;
          const izq = k % 2 === 0;
          const x = izq ? CX - 220 + u * 200 : CX + 220 - u * 200;
          const y = 646 - u * 150 + 4;
          const l = 10 + random(`sn-car${k}`) * 20;
          return (
            <path
              key={k}
              d={`M ${x - 3} ${y} L ${x} ${y + l} L ${x + 3} ${y} Z`}
              fill="#CFE0FF"
              opacity={0.85}
            />
          );
        })}
        {/* farol junto a la puerta */}
        <path d={`M ${CX + 58} 668 h 14`} stroke="#1E1419" strokeWidth={3} />
        <rect
          x={CX + 62}
          y={670}
          width={16}
          height={24}
          rx={3}
          fill="#FFD68A"
        />
        <path
          d={`M ${CX + 60} 670 h 20 l -4 -8 h -12 Z M ${CX + 60} 694 h 20 v 4 h -20 Z`}
          fill="#1E1419"
        />
      </g>

      {/* huellas hasta la puerta */}
      {new Array(13).fill(0).map((_, k) => {
        const u = k / 12;
        const x = CX - 30 - u * 250 + (k % 2 === 0 ? 12 : -12);
        const y = SUELO + 22 + u * 250;
        const s = 0.7 + u * 0.9;
        return (
          <ellipse
            key={k}
            cx={x}
            cy={y}
            rx={13 * s}
            ry={5.5 * s}
            fill="#1B2E57"
            opacity={0.42}
            transform={`rotate(-20 ${x} ${y})`}
          />
        );
      })}

      {/* primer plano: ventisquero y pinos */}
      <path
        d={`M -20 968 C 200 900 420 930 640 962 C 900 1000 1180 1010 1420 968 C 1620 934 1780 950 ${W + 20} 986 V ${H + 20} H -20 Z`}
        fill="url(#sn-nieve3)"
      />
      <path
        d={`M -20 968 C 200 900 420 930 640 962 C 900 1000 1180 1010 1420 968 C 1620 934 1780 950 ${W + 20} 986`}
        fill="none"
        stroke="#C6DAFF"
        strokeWidth={3}
        opacity={0.55}
      />
      <g filter="url(#sn-b5)">
        <Pino
          x={150}
          y={1120}
          h={860}
          w={520}
          color="#081527"
          nieve="#8FADE4"
          pisos={6}
        />
        <Pino
          x={1846}
          y={1140}
          h={720}
          w={470}
          color="#081527"
          nieve="#8FADE4"
          pisos={6}
        />
      </g>
      <Pino
        x={404}
        y={1010}
        h={400}
        w={230}
        color="#0A1A30"
        nieve="#A9C4F4"
        pisos={5}
      />
      <Pino
        x={1672}
        y={880}
        h={300}
        w={170}
        color="#0B1C34"
        nieve="#A9C4F4"
        pisos={5}
      />
      <Pino
        x={560}
        y={842}
        h={170}
        w={96}
        color="#0C1E38"
        nieve="#9DB8EC"
        pisos={4}
      />
      <Marca color="#DCE8FF" op={0.16} />
    </Capa>
  );
});

// Guirnalda de luces del alero
const ALERO = new Array(18).fill(0).map((_, k) => {
  const izq = k < 9;
  const u = ((k % 9) + 0.5) / 9;
  return {
    x: izq ? CX - 226 + u * 214 : CX + 226 - u * 214,
    y: 656 - u * 160 + 8 + 5 * Math.sin(u * Math.PI * 9),
    color: ["#FFD27A", "#FF8A6A", "#8AD8FF", "#FFE9B0"][k % 4],
    k,
  };
});

// ── capa viva: humo, luces, reflejo de la luna, destellos y nieve ──
const Vida: React.FC = () => {
  const { fase, L } = useBucle();
  const fuego =
    0.88 +
    0.09 * ruido(fase, "sn-fuego", ciclos(L, 1.1), 5) +
    0.05 * ruido(fase, "sn-fuego2", ciclos(L, 0.4), 3);
  const nHumo = ciclos(L, 10);
  const capas = [
    {
      cuantas: 170,
      r: [1, 1.9],
      caida: 15,
      vaiven: 14,
      op: 0.55,
      deriva: 0,
      sem: "sn-n1",
    },
    {
      cuantas: 100,
      r: [2, 3.4],
      caida: 9.5,
      vaiven: 26,
      op: 0.75,
      deriva: 1,
      sem: "sn-n2",
    },
    {
      cuantas: 26,
      r: [7, 13],
      caida: 5.6,
      vaiven: 44,
      op: 0.42,
      deriva: 1,
      sem: "sn-n3",
    },
  ] as const;
  return (
    <Capa>
      <defs>
        <radialGradient id="sn-humo">
          <stop offset="0" stopColor="#C8D6F4" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#B4C6EC" stopOpacity="0.35" />
          <stop offset="1" stopColor="#B4C6EC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sn-copo">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#F0F5FF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F0F5FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sn-halo-calido">
          <stop offset="0" stopColor="#FFC470" stopOpacity="0.85" />
          <stop offset="0.2" stopColor="#FFB054" stopOpacity="0.36" />
          <stop offset="0.5" stopColor="#FF9A44" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FF9A44" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* reflejo de la luna en el lago */}
      {new Array(13).fill(0).map((_, k) => {
        const y = HORIZ + 8 + k * 6.2;
        const ancho =
          (16 + k * 5.5) * (0.7 + 0.3 * osc(fase, 5 + (k % 4), k / 13));
        const dx = 7 * osc(fase, 3 + (k % 3), k / 7);
        return (
          <rect
            key={k}
            x={700 + dx - ancho / 2}
            y={y}
            width={ancho}
            height={2.4}
            rx={1.2}
            fill="#E4EEFF"
            opacity={0.5 - k * 0.022}
          />
        );
      })}

      {/* humo de la chimenea */}
      {new Array(10).fill(0).map((_, k) => {
        const u = frac(k / 10 + nHumo * fase);
        const x =
          CX + 111 + 78 * u ** 1.6 + 13 * Math.sin(TAU * (u * 1.4 + k * 0.37));
        const y = 456 - 215 * u;
        const r = 15 + 52 * u;
        return (
          <circle
            key={k}
            cx={x}
            cy={y}
            r={r}
            fill="url(#sn-humo)"
            opacity={0.66 * (1 - u) ** 1.1 * Math.min(1, u * 9)}
          />
        );
      })}

      {/* el fuego de dentro hace latir las ventanas */}
      {[-118, 118].map((dx) => (
        <circle
          key={dx}
          cx={CX + dx}
          cy={690}
          r={190}
          fill="url(#sn-halo-calido)"
          opacity={0.62 * fuego}
        />
      ))}
      <circle
        cx={CX}
        cy={566}
        r={90}
        fill="url(#sn-halo-calido)"
        opacity={0.5 * fuego}
      />
      <circle
        cx={CX + 70}
        cy={682}
        r={80}
        fill="url(#sn-halo-calido)"
        opacity={0.6}
      />
      {[-118, 118].map((dx) => (
        <rect
          key={dx}
          x={CX + dx - 34}
          y={658}
          width={68}
          height={64}
          fill="#FFF2C8"
          opacity={0.16 * (fuego - 0.74) * 4}
        />
      ))}

      {/* luces del alero */}
      {ALERO.map((b) => {
        const v = 0.7 + 0.3 * osc(fase, 3 + (b.k % 6), random(`sn-al${b.k}`));
        return (
          <g key={b.k}>
            <circle
              cx={b.x}
              cy={b.y}
              r={30}
              fill={b.color}
              opacity={0.12 * v}
            />
            <circle
              cx={b.x}
              cy={b.y}
              r={13}
              fill={b.color}
              opacity={0.22 * v}
            />
            <circle
              cx={b.x}
              cy={b.y}
              r={4.4}
              fill="#FFF8E4"
              opacity={0.65 + 0.35 * v}
            />
          </g>
        );
      })}

      {/* destellos de la nieve a la luz de la luna */}
      {new Array(46).fill(0).map((_, k) => {
        const n = 3 + Math.floor(random(`sn-dn${k}`) * 8);
        const b = Math.max(0, osc(fase, n, random(`sn-dd${k}`))) ** 10;
        if (b < 0.02) return null;
        const x = random(`sn-dx${k}`) * W;
        const y = 800 + random(`sn-dy${k}`) ** 0.7 * 270;
        const s = 5 + random(`sn-ds${k}`) * 6;
        return (
          <path
            key={k}
            d={`M ${x - s} ${y} L ${x} ${y - s * 0.24} L ${x + s} ${y} L ${x} ${y + s * 0.24} Z M ${x} ${y - s} L ${x + s * 0.24} ${y} L ${x} ${y + s} L ${x - s * 0.24} ${y} Z`}
            fill="#FFFFFF"
            opacity={b * 0.9}
          />
        );
      })}

      {/* nieve en tres planos */}
      {capas.map((c) => (
        <g key={c.sem} opacity={c.op}>
          {new Array(c.cuantas).fill(0).map((_, k) => {
            const n = Math.max(
              1,
              Math.round((L / c.caida) * (0.8 + 0.4 * random(`${c.sem}v${k}`))),
            );
            const u = frac(random(`${c.sem}u${k}`) + n * fase);
            const y = -30 + u * (H + 60);
            const m = 1 + Math.floor(random(`${c.sem}m${k}`) * 3);
            const x =
              frac(random(`${c.sem}x${k}`) + c.deriva * fase) * (W + 120) -
              60 +
              c.vaiven *
                Math.sin(
                  TAU *
                    (m * Math.max(1, Math.round(n / 2)) * fase +
                      random(`${c.sem}p${k}`)),
                );
            const r = c.r[0] + random(`${c.sem}r${k}`) * (c.r[1] - c.r[0]);
            return c.r[0] > 5 ? (
              <circle key={k} cx={x} cy={y} r={r} fill="url(#sn-copo)" />
            ) : (
              <circle key={k} cx={x} cy={y} r={r} fill="#F4F8FF" />
            );
          })}
        </g>
      ))}
    </Capa>
  );
};

export const SleepNieve: React.FC = () => (
  <div
    style={{ position: "absolute", width: W, height: H, background: "#030614" }}
  >
    <Cielo />
    <AuroraYEstrellas />
    <Paisaje />
    <Vida />
    <Acabado vineta={0.5} grano={0.075} color={[3, 6, 20]} />
  </div>
);
