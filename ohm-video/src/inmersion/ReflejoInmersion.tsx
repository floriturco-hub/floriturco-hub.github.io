import narracion from "../../guion/inmersion/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Ahorra,
  Bazo,
  Bucle,
  Cierre,
  Gancho,
  Reflejo,
  T,
} from "./Escenas";

export const DURACION_INMERSION_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ReflejoInmersion: React.FC = () => (
  <Short
    carpeta="inmersion"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cara, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cara, hasta: T.reflejo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Reflejo", desde: T.reflejo, hasta: T.frena2, render: (t0) => <Reflejo t0={t0} /> },
      { nombre: "Ahorra", desde: T.frena2, hasta: T.bazo, render: (t0) => <Ahorra t0={t0} /> },
      { nombre: "Bazo", desde: T.bazo, hasta: T.porEso, render: (t0) => <Bazo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Reflejo de inmersión", T.reflejo, T.frena2, C.yellow],
      ["Bradicardia", T.frena2, T.vasos, C.orange],
    ]}
    tics={[0.6, T.frena2, T.ansiedad]}
  />
);
