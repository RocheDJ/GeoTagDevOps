import { assert } from "chai";
import { db } from "../../src/models/db.js";
import {testDBType, testCategories, testPOI, Kiln, testKiln, demoCategory, demoUser, maggie} from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("POI Model tests", () => {
  let categoryList = null;

  setup(async () => {
    db.init(testDBType);
    // delete all catagories form the list
    await db.categoryStore.deleteAllCategories();
    await db.poiStore.deleteAllPOI();
    // add a new category
    categoryList = await db.categoryStore.addCategory(Kiln);
    // add the test points to the category
    for (let i = 0; i < testPOI.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOI[i] = await db.poiStore.addPOI(categoryList._id, testPOI[i]);
    }
  });

  test("Create single POI", async () => {
    const kilnList = await db.categoryStore.addCategory(Kiln);
    const poi = await db.poiStore.addPOI(kilnList._id, testKiln);
    assert.isNotNull(poi._id);
    assertSubset(testKiln, poi);
  });

  test("Delete all POIs", async () => {
    const aPOIs = await db.poiStore.getAllPOI();
    assert.equal(testPOI.length, aPOIs.length);
    await db.poiStore.deleteAllPOI();
    const newPOI = await db.poiStore.getAllPOI();
    assert.equal(0, newPOI.length);
  });

  test("Get a POI - success", async () => {
    const testCategory = await db.categoryStore.addCategory(Kiln);
    const poi = await db.poiStore.addPOI(testCategory._id, testKiln);
    const newPOI = await db.poiStore.getPOIById(poi._id);
    assertSubset(testKiln, newPOI);
  });

  test("Delete One POI - success", async () => {
    await db.poiStore.deletePOIById(testPOI[0]._id);
    const aPOIs = await db.poiStore.getAllPOI();
    assert.equal(aPOIs.length, testPOI.length - 1);
    const deletedPOI = await db.poiStore.getPOIById(testPOI[0]._id);
    assert.isNull(deletedPOI);
  });

  test("Get a poi - bad params  gives Null", async () => {
    assert.isNull(await db.poiStore.getPOIById(""));
    assert.isNull(await db.poiStore.getPOIById());
  });

  test("delete one poi - fail", async () => {
    await db.poiStore.deletePOIById("bad-id");
    const aPOIs = await db.poiStore.getAllPOI();
    assert.equal(aPOIs.length, testPOI.length);
  });

  test("Add Demo Points", async () => {
    // add the demo user
    const newUser = await db.userStore.addUser(demoUser);
    // add the demo cat for the demo user
    const demoCat = demoCategory;
    demoCat.userid = newUser._id;
    const newCat = await db.categoryStore.addCategory(demoCat);
    // add the test points to the category
    for (let i = 0; i < testPOI.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOI[i] = await db.poiStore.addPOI(newCat._id, testPOI[i]);
    }

    assert.equal(1, 1);
  });
});
