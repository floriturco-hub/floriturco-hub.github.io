import narracion from "../../guion/botox/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Antidoto,
  Botox,
  Bucle,
  Cierre,
  Gancho,
  NoSirve,
  Toxina,
  T,
} from "./Escenas";

export const DURACION_BOTOX_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BotoxVeneno: React.FC = () => (
  <Short
    carpeta="botox"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.dosis, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.dosis, hasta: T.serpiente, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Antidoto", desde: T.serpiente, hasta: T.muchos, render: (t0) => <Antidoto t0={t0} /> },
      { nombre: "NoSirve", desde: T.muchos, hasta: T.toxina, render: (t0) => <NoSirve t0={t0} /> },
      { nombre: "Toxina", desde: T.toxina, hasta: T.inyectada, render: (t0) => <Toxina t0={t0} /> },
      { nombre: "Botox", desde: T.inyectada, hasta: T.asi, render: (t0) => <Botox t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Antiveneno", T.antidotos, T.muchos, C.white],
      ["Unión neuromuscular", T.bloquea, T.inyectada, C.yellow],
    ]}
    tics={[0.6, T.bloquea, T.botox]}
  />
);
