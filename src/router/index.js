const { Router } = require("express");
const categoriaRoutes = require("./categoria.routes");
const publicacionRoutes = require("./publicacion.routes");

const router = Router();

router.use("/categorias", categoriaRoutes);
router.use("/publicaciones", publicacionRoutes);

module.exports = router;
