import narracion from "../../guion/chocolate/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bloom,
  Brillo,
  Bucle,
  Cierre,
  Formas,
  Gancho,
  Templa,
  T,
} from "./Escenas";

export const DURACION_CHOCOLATE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ChocolateCristales: React.FC = () => (
  <Short
    carpeta="chocolate"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.buen, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.buen, hasta: T.manteca, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Seis cristales", desde: T.manteca, hasta: T.porEso1, render: (t0) => <Formas t0={t0} /> },
      { nombre: "Templado", desde: T.porEso1, hasta: T.brillante, render: (t0) => <Templa t0={t0} /> },
      { nombre: "Brillo", desde: T.brillante, hasta: T.si, render: (t0) => <Brillo t0={t0} /> },
      { nombre: "Capa blanca", desde: T.si, hasta: T.porEso, render: (t0) => <Bloom t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Polimorfismo", T.formas, T.buena, C.white],
      ["Cristal V", T.buena, T.porEso1, C.yellow],
      ["Eflorescencia grasa", T.mal, T.porEso, C.white],
    ]}
    tics={[0.7, T.buena, T.cruje]}
  />
);
