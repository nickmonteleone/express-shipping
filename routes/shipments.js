"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const shipmentSchema = require("../schemas/shipmentSchema.json")
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  console.log('req body', req.body);
  const validationResult = jsonschema.validate(
    req.body,
    shipmentSchema,
    {required: true}
  );
  console.log('validationResult', validationResult);

  if (!validationResult.valid) {
    const errs = validationResult.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


module.exports = router;