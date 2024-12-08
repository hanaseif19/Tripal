const express = require("express");
const router = express.Router();
const {
  searchHotels,
  getHotelDetails,
  getHotelPrices,
  getCityCode,
  saveBooking,
} = require("../controllers/HotelController");

const { verifyToken, authorizeRoles } = require("../middleware/AuthMiddleware");

router.get("/searchHotels",  
  verifyToken,
  authorizeRoles("Tourist"),
  searchHotels
);

router.get("/getHotelDetails",  verifyToken,
authorizeRoles("Tourist"),getHotelDetails);

router.get("/getHotelPrices",  verifyToken,
authorizeRoles("Tourist"),getHotelPrices);

router.get("/searchCity",  verifyToken,
  authorizeRoles("Tourist"),getCityCode);
  
router.post(
  "/saveBooking",
  verifyToken,
  authorizeRoles("Tourist"),
  saveBooking
);

module.exports = router;
