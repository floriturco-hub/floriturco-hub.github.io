import { C, mono } from "../theme";

const IRIS = "#8A5A32";
const ESCLERA = "#E8E6F0";
const PIEL = "#3A3360";
const TRAZO = "#8C88A8";

// Brillo difuso para los reflejos de los ojos
export const FiltrosOjo: React.FC = () => (
  <defs>
    <filter id="brillo-ojo" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
  </defs>
);

// Ojo visto de frente. reflejo: color del destello en la pupila (null = pupila negra)
export const OjoFrente: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly pupila?: number; // 0 = cerrada (pequeña), 1 = dilatada
  readonly reflejo?: string | null;
  readonly intensidad?: number;
  readonly gato?: boolean;
}> = ({ x, y, s = 1, pupila = 0.4, reflejo = null, intensidad = 1, gato = false }) => {
  const rp = 14 + 34 * pupila;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -110 0 Q 0 -78 110 0 Q 0 78 -110 0 Z" fill={gato ? "#C8D84A" : ESCLERA} stroke={TRAZO} strokeWidth={5} />
      {!gato ? <circle r={58} fill={IRIS} /> : null}
      {!gato ? (
        <g opacity={0.5}>
          {new Array(12).fill(0).map((_, k) => (
            <line key={k} x1={Math.cos((k * Math.PI) / 6) * (rp + 4)} y1={Math.sin((k * Math.PI) / 6) * (rp + 4)} x2={Math.cos((k * Math.PI) / 6) * 54} y2={Math.sin((k * Math.PI) / 6) * 54} stroke="#5A3A1E" strokeWidth={3} />
          ))}
        </g>
      ) : null}
      {gato ? <ellipse rx={10 + 22 * pupila} ry={52} fill="#14121F" /> : <circle r={rp} fill="#0A0812" />}
      {reflejo ? (
        <g opacity={intensidad}>
          <circle r={gato ? 60 : rp + 10} fill={reflejo} filter="url(#brillo-ojo)" opacity={0.85} />
          {gato ? <ellipse rx={10 + 22 * pupila} ry={52} fill={reflejo} /> : <circle r={rp} fill={reflejo} />}
        </g>
      ) : null}
      <circle cx={-18} cy={-20} r={9} fill="#FFFFFF" opacity={0.85} />
    </g>
  );
};

// Cara de frente para las "fotos"
export const Cara: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly reflejoIzq?: string | null;
  readonly reflejoDer?: string | null;
  readonly pupila?: number;
  readonly intensidad?: number;
}> = ({ x, y, s = 1, reflejoIzq = null, reflejoDer = null, pupila = 0.8, intensidad = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={170} width={140} height={110} fill={PIEL} />
    <path d="M -260 420 Q -250 250 -80 240 L 80 240 Q 250 250 260 420 Z" fill="#582888" />
    <ellipse rx={210} ry={250} fill={PIEL} stroke={TRAZO} strokeWidth={8} />
    <path d="M -212 -40 Q -230 -270 0 -268 Q 230 -270 212 -40 Q 180 -200 0 -205 Q -180 -200 -212 -40 Z" fill="#1A1636" />
    <OjoFrente x={-88} y={-20} s={0.62} pupila={pupila} reflejo={reflejoIzq} intensidad={intensidad} />
    <OjoFrente x={88} y={-20} s={0.62} pupila={pupila} reflejo={reflejoDer} intensidad={intensidad} />
    <path d="M -130 -80 Q -88 -100 -46 -84 M 46 -84 Q 88 -100 130 -80" stroke="#1A1636" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M 0 0 L -16 70 L 14 70" stroke={TRAZO} strokeWidth={6} fill="none" strokeLinejoin="round" />
    <path d="M -56 128 Q 0 160 56 128" stroke={TRAZO} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

// Marco de foto
export const Foto: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly children: React.ReactNode; readonly id: string; readonly pie?: string }> = ({
  x,
  y,
  w,
  h,
  children,
  id,
  pie,
}) => (
  <g>
    <defs>
      <clipPath id={`foto-${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
    </defs>
    <rect x={x - 26} y={y - 26} width={w + 52} height={h + (pie ? 120 : 52)} rx={10} fill="#F4F2FA" />
    <rect x={x} y={y} width={w} height={h} fill="#201C3C" />
    <g clipPath={`url(#foto-${id})`}>{children}</g>
    {pie ? (
      <text x={x + w / 2} y={y + h + 70} textAnchor="middle" fill="#2A2350" fontFamily={mono} fontSize={34} fontWeight={700}>
        {pie}
      </text>
    ) : null}
  </g>
);

// Celular de lado con flash y objetivo juntos
export const Celular: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly destello?: number }> = ({ x, y, s = 1, destello = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-170} width={140} height={340} rx={26} fill="#2E2A40" stroke="#5A5478" strokeWidth={5} />
    <circle cx={40} cy={-60} r={22} fill={destello > 0.05 ? "#FFF6D0" : "#8A8060"} />
    <circle cx={40} cy={10} r={30} fill="#0A0812" stroke="#8C88A8" strokeWidth={6} />
    <circle cx={32} cy={2} r={8} fill="#FFFFFF" opacity={0.4} />
    {destello > 0 ? (
      <g opacity={destello}>
        <circle cx={40} cy={-60} r={90} fill="#FFF6D0" opacity={0.35} filter="url(#brillo-ojo)" />
        {new Array(8).fill(0).map((_, k) => (
          <line key={k} x1={40 + Math.cos((k * Math.PI) / 4) * 40} y1={-60 + Math.sin((k * Math.PI) / 4) * 40} x2={40 + Math.cos((k * Math.PI) / 4) * 90} y2={-60 + Math.sin((k * Math.PI) / 4) * 90} stroke="#FFF6D0" strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>
    ) : null}
  </g>
);

// Corte lateral del ojo, mirando a la izquierda (hacia la cámara)
export const OjoCorte: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly s?: number;
  readonly pupila?: number;
  readonly coroides?: number; // resalte de la coroides
  readonly etiquetas?: number;
}> = ({ x, y, s = 1, pupila = 1, coroides = 0, etiquetas = 0 }) => {
  const R = 300;
  const arco = (r: number, a0: number, a1: number) => {
    const p0 = [Math.cos(a0) * r, Math.sin(a0) * r];
    const p1 = [Math.cos(a1) * r, Math.sin(a1) * r];
    return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p1[0]} ${p1[1]}`;
  };
  const a0 = -Math.PI * 0.62;
  const a1 = Math.PI * 0.62;
  const media = 30 + 60 * pupila;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={R} fill="#14102A" stroke={ESCLERA} strokeWidth={16} />
      {/* Coroides y retina en la pared del fondo */}
      <path d={arco(R - 22, a0, a1)} stroke={C.red} strokeWidth={26} fill="none" opacity={0.75 + 0.25 * coroides} />
      {new Array(9).fill(0).map((_, k) => {
        const a = a0 + ((a1 - a0) * (k + 0.5)) / 9;
        const r = R - 22;
        return (
          <path
            key={k}
            d={`M ${Math.cos(a) * (r - 10)} ${Math.sin(a) * (r - 10)} q ${Math.cos(a + 1.2) * 14} ${Math.sin(a + 1.2) * 14} ${Math.cos(a) * 18} ${Math.sin(a) * 18}`}
            stroke="#FF8A8A"
            strokeWidth={4}
            fill="none"
            opacity={0.6 + 0.4 * coroides}
          />
        );
      })}
      <path d={arco(R - 44, a0, a1)} stroke="#F0A0B8" strokeWidth={8} fill="none" />
      {coroides > 0 ? <path d={arco(R - 22, a0, a1)} stroke={C.red} strokeWidth={48} fill="none" opacity={0.35 * coroides} filter="url(#brillo-ojo)" /> : null}
      {/* Nervio óptico */}
      <rect x={R - 6} y={-24} width={80} height={48} rx={10} fill="#E8B04A" opacity={0.8} />
      {/* Córnea, iris y cristalino */}
      <path d={`M ${-R + 24} ${-130} Q ${-R - 110} 0 ${-R + 24} ${130}`} fill="#08D8E8" fillOpacity={0.12} stroke="#9AE8F0" strokeWidth={6} />
      <line x1={-R + 46} y1={-128} x2={-R + 46} y2={-media} stroke={IRIS} strokeWidth={18} strokeLinecap="round" />
      <line x1={-R + 46} y1={media} x2={-R + 46} y2={128} stroke={IRIS} strokeWidth={18} strokeLinecap="round" />
      <ellipse cx={-R + 100} cy={0} rx={42} ry={98} fill="#C8DCFF" fillOpacity={0.22} stroke="#C8DCFF" strokeWidth={5} />
      {etiquetas > 0 ? (
        <g opacity={etiquetas} fontFamily={mono} fontSize={30} fill={C.grey}>
          <text x={-R + 30} y={-170} textAnchor="middle">pupila</text>
          <text x={40} y={-R - 34}>retina</text>
          <text x={110} y={R + 62} fill={C.red} fontWeight={700}>coroides</text>
        </g>
      ) : null}
    </g>
  );
};

// Gato de frente con los ojos brillando
export const Gato: React.FC<{ readonly x: number; readonly y: number; readonly s?: number; readonly brillo: number }> = ({ x, y, s = 1, brillo }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -230 -60 L -200 -300 L -70 -190 Z" fill={PIEL} stroke={TRAZO} strokeWidth={6} />
    <path d="M 230 -60 L 200 -300 L 70 -190 Z" fill={PIEL} stroke={TRAZO} strokeWidth={6} />
    <path d="M -180 -230 L -110 -175 L -170 -110 Z M 180 -230 L 110 -175 L 170 -110 Z" fill="#E8A0B8" opacity={0.6} />
    <ellipse rx={250} ry={210} fill={PIEL} stroke={TRAZO} strokeWidth={8} />
    <OjoFrente x={-100} y={-30} s={0.72} gato pupila={0.9} reflejo={brillo > 0 ? "#7CFFB0" : null} intensidad={brillo} />
    <OjoFrente x={100} y={-30} s={0.72} gato pupila={0.9} reflejo={brillo > 0 ? "#7CFFB0" : null} intensidad={brillo} />
    <path d="M -20 50 L 20 50 L 0 74 Z" fill="#E8A0B8" />
    <path d="M 0 74 Q -10 110 -50 104 M 0 74 Q 10 110 50 104" stroke={TRAZO} strokeWidth={6} fill="none" strokeLinecap="round" />
    {[-1, 1].map((l) => (
      <g key={l} stroke={TRAZO} strokeWidth={4} strokeLinecap="round">
        <line x1={l * 80} y1={80} x2={l * 260} y2={50} />
        <line x1={l * 80} y1={96} x2={l * 260} y2={110} />
      </g>
    ))}
  </g>
);
