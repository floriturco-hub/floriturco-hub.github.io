import narracion from "../../guion/aguaazul/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Absorbe,
  Bucle,
  Burbujas,
  Cierre,
  Gancho,
  Profundo,
  T,
} from "./Escenas";

export const DURACION_AGUAAZUL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AguaAzul: React.FC = () => (
  <Short
    carpeta="aguaazul"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.vaso, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.vaso, hasta: T.sol, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Absorbe", desde: T.sol, hasta: T.vaso2, render: (t0) => <Absorbe t0={t0} /> },
      { nombre: "Profundo", desde: T.vaso2, hasta: T.congelador, render: (t0) => <Profundo t0={t0} /> },
      { nombre: "Burbujas", desde: T.congelador, hasta: T.porEso, render: (t0) => <Burbujas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Absorción del rojo", T.rojo, T.vaso2, C.white],
      ["Dispersión de la luz", T.burbujas, T.porEso, C.yellow],
    ]}
    tics={[0.6, T.absorbe, T.regresa]}
  />
);
