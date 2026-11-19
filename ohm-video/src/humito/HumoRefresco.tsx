import narracion from "../../guion/humito/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Champan,
  Cierre,
  Condensa,
  Enfria,
  Escapa,
  Gancho,
  Mini,
  Presion,
  T,
} from "./Escenas";

export const DURACION_HUMITO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HumoRefresco: React.FC = () => (
  <Short
    carpeta="humito"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.si, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.si, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Presión", desde: T.dentro, hasta: T.al, render: (t0) => <Presion t0={t0} /> },
      { nombre: "Escapa", desde: T.al, hasta: T.y, render: (t0) => <Escapa t0={t0} /> },
      { nombre: "Se enfría", desde: T.y, hasta: T.ese, render: (t0) => <Enfria t0={t0} /> },
      { nombre: "Condensa", desde: T.ese, hasta: T.humito, render: (t0) => <Condensa t0={t0} /> },
      { nombre: "Nube", desde: T.humito, hasta: T.champan, render: (t0) => <Mini t0={t0} /> },
      { nombre: "Champán", desde: T.champan, hasta: T.porEso, render: (t0) => <Champan t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Expansión = enfriamiento", T.decenas, T.ese, C.cyan],
      ["Condensación", T.nubecita, T.humito, C.white],
    ]}
    tics={[0.46, T.al + 0.3, T.enfria, T.nubecita, T.nube, T.champan + 0.6]}
  />
);
