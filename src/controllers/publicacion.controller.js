const {
  categorias,
  publicaciones,
  nuevoIdPublicacion,
} = require("../data/db");

const ESTADOS = ["borrador", "publicado", "pausado", "vendido"];

function normalizarTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function buscarPorId(id) {
  return publicaciones.find((publicacion) => publicacion.id === Number(id));
}

function buscarCategoria(id) {
  return categorias.find((categoria) => categoria.id === Number(id));
}

function validarPrecio(precio) {
  return typeof precio === "number" && Number.isFinite(precio) && precio >= 0;
}

// GET /api/publicaciones?categoriaId=1&estado=publicado&q=laptop
function listar(req, res) {
  const { categoriaId, estado, q } = req.query;
  let resultado = [...publicaciones];

  if (categoriaId !== undefined) {
    const id = Number(categoriaId);

    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ mensaje: "El parámetro categoriaId debe ser numérico." });
    }

    resultado = resultado.filter(
      (publicacion) => publicacion.categoriaId === id
    );
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({
        mensaje: `Estado inválido. Valores permitidos: ${ESTADOS.join(", ")}.`,
      });
    }

    resultado = resultado.filter(
      (publicacion) => publicacion.estado === estado
    );
  }

  if (q !== undefined) {
    const texto = normalizarTexto(String(q)).toLowerCase();

    resultado = resultado.filter((publicacion) =>
      publicacion.titulo.toLowerCase().includes(texto)
    );
  }

  return res.json(resultado);
}

// GET /api/publicaciones/:id
function obtener(req, res) {
  const publicacion = buscarPorId(req.params.id);

  if (!publicacion) {
    return res
      .status(404)
      .json({ mensaje: "Publicación no encontrada." });
  }

  return res.json(publicacion);
}

// POST /api/publicaciones
function crear(req, res) {
  const {
    titulo,
    descripcion,
    precio,
    moneda,
    ubicacion,
    categoriaId,
    estado,
  } = req.body || {};

  const tituloLimpio = normalizarTexto(titulo);

  if (!tituloLimpio) {
    return res
      .status(400)
      .json({ mensaje: "El título de la publicación es obligatorio." });
  }

  if (categoriaId === undefined || categoriaId === null) {
    return res
      .status(400)
      .json({ mensaje: "El campo categoriaId es obligatorio." });
  }

  if (!buscarCategoria(categoriaId)) {
    return res
      .status(400)
      .json({ mensaje: `No existe una categoría con id ${categoriaId}.` });
  }

  if (precio !== undefined && !validarPrecio(precio)) {
    return res.status(400).json({
      mensaje: "El precio debe ser un número mayor o igual a 0.",
    });
  }

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res.status(400).json({
      mensaje: `Estado inválido. Valores permitidos: ${ESTADOS.join(", ")}.`,
    });
  }

  const ahora = new Date().toISOString();
  const publicacion = {
    id: nuevoIdPublicacion(),
    titulo: tituloLimpio,
    descripcion: normalizarTexto(descripcion),
    precio: precio === undefined ? 0 : precio,
    moneda: (normalizarTexto(moneda) || "CLP").toUpperCase(),
    ubicacion: normalizarTexto(ubicacion),
    categoriaId: Number(categoriaId),
    estado: estado || "borrador",
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  publicaciones.push(publicacion);

  return res.status(201).json(publicacion);
}

// PUT /api/publicaciones/:id
function actualizar(req, res) {
  const publicacion = buscarPorId(req.params.id);

  if (!publicacion) {
    return res
      .status(404)
      .json({ mensaje: "Publicación no encontrada." });
  }

  const {
    titulo,
    descripcion,
    precio,
    moneda,
    ubicacion,
    categoriaId,
    estado,
  } = req.body || {};

  if (
    titulo === undefined &&
    descripcion === undefined &&
    precio === undefined &&
    moneda === undefined &&
    ubicacion === undefined &&
    categoriaId === undefined &&
    estado === undefined
  ) {
    return res.status(400).json({
      mensaje:
        "Debe enviar al menos un campo para actualizar (titulo, descripcion, precio, moneda, ubicacion, categoriaId o estado).",
    });
  }

  if (titulo !== undefined) {
    const tituloLimpio = normalizarTexto(titulo);

    if (!tituloLimpio) {
      return res
        .status(400)
        .json({ mensaje: "El título no puede estar vacío." });
    }

    publicacion.titulo = tituloLimpio;
  }

  if (descripcion !== undefined) {
    publicacion.descripcion = normalizarTexto(descripcion);
  }

  if (precio !== undefined) {
    if (!validarPrecio(precio)) {
      return res.status(400).json({
        mensaje: "El precio debe ser un número mayor o igual a 0.",
      });
    }
    publicacion.precio = precio;
  }

  if (moneda !== undefined) {
    publicacion.moneda = normalizarTexto(moneda).toUpperCase();
  }

  if (ubicacion !== undefined) {
    publicacion.ubicacion = normalizarTexto(ubicacion);
  }

  if (categoriaId !== undefined) {
    if (!buscarCategoria(categoriaId)) {
      return res
        .status(400)
        .json({ mensaje: `No existe una categoría con id ${categoriaId}.` });
    }
    publicacion.categoriaId = Number(categoriaId);
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({
        mensaje: `Estado inválido. Valores permitidos: ${ESTADOS.join(", ")}.`,
      });
    }
    publicacion.estado = estado;
  }

  publicacion.actualizadoEn = new Date().toISOString();

  return res.json(publicacion);
}

// DELETE /api/publicaciones/:id
function eliminar(req, res) {
  const indice = publicaciones.findIndex(
    (publicacion) => publicacion.id === Number(req.params.id)
  );

  if (indice === -1) {
    return res
      .status(404)
      .json({ mensaje: "Publicación no encontrada." });
  }

  publicaciones.splice(indice, 1);

  return res.json({ mensaje: "Publicación eliminada correctamente." });
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};
