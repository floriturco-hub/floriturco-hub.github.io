import narracion from "../../guion/etileno/narracion.json";
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
  Etileno,
  Gancho,
  Manzana,
  Papel,
  T,
} from "./Escenas";

export const DURACION_ETILENO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FrutaMadura: React.FC = () => (
  <Short
    carpeta="etileno"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.guardas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.guardas, hasta: T.etileno, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Etileno", desde: T.etileno, hasta: T.papel2, render: (t0) => <Etileno t0={t0} /> },
      { nombre: "Papel", desde: T.papel2, hasta: T.manzana, render: (t0) => <Papel t0={t0} /> },
      { nombre: "Manzana", desde: T.manzana, hasta: T.porEso, render: (t0) => <Manzana t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Hormona vegetal", T.etileno, T.azucar, C.yellow],
      ["Reacción en cadena", T.suelta2, T.papel2, C.orange],
    ]}
    tics={[0.6, T.etileno, T.cadena]}
  />
);
