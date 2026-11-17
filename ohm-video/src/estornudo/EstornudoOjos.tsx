import narracion from "../../guion/estornudo/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Abiertos,
  Bucle,
  Cierre,
  Gancho,
  Mito,
  Musculos,
  Reflejo,
  T,
} from "./Escenas";

export const DURACION_ESTORNUDO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EstornudoOjos: React.FC = () => (
  <Short
    carpeta="estornudo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.estornudas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.estornudas, hasta: T.reflejo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Reflejo", desde: T.reflejo, hasta: T.activa, render: (t0) => <Reflejo t0={t0} /> },
      { nombre: "Músculos", desde: T.activa, hasta: T.pero, render: (t0) => <Musculos t0={t0} /> },
      { nombre: "Mito", desde: T.pero, hasta: T.personas, render: (t0) => <Mito t0={t0} /> },
      { nombre: "Ojos abiertos", desde: T.personas, hasta: T.porEso, render: (t0) => <Abiertos t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Reflejo del estornudo", T.reflejo, T.activa, C.yellow],
      ["Mito desmentido", T.presion, T.personas, C.white],
    ]}
    tics={[0.6, T.reflejo, T.presion]}
  />
);
