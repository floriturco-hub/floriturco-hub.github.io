import narracion from "../../guion/huevococido/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Blanca,
  Bucle,
  Cierre,
  Gancho,
  Irreversible,
  Ovillos,
  Red,
  T,
} from "./Escenas";

export const DURACION_HUEVO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HuevoCocido: React.FC = () => (
  <Short
    carpeta="huevococido"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.derrite, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.derrite, hasta: T.agua, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ovillos", desde: T.agua, hasta: T.estiradas, render: (t0) => <Ovillos t0={t0} /> },
      { nombre: "Red", desde: T.estiradas, hasta: T.luz, render: (t0) => <Red t0={t0} /> },
      { nombre: "Blanca", desde: T.luz, hasta: T.enlaces, render: (t0) => <Blanca t0={t0} /> },
      { nombre: "Irreversible", desde: T.enlaces, hasta: T.porEso, render: (t0) => <Irreversible t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Desnaturalización", T.vibrar, T.estiradas, C.orange],
      ["Coagulación", T.gel, T.luz, C.yellow],
    ]}
    tics={[0.6, T.desenrollan, T.crudo]}
  />
);
