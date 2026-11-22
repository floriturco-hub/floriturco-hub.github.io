import narracion from "../../guion/estrellafugaz/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aire,
  Bucle,
  Cierre,
  Compresion,
  Gancho,
  Toneladas,
  Tubo,
  Velocidad,
  T,
} from "./Escenas";

export const DURACION_ESTRELLAFUGAZ_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EstrellaFugaz: React.FC = () => (
  <Short
    carpeta="estrellafugaz"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.parece, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.parece, hasta: T.entra, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Velocidad", desde: T.entra, hasta: T.velocidad, render: (t0) => <Velocidad t0={t0} /> },
      { nombre: "Compresión", desde: T.velocidad, hasta: T.vaporiza, render: (t0) => <Compresion t0={t0} /> },
      { nombre: "Estela", desde: T.vaporiza, hasta: T.ves, render: (t0) => <Tubo t0={t0} /> },
      { nombre: "Aire", desde: T.ves, hasta: T.cada, render: (t0) => <Aire t0={t0} /> },
      { nombre: "Polvo", desde: T.cada, hasta: T.asi, render: (t0) => <Toneladas t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Meteoro", T.polvo, T.entra, C.white],
      ["Aire ionizado brillante", T.tubo, T.cada, C.yellow],
    ]}
    tics={[0.6, T.calienta, T.toneladas]}
  />
);
