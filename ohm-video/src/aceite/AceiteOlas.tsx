import narracion from "../../guion/aceite/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Arrugas,
  Bucle,
  Capa,
  Cierre,
  Franklin,
  Gancho,
  Resbala,
  T,
} from "./Escenas";

export const DURACION_ACEITE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AceiteOlas: React.FC = () => (
  <Short
    carpeta="aceite"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tormentas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tormentas, hasta: T.extiende, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Capa de aceite", desde: T.extiende, hasta: T.frena, render: (t0) => <Capa t0={t0} /> },
      { nombre: "Arrugas", desde: T.frena, hasta: T.sin, render: (t0) => <Arrugas t0={t0} /> },
      { nombre: "Olas", desde: T.sin, hasta: T.echo, render: (t0) => <Resbala t0={t0} /> },
      { nombre: "Franklin", desde: T.echo, hasta: T.asi, render: (t0) => <Franklin t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Ondas capilares", T.arrugas, T.sin, C.yellow],
      ["Experimento de Franklin (1773)", T.echo, T.asi, C.white],
    ]}
    tics={[0.6, T.media]}
  />
);
