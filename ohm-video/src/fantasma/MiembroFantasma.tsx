import narracion from "../../guion/fantasma/narracion.json";
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
  Espejo,
  Gancho,
  MapaEsc,
  Ordenes,
  Vecinos,
  T,
} from "./Escenas";

export const DURACION_FANTASMA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MiembroFantasma: React.FC = () => (
  <Short
    carpeta="fantasma"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.pierde, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.pierde, hasta: T.mapa, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Mapa del cuerpo", desde: T.mapa, hasta: T.cara, render: (t0) => <MapaEsc t0={t0} /> },
      { nombre: "Vecinos", desde: T.cara, hasta: T.ordenes, render: (t0) => <Vecinos t0={t0} /> },
      { nombre: "Órdenes", desde: T.ordenes, hasta: T.espejo, render: (t0) => <Ordenes t0={t0} /> },
      { nombre: "Espejo", desde: T.espejo, hasta: T.asi, render: (t0) => <Espejo t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Corteza somatosensorial", T.mapa, T.cara, C.white],
      ["Terapia del espejo", T.espejo, T.asi, C.yellow],
    ]}
    tics={[0.6, T.fantasma, T.espejo]}
  />
);
