const {
  categorias,
  publicaciones,
  nuevoIdCategoria,
} = require("../data/db");

const ESTADOS = ["activo", "inactivo"];

function normalizarTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function buscarPorId(id) {
  return categorias.find((categoria) => categoria.id === Number(id));
}

function existeNombre(nombre, idExcluir = null) {
  const nombreNormalizado = nombre.toLowerCase();
  return categorias.some(
    (categoria) =>
      categoria.id !== idExcluir &&
      categoria.nombre.toLowerCase() === nombreNormalizado
  );
}

// GET /api/categorias
function listar(req, res) {
  return res.json(categorias);
}

// GET /api/categorias/:id
function obtener(req, res) {
  const categoria = buscarPorId(req.params.id);

  if (!categoria) {
    return res
      .status(404)
      .json({ mensaje: "Categoría no encontrada." });
  }

  return res.json(categoria);
}

// POST /api/categorias
function crear(req, res) {
  const { nombre, descripcion, estado } = req.body || {};
  const nombreLimpio = normalizarTexto(nombre);

  if (!nombreLimpio) {
    return res
      .status(400)
      .json({ mensaje: "El nombre de la categoría es obligatorio." });
  }

  if (existeNombre(nombreLimpio)) {
    return res.status(409).json({
      mensaje: `Ya existe una categoría con el nombre "${nombreLimpio}".`,
    });
  }

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({
      mensaje: `Estado inválido. Valores permitidos: ${ESTADOS.join(", ")}.`,
    });
  }

  const ahora = new Date().toISOString();
  const categoria = {
    id: nuevoIdCategoria(),
    nombre: nombreLimpio,
    descripcion: normalizarTexto(descripcion),
    estado: estado || "activo",
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  categorias.push(categoria);

  return res.status(201).json(categoria);
}

// PUT /api/categorias/:id
function actualizar(req, res) {
  const categoria = buscarPorId(req.params.id);

  if (!categoria) {
    return res
      .status(404)
      .json({ mensaje: "Categoría no encontrada." });
  }

  const { nombre, descripcion, estado } = req.body || {};

  if (nombre === undefined && descripcion === undefined && estado === undefined) {
    return res.status(400).json({
      mensaje:
        "Debe enviar al menos un campo para actualizar (nombre, descripcion o estado).",
    });
  }

  if (nombre !== undefined) {
    const nombreLimpio = normalizarTexto(nombre);

    if (!nombreLimpio) {
      return res
        .status(400)
        .json({ mensaje: "El nombre de la categoría no puede estar vacío." });
    }

    if (existeNombre(nombreLimpio, categoria.id)) {
      return res.status(409).json({
        mensaje: `Ya existe una categoría con el nombre "${nombreLimpio}".`,
      });
    }

    categoria.nombre = nombreLimpio;
  }

  if (descripcion !== undefined) {
    categoria.descripcion = normalizarTexto(descripcion);
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({
        mensaje: `Estado inválido. Valores permitidos: ${ESTADOS.join(", ")}.`,
      });
    }
    categoria.estado = estado;
  }

  categoria.actualizadoEn = new Date().toISOString();

  return res.json(categoria);
}

// DELETE /api/categorias/:id
function eliminar(req, res) {
  const indice = categorias.findIndex(
    (categoria) => categoria.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ mensaje: "Categoría no encontrada." });
  }

  const categoria = categorias[indice];
  const totalPublicaciones = publicaciones.filter(
    (publicacion) => publicacion.categoriaId === categoria.id
  ).length;

  if (totalPublicaciones > 0) {
    return res.status(409).json({
      mensaje: `No se puede eliminar la categoría porque tiene ${totalPublicaciones} publicación(es) asociada(s).`,
    });
  }

  categorias.splice(indice, 1);

  return res.json({ mensaje: "Categoría eliminada correctamente." });
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};
