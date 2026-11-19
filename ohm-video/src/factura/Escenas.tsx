import { interpolate } from "remotion";
import {
  aparece,
  Flash,
  Lienzo,
  suave,
  Tarjeta,
  Texto,
} from "../components/Short";
import { C, clamp, useT } from "../theme";

// Instantes clave (s) de public/audio/factura/narracion.wav (voz x1,10), sacados con Whisper.
// La franja y 230-330 queda libre para los subtítulos.
export const T = {
  seguro: 1.76,
  final: 3.86,
  parece: 6.08,
  trampa: 7.56,
  si: 8.96,
  guardarse: 11.0,
  y: 13.36,
  impuestos: 15.18,
  con: 16.04,
  vigilante: 17.8,
  si2: 18.62,
  pides: 20.22,
  gratis: 21.3,
  asi: 22.06,
  sistema: 24.7,
  en: 26.0,
  gobierno: 27.34,
  unas: 29.26,
  escaparia: 32.66,
  porEso: 33.46,
  fin: 35.84,
};

const PAPEL = "#F2EFE6";
const VERDE = "#4AA870";

// Cartel de la caja
const Cartel: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-170} width={600} height={340} rx={20} fill={C.yellow} />
    <rect x={-280} y={-150} width={560} height={300} rx={14} fill="none" stroke="#1A1620" strokeWidth={6} />
    <text x={0} y={-80} textAnchor="middle" fontSize={34} fontWeight={700} fill="#1A1620" fontFamily="JetBrains Mono">
      SI NO LE ENTREGAMOS
    </text>
    <text x={0} y={-30} textAnchor="middle" fontSize={34} fontWeight={700} fill="#1A1620" fontFamily="JetBrains Mono">
      SU FACTURA,
    </text>
    <text x={0} y={50} textAnchor="middle" fontSize={44} fontWeight={700} fill={C.red} fontFamily="JetBrains Mono">
      ¡SU PEDIDO
    </text>
    <text x={0} y={110} textAnchor="middle" fontSize={44} fontWeight={700} fill={C.red} fontFamily="JetBrains Mono">
      ES GRATIS!
    </text>
  </g>
);

// Imagen del gancho y del cierre
const CartelPregunta: React.FC<{ readonly t: number; readonly q: number }> = ({ t, q }) => (
  <>
    <circle cx={540} cy={860} r={340} fill={C.yellow} opacity={0.08} />
    <Cartel x={540} y={860} s={1.3} rot={Math.sin(t * 1.5) * 2} />
    <Texto x={540} y={1340} size={120} color={C.yellow} op={q}>
      ?
    </Texto>
  </>
);

// A. Gancho: ¿gratis si no te dan factura?
export const Gancho: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <>
      <Lienzo zoom={interpolate(t, [0, T.seguro], [1.12, 1])}>
        <CartelPregunta t={t} q={interpolate(t, [0.8, 1.1], [0, 1], clamp)} />
      </Lienzo>
      <Flash t={t} d={0.94} color={C.yellow} />
    </>
  );
};

// Caja registradora
const Caja: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly pantalla?: string; readonly color?: string }> = ({
  x,
  y,
  s,
  pantalla = "$ 0.00",
  color = VERDE,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-60} width={400} height={220} rx={20} fill="#4A4466" />
    <rect x={-160} y={-170} width={320} height={110} rx={14} fill="#2A2640" />
    <rect x={-140} y={-150} width={280} height={70} rx={8} fill="#0A1A10" />
    <text x={0} y={-102} textAnchor="middle" fontSize={40} fontWeight={700} fill={color} fontFamily="JetBrains Mono">
      {pantalla}
    </text>
    {new Array(8).fill(0).map((_, k) => (
      <rect key={k} x={-150 + (k % 4) * 80} y={-30 + Math.floor(k / 4) * 60} width={60} height={44} rx={8} fill="#6A6488" />
    ))}
    <rect x={-220} y={160} width={440} height={60} rx={10} fill="#3A3456" />
  </g>
);

// B. Seguro has visto ese cartel en una caja + bucle abierto
export const Bucle: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.seguro, T.parece], [1, 1.05])}>
      <Caja x={540} y={920} s={1.3} />
      <Cartel x={540} y={560} s={0.55} rot={-4} />
      <g opacity={aparece(t, T.final)}>
        <rect x={190} y={1300} width={700} height={24} rx={12} fill="#2A2440" />
        <rect
          x={190}
          y={1300}
          width={700 * interpolate(t, [T.final, T.parece], [0, 1], clamp)}
          height={24}
          rx={12}
          fill={C.yellow}
        />
        <Texto x={540} y={1400} color={C.white} size={40}>
          quién gana de verdad: al final
        </Texto>
      </g>
    </Lienzo>
  );
};

// C. Parece un regalo, pero es una trampa contra el robo
export const Trampa: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const abre = interpolate(t, [T.trampa - 0.4, T.trampa + 0.3], [0, 1], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.parece, T.si], [1, 1.05])}>
        <g transform={`translate(540 ${880})`}>
          <rect x={-200} y={-100} width={400} height={300} rx={20} fill={C.red} />
          <rect x={-30} y={-100} width={60} height={300} fill={C.yellow} />
          <g transform={`translate(0 ${-abre * 160}) rotate(${-abre * 25})`}>
            <rect x={-220} y={-170} width={440} height={80} rx={16} fill="#C82838" />
            <rect x={-30} y={-170} width={60} height={80} fill={C.yellow} />
          </g>
          <g opacity={abre} transform="translate(0 -60)">
            <ellipse rx={110} ry={60} fill={C.white} />
            <circle r={40} fill={C.cyan} />
            <circle r={16} fill="#1A1620" />
          </g>
        </g>
        <Texto x={540} y={600} size={42} color={C.white} op={aparece(t, T.parece) * (1 - abre)}>
          ¿un regalo?
        </Texto>
        <Texto x={540} y={1240} size={42} color={C.cyan} op={abre}>
          vigilancia contra el robo
        </Texto>
      </Lienzo>
      <Flash t={t} d={T.trampa} color={C.cyan} />
    </>
  );
};

// Billete
const Billete: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly rot?: number; readonly op?: number }> = ({ x, y, s, rot = 0, op = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    <rect x={-110} y={-55} width={220} height={110} rx={10} fill={VERDE} stroke="#2E7A4E" strokeWidth={6} />
    <circle r={28} fill="#2E7A4E" />
  </g>
);

// D. El cajero que no registra la venta se guarda el dinero; y sin factura no se pagan impuestos
export const Robo: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const bolsillo = interpolate(t, [T.guardarse, T.guardarse + 1.2], [0, 1], suave);
  const imp = aparece(t, T.y);
  return (
    <Lienzo zoom={interpolate(t, [T.si, T.con], [1, 1.04])}>
      <g opacity={1 - imp}>
        <Caja x={360} y={900} s={0.9} pantalla="- - -" color={C.red} />
        <Texto x={360} y={680} size={34} color={C.red} op={aparece(t, T.si + 0.6)}>
          venta sin registrar
        </Texto>
        {/* bolsillo */}
        <path d="M 700 820 L 920 820 L 900 1080 Q 810 1130 720 1080 Z" fill="#3A4A7A" />
        <Billete x={interpolate(bolsillo, [0, 1], [360, 810])} y={interpolate(bolsillo, [0, 1], [760, 900])} s={0.8} rot={bolsillo * 30} op={1 - bolsillo * 0.6} />
        <Texto x={810} y={1200} size={34} color={C.white} op={aparece(t, T.guardarse)}>
          nadie se entera
        </Texto>
      </g>
      <g opacity={imp}>
        <path d="M 540 560 L 820 700 L 260 700 Z" fill="#6A6488" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={300 + k * 140} y={720} width={60} height={260} fill="#8A86A8" />
        ))}
        <rect x={240} y={990} width={600} height={40} fill="#6A6488" />
        <Texto x={540} y={1120} size={40} color={C.white}>
          impuestos
        </Texto>
        <Texto x={540} y={1220} size={70} color={C.red} op={aparece(t, T.impuestos)}>
          $ 0
        </Texto>
      </g>
    </Lienzo>
  );
};

// Ticket / factura
const Ticket: React.FC<{ readonly x: number; readonly y: number; readonly s: number; readonly op?: number }> = ({ x, y, s, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x={-100} y={-150} width={200} height={300} fill={PAPEL} />
    <text x={0} y={-100} textAnchor="middle" fontSize={26} fontWeight={700} fill="#1A1620" fontFamily="JetBrains Mono">
      FACTURA
    </text>
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={-70} y={-60 + k * 40} width={140 - (k % 2) * 40} height={14} rx={4} fill="#4A4466" />
    ))}
  </g>
);

// E. Con el cartel tú te conviertes en el vigilante: si no te lo dan, lo pides
export const Vigilante: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.con, T.asi], [1, 1.05])}>
      <g transform="translate(330 900)">
        <circle cx={0} cy={-170} r={70} fill="#E8B890" />
        <rect x={-90} y={-90} width={180} height={300} rx={60} fill="#4A5A8A" />
        <g opacity={aparece(t, T.vigilante)} transform="translate(0 -20)">
          <path d="M 0 -40 L 40 -20 L 32 30 L 0 50 L -32 30 L -40 -20 Z" fill={C.yellow} />
        </g>
      </g>
      <Texto x={330} y={1240} size={38} color={C.yellow} op={aparece(t, T.vigilante)}>
        tú vigilas
      </Texto>
      <Ticket x={760} y={860} s={1.1} op={aparece(t, T.pides)} />
      <g opacity={aparece(t, T.gratis)} transform="translate(760 1000) rotate(-12)">
        <rect x={-150} y={-50} width={300} height={100} rx={12} fill="none" stroke={C.red} strokeWidth={8} />
        <Texto x={0} y={18} size={52} color={C.red}>
          GRATIS
        </Texto>
      </g>
    </Lienzo>
  );
};

// F. Cada venta queda registrada en la caja y en el sistema de impuestos; a veces el gobierno lo obliga
export const Registro: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const viaja = ((t - T.asi) * 0.6) % 1;
  return (
    <Lienzo zoom={interpolate(t, [T.asi, T.unas], [1, 1.04])}>
      <Caja x={260} y={1000} s={0.7} pantalla="$ 12.50" />
      <g opacity={aparece(t, T.sistema - 0.4)}>
        <ellipse cx={780} cy={640} rx={180} ry={100} fill="#3A3456" />
        <circle cx={680} cy={610} r={80} fill="#3A3456" />
        <circle cx={850} cy={590} r={90} fill="#3A3456" />
        <Texto x={780} y={660} size={30} color={C.white}>
          impuestos
        </Texto>
        <line x1={330} y1={880} x2={720} y2={720} stroke={C.yellow} strokeWidth={6} strokeDasharray="16 12" />
        <rect x={interpolate(viaja, [0, 1], [330, 720]) - 20} y={interpolate(viaja, [0, 1], [880, 720]) - 26} width={40} height={52} fill={PAPEL} />
      </g>
      <g opacity={aparece(t, T.gobierno)}>
        <Cartel x={760} y={1080} s={0.42} />
        <rect x={540} y={1190} width={440} height={70} rx={16} fill={C.card} stroke={C.cyan} strokeWidth={4} />
        <Texto x={760} y={1238} size={32} color={C.cyan}>
          obligatorio por ley
        </Texto>
      </g>
    </Lienzo>
  );
};

// G. Unas comidas regaladas cuestan mucho menos que el dinero que se escaparía
export const Balance: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const incl = interpolate(t, [T.unas + 1.2, T.escaparia], [0, 14], suave);
  return (
    <>
      <Lienzo zoom={interpolate(t, [T.unas, T.porEso], [1, 1.05])}>
        <polygon points="540,900 490,1060 590,1060" fill="#8A86A8" />
        <g transform={`rotate(${incl} 540 900)`}>
          <rect x={160} y={890} width={760} height={20} rx={10} fill="#8A86A8" />
          {/* comidas regaladas: poco */}
          <g transform="translate(270 840)">
            <ellipse rx={70} ry={20} fill={PAPEL} />
            <ellipse cy={-16} rx={44} ry={24} fill={C.orange} />
          </g>
          {/* dinero que se escaparía: mucho */}
          {new Array(9).fill(0).map((_, k) => (
            <Billete key={k} x={810 + ((k % 3) - 1) * 40} y={860 - Math.floor(k / 3) * 34 - (k % 3) * 6} s={0.45} rot={(k % 3) * 8 - 8} />
          ))}
        </g>
        <Texto x={270} y={1160} size={32} color={C.orange} op={aparece(t, T.unas + 0.4)}>
          comidas gratis
        </Texto>
        <Texto x={810} y={1160} size={32} color={VERDE} op={aparece(t, T.unas + 1.2)}>
          dinero salvado
        </Texto>
        <Tarjeta x={190} y={1260} w={700} h={110} op={aparece(t, T.escaparia)}>
          <Texto x={540} y={1330} size={40} color={C.yellow}>
            el negocio gana
          </Texto>
        </Tarjeta>
      </Lienzo>
      <Flash t={t} d={T.escaparia} color={C.yellow} />
    </>
  );
};

// H. Cierre: vuelve a la imagen del inicio (bucle)
export const Cierre: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  return (
    <Lienzo zoom={interpolate(t, [T.porEso, T.fin + 0.5], [1, 1.12])}>
      <CartelPregunta t={t} q={1} />
    </Lienzo>
  );
};
