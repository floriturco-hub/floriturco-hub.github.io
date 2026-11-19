import narracion from "../../guion/tripas/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Borborigmo,
  Bucle,
  Cierre,
  Gancho,
  Limpieza,
  Ondas,
  Retumba,
  T,
} from "./Escenas";

export const DURACION_TRIPAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PanzaRuge: React.FC = () => (
  <Short
    carpeta="tripas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tienes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tienes, hasta: T.estomago, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Peristalsis", desde: T.estomago, hasta: T.vacios, render: (t0) => <Ondas t0={t0} /> },
      { nombre: "Limpieza", desde: T.vacios, hasta: T.sin, render: (t0) => <Limpieza t0={t0} /> },
      { nombre: "Retumba", desde: T.sin, hasta: T.ruido, render: (t0) => <Retumba t0={t0} /> },
      { nombre: "Borborigmo", desde: T.ruido, hasta: T.porEso, render: (t0) => <Borborigmo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Peristalsis", T.ondas, T.vacios, C.white],
      ["Complejo motor migratorio", T.limpieza, T.sin, C.yellow],
      ["Borborigmo", T.borborigmo, T.porEso, C.yellow],
    ]}
    tics={[0.7, T.limpieza, T.retumban]}
  />
);
