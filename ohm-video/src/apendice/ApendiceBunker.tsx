import narracion from "../../guion/apendice/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierre,
  Defensa,
  Diarrea,
  Gancho,
  Intestino,
  Quitar,
  Repuebla,
  T,
  Tubito,
} from "./Escenas";

export const DURACION_APENDICE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ApendiceBunker: React.FC = () => (
  <Short
    carpeta="apendice"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: búnker", desde: 0, hasta: T.durante, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.durante, hasta: T.intestino, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Intestino", desde: T.intestino, hasta: T.apendice, render: (t0) => <Intestino t0={t0} /> },
      { nombre: "Tubito", desde: T.apendice, hasta: T.diarrea, render: (t0) => <Tubito t0={t0} /> },
      { nombre: "Diarrea", desde: T.diarrea, hasta: T.despues, render: (t0) => <Diarrea t0={t0} /> },
      { nombre: "Repuebla", desde: T.despues, hasta: T.ademas, render: (t0) => <Repuebla t0={t0} /> },
      { nombre: "Defensa", desde: T.ademas, hasta: T.aun, render: (t0) => <Defensa t0={t0} /> },
      { nombre: "Quitar", desde: T.aun, hasta: T.porque, render: (t0) => <Quitar t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Microbiota intestinal", T.bacterias, T.apendice, C.white],
      ["Reserva de bacterias", T.protegida, T.diarrea, C.cyan],
      ["Tejido linfoide", T.tejido, T.aun, C.white],
      ["Apendicitis: se opera", T.inflama, T.inutil, C.red],
    ]}
    tics={[1.1, T.tubito, T.arrasa, T.salvo, T.globulos, T.inutil]}
  />
);
