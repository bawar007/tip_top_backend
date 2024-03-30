const express = require("express");
const UserController = require("../controllers/UserController.js");
const MapController = require("../controllers/MapController.js");

// Port, na którym serwer będzie nasłuchiwał

const router = express.Router();

router.post("/userCreate", UserController.createUser);
router.post("/login", UserController.heckLogin);
router.post("/marker", MapController.createMarker);
router.get("/reports", MapController.getMarkersInReports);
router.get("/threats", MapController.getThreats);

module.exports = router;
