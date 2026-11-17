import narracion from "../../guion/taximetro/narracion.json";
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
  Cruce,
  Gancho,
  Pulsos,
  Tiempo,
  T,
} from "./Escenas";

export const DURACION_TAXIMETRO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Taximetro: React.FC = () => (
  <Short
    carpeta="taximetro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.andando, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.andando, hasta: T.conectado, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Pulsos", desde: T.conectado, hasta: T.pero, render: (t0) => <Pulsos t0={t0} /> },
      { nombre: "Tiempo", desde: T.pero, hasta: T.cambio, render: (t0) => <Tiempo t0={t0} /> },
      { nombre: "Velocidad de cambio", desde: T.cambio, hasta: T.asi, render: (t0) => <Cruce t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sensor de rueda", T.pulsos, T.pero, C.yellow],
      ["Tarifa por tiempo", T.tiempo, T.cambio, C.yellow],
    ]}
    tics={[0.7, T.ficha, T.cambia]}
  />
);
