import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import {
  Antes,
  Cierre,
  Filtran,
  Gancho,
  Inclinar,
  Polarizada,
  Proyector,
  T,
} from "./Escenas";

export const DURACION_LENTES3D_S = duracionShort(T.fin);

export const Lentes3D: React.FC = () => (
  <Short
    carpeta="lentes3d"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: cada ojo",
        desde: 0,
        hasta: T.cerebro,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Antes",
        desde: T.cerebro,
        hasta: T.polarizada,
        render: (t0) => <Antes t0={t0} />,
      },
      {
        nombre: "Polarizada",
        desde: T.polarizada,
        hasta: T.proyector,
        render: (t0) => <Polarizada t0={t0} />,
      },
      {
        nombre: "Proyector",
        desde: T.proyector,
        hasta: T.plateada,
        render: (t0) => <Proyector t0={t0} />,
      },
      {
        nombre: "Filtran",
        desde: T.plateada,
        hasta: T.inclinar,
        render: (t0) => <Filtran t0={t0} />,
      },
      {
        nombre: "Inclinar",
        desde: T.inclinar,
        hasta: T.junta,
        render: (t0) => <Inclinar t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.junta,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Cada ojo ve otra película!", 0, T.cerebro, C.yellow, 54],
      ["Una imagen para cada ojo", T.dos, T.noventa, C.white],
      ["Rojo y azul: sin colores", T.arruinaban, T.polarizada, C.red],
      ["Luz polarizada", T.polarizada, T.gira, C.yellow],
      ["La luz gira como sacacorchos", T.gira, T.proyector, C.cyan],
      ["144 imágenes por segundo", T.cientos, T.filtro, C.yellow],
      ["Un filtro cambia el giro", T.filtro, T.plateada, C.cyan],
      ["Cada cristal, un giro", T.cristal, T.ojo, C.white],
      ["Cada ojo, su imagen", T.ojo, T.inclinar, C.yellow],
      ["Inclina la cabeza: sigue", T.inclinar, T.junta, C.cyan],
      ["La película sale de la pantalla", T.junta, T.fin + 0.5, C.yellow, 40],
    ]}
    tics={[1.0, T.polarizada, T.cientos, T.ojo, T.sale]}
  />
);
