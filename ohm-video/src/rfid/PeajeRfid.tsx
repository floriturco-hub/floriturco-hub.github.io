import narracion from "../../guion/rfid/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bateria,
  Bucle,
  Cierre,
  Cobro,
  Etiq,
  Gancho,
  Induce,
  Responde,
  T,
} from "./Escenas";

export const DURACION_RFID_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PeajeRfid: React.FC = () => (
  <Short
    carpeta="rfid"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.pasas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.pasas, hasta: T.etiqueta, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Etiqueta", desde: T.etiqueta, hasta: T.envia, render: (t0) => <Etiq t0={t0} /> },
      { nombre: "Inducción", desde: T.envia, hasta: T.energia, render: (t0) => <Induce t0={t0} /> },
      { nombre: "Respuesta", desde: T.energia, hasta: T.todo, render: (t0) => <Responde t0={t0} /> },
      { nombre: "Cobro", desde: T.todo, hasta: T.chip2, render: (t0) => <Cobro t0={t0} /> },
      { nombre: "Sin batería", desde: T.chip2, hasta: T.asi, render: (t0) => <Bateria t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["RFID pasivo", T.etiqueta, T.envia, C.white],
      ["Inducción", T.inducen, T.energia, C.orange],
      ["Retrodispersión", T.modulando, T.todo, C.yellow],
    ]}
    tics={[0.7, T.inducen, T.despertar, T.alimenta]}
  />
);
