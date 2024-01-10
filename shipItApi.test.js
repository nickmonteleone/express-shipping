"use strict";

const fetchMock = require("fetch-mock");
const { shipProduct, SHIPIT_SHIP_URL } = require("./shipItApi");

const MOCKED_SHIP_ID = 9999;

test("shipProduct", async function () {
  fetchMock.post(SHIPIT_SHIP_URL, {
    body: {
      receipt: { shipId: MOCKED_SHIP_ID }
    },
    status: 200
  });
  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(shipId).toEqual(MOCKED_SHIP_ID);
});
