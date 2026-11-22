import narracion from "../../guion/palomitas/narracion.json";
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
  Estalla,
  Fallas,
  Frasco,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_PALOMITAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PalomitasGranos: React.FC = () => (
  <Short
    carpeta="palomitas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.hacer, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.hacer, hasta: T.grano, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Estalla", desde: T.grano, hasta: T.grieta, render: (t0) => <Estalla t0={t0} /> },
      { nombre: "Fallas", desde: T.grieta, hasta: T.frasco, render: (t0) => <Fallas t0={t0} /> },
      { nombre: "Frasco", desde: T.frasco, hasta: T.porEso, render: (t0) => <Frasco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Presión de vapor", T.presion, T.grieta, C.yellow],
    ]}
    tics={[0.6, T.revienta, T.grieta]}
  />
);
