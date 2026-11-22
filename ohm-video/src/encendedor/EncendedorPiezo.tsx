import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Cierre,
  Gancho,
  Llama,
  Piezo,
  Resorte,
  SinPila,
  T,
  Voltios,
} from "./Escenas";

export const DURACION_ENCENDEDOR_S = duracionShort(T.fin);

export const EncendedorPiezo: React.FC = () => (
  <Short
    carpeta="encendedor"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: rayo",
        desde: 0,
        hasta: T.pila,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Sin pila",
        desde: T.pila,
        hasta: T.cristal,
        render: (t0) => <SinPila t0={t0} />,
      },
      {
        nombre: "Piezo",
        desde: T.cristal,
        hasta: T.despacio,
        render: (t0) => <Piezo t0={t0} />,
      },
      {
        nombre: "Resorte",
        desde: T.despacio,
        hasta: T.rapido,
        render: (t0) => <Resorte t0={t0} />,
      },
      {
        nombre: "Voltios",
        desde: T.rapido,
        hasta: T.valvula,
        render: (t0) => <Voltios t0={t0} />,
      },
      {
        nombre: "Llama",
        desde: T.valvula,
        hasta: T.sin,
        render: (t0) => <Llama t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.sin,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu pulgar fabrica un rayo!", 0, T.pila, C.yellow, 54],
      ["Sin pila", T.pila, T.cristal, C.white],
      ["Cristal piezoeléctrico", T.cristal, T.separan, C.cyan],
      ["Lo aprietas: separa cargas", T.separan, T.despacio, C.yellow],
      ["Un resorte lanza un martillo", T.suelta, T.rapido, C.white],
      ["Miles de voltios", T.miles, T.valvula, C.yellow],
      ["Chispa + gas = llama", T.enciende, T.sin, C.orange],
      ["Sin pilas: solo tu pulgar", T.sin, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.separan, T.clic, T.chispa, T.enciende]}
  />
);
