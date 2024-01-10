"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema");
const shipmentSchema = require("../schemas/shipmentSchema.json")
const multipleShipmentsSchema = require("../schemas/multipleShipmentsSchema.json")
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

/** POST /multi
 *
 * {productIds, name, addr, zip}
 *
 * returns JSON: { shipped: [shipId, shipId]] }
 * where the shipId comes from each of ShipIt’s API response.
 */

router.post("/multi", async function (req, res, next) {
  console.log('req body', req.body);
  const validationResult = jsonschema.validate(
    req.body,
    multipleShipmentsSchema,
    {required: true}
  );
  console.log('validationResult', validationResult);

  if (!validationResult.valid) {
    const errs = validationResult.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const name = req.body.name;
  const addr = req.body.addr;
  const zip = req.body.zip;

  const requestBodies = req.body.productIds.map(productId =>  {
    return shipProduct({ productId, name, addr, zip })
  });

  return res.json({shipped: await promise.all(requestBodies)});

});


module.exports = router;