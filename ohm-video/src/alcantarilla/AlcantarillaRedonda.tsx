import narracion from "../../guion/alcantarilla/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Ancho,
  Bucle,
  Cierre,
  Cuadrada,
  Gancho,
  Gira,
  Tubo,
  Ventajas,
  T,
} from "./Escenas";

export const DURACION_ALCANTARILLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AlcantarillaRedonda: React.FC = () => (
  <Short
    carpeta="alcantarilla"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.casi, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.casi, hasta: T.circulo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ancho constante", desde: T.circulo, hasta: T.gires, render: (t0) => <Ancho t0={t0} /> },
      { nombre: "No cae", desde: T.gires, hasta: T.cuadrada, render: (t0) => <Gira t0={t0} /> },
      { nombre: "Cuadrada", desde: T.cuadrada, hasta: T.ademas, render: (t0) => <Cuadrada t0={t0} /> },
      { nombre: "Ventajas", desde: T.ademas, hasta: T.pozo, render: (t0) => <Ventajas t0={t0} /> },
      { nombre: "Tubo", desde: T.pozo, hasta: T.porEso, render: (t0) => <Tubo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Ancho constante", T.ancho, T.cuadrada, C.yellow],
      ["Diagonal del cuadrado", T.diagonal, T.ademas, C.red],
    ]}
    tics={[0.7, T.cae]}
  />
);
