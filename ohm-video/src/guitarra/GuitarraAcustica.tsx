import narracion from "../../guion/guitarra/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Agujero,
  Bucle,
  Cierre,
  Cuerda,
  Electricidad,
  Gancho,
  Puente,
  Tambor,
  T,
} from "./Escenas";

export const DURACION_GUITARRA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const GuitarraAcustica: React.FC = () => (
  <Short
    carpeta="guitarra"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.mismas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.mismas, hasta: T.una, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cuerda", desde: T.una, hasta: T.en, render: (t0) => <Cuerda t0={t0} /> },
      { nombre: "Puente", desde: T.en, hasta: T.esa, render: (t0) => <Puente t0={t0} /> },
      { nombre: "Tambor", desde: T.esa, hasta: T.el, render: (t0) => <Tambor t0={t0} /> },
      { nombre: "Agujero", desde: T.el, hasta: T.la, render: (t0) => <Agujero t0={t0} /> },
      { nombre: "Eléctrica", desde: T.la, hasta: T.porEso, render: (t0) => <Electricidad t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Caja de resonancia", T.resonancia, T.el, C.yellow],
      ["Pastillas magnéticas", T.imanes, T.porEso, C.white],
    ]}
    tics={[0.84, T.aire, T.tapa, T.tambor, T.graves, T.amplificador]}
  />
);
