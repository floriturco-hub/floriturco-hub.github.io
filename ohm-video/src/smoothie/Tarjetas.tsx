import { interpolate } from "remotion";
import { C, clamp, mono, useT } from "../theme";
import { Espuma } from "./Espuma";
import { T } from "./tiempos";

const Tarjeta: React.FC<{ readonly alto: number; readonly titulo: string; readonly o: number; readonly children: React.ReactNode }> = ({ alto, titulo, o, children }) => (
  <g opacity={o}>
    <rect x={60} y={150} width={960} height={alto} rx={24} fill={C.card} stroke={C.cardBorder} strokeWidth={2} />
    <text x={110} y={215} fill={C.grey} fontFamily={mono} fontSize={30}>
      {titulo}
    </text>
    {children}
  </g>
);

// Tarjetas superiores (espacio de pantalla) que acompañan a la escena de la ducha
export const Tarjetas: React.FC<{ readonly t0: number }> = ({ t0 }) => {
  const t = useT(t0);
  const sale = (desde: number, hasta: number) => interpolate(t, [desde, desde + 0.4, hasta - 0.4, hasta], [0, 1, 1, 0], clamp);
  const sube = (desde: number) => interpolate(t, [desde - 0.1, desde + 0.3], [0, 1], clamp);

  // 1) Mismo gel: manos frente a esponja
  const t1 = sale(0.3, T.parece + 0.2);
  const crece = interpolate(t, [0.6, 3.2], [0, 1], clamp);
  // 2) Una burbuja de cerca: moléculas con dos caras
  const t2 = sale(T.dosCaras - 0.3, T.poros);
  const rodean = interpolate(t, [T.entraAire, T.burbujas + 0.4], [0, 1], clamp);
  // 3) El truco
  const t3 = sale(T.truco - 0.2, T.noMagia);

  const MOL = 14;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {t1 > 0 ? (
        <Tarjeta alto={340} titulo="la misma cantidad de gel" o={t1}>
          <Espuma x={300} y={430} ancho={150} alto={60} cantidad={0.18 * crece} semilla="manos" t={t} />
          <Espuma x={780} y={430} ancho={300} alto={150} cantidad={crece} semilla="esponjaT" t={t} />
          <text x={300} y={470} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={34} fontWeight={700}>
            manos
          </text>
          <text x={780} y={470} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={34} fontWeight={700}>
            esponja
          </text>
        </Tarjeta>
      ) : null}

      {t2 > 0 ? (
        <Tarjeta alto={360} titulo="una burbuja de cerca" o={t2}>
          <circle cx={300} cy={350} r={80} fill={C.white} opacity={0.12 * rodean} />
          <text x={300} y={360} textAnchor="middle" fill={C.white} fontFamily={mono} fontSize={28} opacity={rodean}>
            aire
          </text>
          {new Array(MOL).fill(0).map((_, i) => {
            const a = (i / MOL) * Math.PI * 2;
            // Antes de que entre el aire, las moléculas están sueltas; luego rodean la burbuja
            const sueltaX = 300 + Math.cos(a * 3 + 1) * 140;
            const sueltaY = 350 + Math.sin(a * 2) * 70;
            const cxm = sueltaX + (300 + Math.cos(a) * 100 - sueltaX) * rodean;
            const cym = sueltaY + (350 + Math.sin(a) * 100 - sueltaY) * rodean;
            const ang = a * (180 / Math.PI) * rodean + (1 - rodean) * i * 40;
            return (
              <g key={i} transform={`translate(${cxm} ${cym}) rotate(${ang})`}>
                <line x1={0} y1={0} x2={-28} y2={0} stroke={C.orange} strokeWidth={5} strokeLinecap="round" />
                <circle cx={6} cy={0} r={9} fill={C.cyan} />
              </g>
            );
          })}
          <g opacity={sube(T.agua)}>
            <circle cx={560} cy={300} r={12} fill={C.cyan} />
            <text x={590} y={311} fill={C.cyan} fontFamily={mono} fontSize={32} fontWeight={700}>
              se agarra al agua
            </text>
          </g>
          <g opacity={sube(T.evita)}>
            <line x1={548} y1={380} x2={576} y2={380} stroke={C.orange} strokeWidth={6} strokeLinecap="round" />
            <text x={590} y={391} fill={C.orange} fontFamily={mono} fontSize={32} fontWeight={700}>
              evita el agua
            </text>
          </g>
        </Tarjeta>
      ) : null}

      {t3 > 0 ? (
        <Tarjeta alto={370} titulo="el truco" o={t3}>
          {[
            { y: 290, texto: "esponja húmeda", desde: T.humeda },
            { y: 350, texto: "un poco de gel", desde: T.pocoGel },
            { y: 410, texto: "apriétala varias veces", desde: T.aprieta },
            { y: 470, texto: "extiende", desde: T.extiende },
          ].map((p, i) => (
            <g key={i} opacity={t >= p.desde ? 1 : 0.25}>
              <circle cx={130} cy={p.y - 12} r={22} fill="none" stroke={C.yellow} strokeWidth={3} />
              <text x={130} y={p.y - 1} textAnchor="middle" fill={C.yellow} fontFamily={mono} fontSize={26} fontWeight={700}>
                {i + 1}
              </text>
              <text x={180} y={p.y} fill={C.white} fontFamily={mono} fontSize={38} fontWeight={700}>
                {p.texto}
              </text>
            </g>
          ))}
        </Tarjeta>
      ) : null}
    </svg>
  );
};
