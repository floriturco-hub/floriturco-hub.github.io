import narracion from "../../guion/plasma/narracion.json";
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
  Circuito,
  Electrodos,
  Gancho,
  Plasma,
  Rompe,
  Viento,
  T,
} from "./Escenas";

export const DURACION_PLASMA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EncendedorPlasma: React.FC = () => (
  <Short
    carpeta="plasma"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.este, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.este, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Circuito", desde: T.dentro, hasta: T.ese, render: (t0) => <Circuito t0={t0} /> },
      { nombre: "Electrodos", desde: T.ese, hasta: T.aire, render: (t0) => <Electrodos t0={t0} /> },
      { nombre: "Ruptura", desde: T.aire, hasta: T.nace, render: (t0) => <Rompe t0={t0} /> },
      { nombre: "Plasma", desde: T.nace, hasta: T.como, render: (t0) => <Plasma t0={t0} /> },
      { nombre: "Viento", desde: T.como, hasta: T.asi, render: (t0) => <Viento t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Alto voltaje", T.miles, T.aire, C.white],
      ["Ruptura dieléctrica", T.rompe, T.nace, C.cyan],
      ["Gas ionizado", T.plasma, T.asi, C.purpleLight],
    ]}
    tics={[0.7, T.arco, T.conductor, T.mecha]}
  />
);
