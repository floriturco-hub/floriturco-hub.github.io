import narracion from "../../guion/rodilla/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Arco,
  Bucle,
  Cierre,
  Estiron,
  Funcion,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_RODILLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ReflejoRodilla: React.FC = () => (
  <Short
    carpeta="rodilla"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.medico, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.medico, hasta: T.golpe, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Estiron", desde: T.golpe, hasta: T.medula, render: (t0) => <Estiron t0={t0} /> },
      { nombre: "Arco", desde: T.medula, hasta: T.mantenerte, render: (t0) => <Arco t0={t0} /> },
      { nombre: "Funcion", desde: T.mantenerte, hasta: T.porEso, render: (t0) => <Funcion t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Arco reflejo monosináptico", T.monosinaptico, T.mantenerte, C.yellow],
    ]}
    tics={[0.6, T.golpe, T.contrae]}
  />
);
