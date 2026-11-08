// Almacenamiento temporal en memoria.
// Cuando se integre una base de datos, este módulo se reemplaza por el acceso real.

const categorias = [
  {
    id: 1,
    nombre: "Tecnología",
    descripcion: "Computadoras, celulares y accesorios",
    estado: "activo",
    creadoEn: "2026-01-10T10:00:00.000Z",
    actualizadoEn: "2026-01-10T10:00:00.000Z",
  },
  {
    id: 2,
    nombre: "Vehículos",
    descripcion: "Autos, motos y camionetas",
    estado: "activo",
    creadoEn: "2026-01-10T10:05:00.000Z",
    actualizadoEn: "2026-01-10T10:05:00.000Z",
  },
  {
    id: 3,
    nombre: "Hogar",
    descripcion: "Muebles, electrodomésticos y decoración",
    estado: "activo",
    creadoEn: "2026-01-10T10:10:00.000Z",
    actualizadoEn: "2026-01-10T10:10:00.000Z",
  },
];

const publicaciones = [
  {
    id: 1,
    titulo: "Laptop HP 15 pulgadas",
    descripcion: "Laptop en buen estado, 8GB de RAM y 512GB SSD.",
    precio: 850000,
    moneda: "CLP",
    ubicacion: "Santiago",
    categoriaId: 1,
    estado: "publicado",
    creadoEn: "2026-02-01T09:00:00.000Z",
    actualizadoEn: "2026-02-01T09:00:00.000Z",
  },
];

let ultimoIdCategoria = 3;
let ultimoIdPublicacion = 1;

function nuevoIdCategoria() {
  return ++ultimoIdCategoria;
}

function nuevoIdPublicacion() {
  return ++ultimoIdPublicacion;
}

module.exports = {
  categorias,
  publicaciones,
  nuevoIdCategoria,
  nuevoIdPublicacion,
};
