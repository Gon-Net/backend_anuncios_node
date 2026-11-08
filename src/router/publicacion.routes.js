const { Router } = require("express");
const publicacionController = require("../controllers/publicacion.controller");

const router = Router();

router.get("/", publicacionController.listar);
router.get("/:id", publicacionController.obtener);
router.post("/", publicacionController.crear);
router.put("/:id", publicacionController.actualizar);
router.delete("/:id", publicacionController.eliminar);

module.exports = router;
