import narracion from "../../guion/silicona/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Ceramica,
  Ciclo,
  Cierre,
  Curvas,
  Gancho,
  Horas,
  T,
} from "./Escenas";

export const DURACION_SILICONA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PistolaSilicona: React.FC = () => (
  <Short
    carpeta="silicona"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.termostato, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.termostato, hasta: T.calentador, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cerámica PTC", desde: T.calentador, hasta: T.frio, render: (t0) => <Ceramica t0={t0} /> },
      { nombre: "Curva", desde: T.frio, hasta: T.pasa, render: (t0) => <Curvas t0={t0} /> },
      { nombre: "Ciclo", desde: T.pasa, hasta: T.aunque, render: (t0) => <Ciclo t0={t0} /> },
      { nombre: "Horas", desde: T.aunque, hasta: T.porEso, render: (t0) => <Horas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Termistor PTC", T.ptc, T.frio, C.orange],
      ["Punto de Curie", T.estructura, T.pasa, C.white],
      ["Autorregulación", T.regula, T.porEso, C.yellow],
    ]}
    tics={[0.7, T.dispara, T.regula]}
  />
);
