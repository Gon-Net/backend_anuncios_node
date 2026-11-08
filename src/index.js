const express = require("express");
var cors = require("cors");
const rutas = require("./router");

const app = express();
app.use(cors());

const PORT = 3000;

// Permite leer el cuerpo JSON de las peticiones.
app.use(express.json());

app.get("/", function (req, res) {
  return res.json({ mensaje: "Bienvenido a mi Proyecto backend API" });
});

app.use("/api", rutas);

// Ruta no encontrada.
app.use(function (req, res) {
  return res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// Manejo centralizado de errores (incluye JSON mal formado).
app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ mensaje: "El cuerpo JSON no es válido." });
  }

  console.error(err);

  return res
    .status(err.status || 500)
    .json({ mensaje: err.message || "Error interno del servidor." });
});

app.listen(PORT, function () {
  console.log(`Servidor iniciado en: http://127.0.0.1:${PORT}`);
});
