import narracion from "../../guion/panal/narracion.json";
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
  Gancho,
  Gel,
  Hincha,
  Orina,
  Polvo,
  T,
} from "./Escenas";

export const DURACION_PANAL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PanalAbsorbe: React.FC = () => (
  <Short
    carpeta="panal"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.pequeno, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.pequeno, hasta: T.polvo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Polímero", desde: T.polvo, hasta: T.llega, render: (t0) => <Polvo t0={t0} /> },
      { nombre: "Hinchado", desde: T.llega, hasta: T.osmosis, render: (t0) => <Hincha t0={t0} /> },
      { nombre: "Gel", desde: T.osmosis, hasta: T.orina, render: (t0) => <Gel t0={t0} /> },
      { nombre: "Orina", desde: T.orina, hasta: T.asi, render: (t0) => <Orina t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Polímero superabsorbente", T.poliacrilato, T.llega, C.yellow],
      ["La sal frena la ósmosis", T.frena, T.asi, C.white],
    ]}
    tics={[0.6, T.hincha, T.frena]}
  />
);
