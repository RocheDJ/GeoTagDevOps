import {assert} from "chai";
import {assertSubset} from "../test-utils.js";
import {geoTagService} from "./geotag-service.js";
import {maggie, Kiln, testCategories, testPOI} from "../fixtures.js";

suite("Category API tests", () => {
    let user = null;

    const aCategories = [];

    const aPOI = [];

    setup(async () => {
        await geoTagService.clearAuth();
        user = await geoTagService.createUser(maggie);
        await geoTagService.authenticate(maggie); // create a jwt for test user
        await geoTagService.deleteAllCategories();
        await geoTagService.deleteAllPOI();
        await geoTagService.deleteAllUsers();
        /// because we deleted re-create user
        user = await geoTagService.createUser(maggie);
        await geoTagService.authenticate(maggie); // create a jwt for test user
        Kiln.userID = user._id
        for (let i = 0; i < testCategories.length; i += 1) {
            testCategories[i].userID = user._id;
            // eslint-disable-next-line no-await-in-loop
            aCategories[i] = await geoTagService.createCategory(testCategories[i]);
        }
    });
    teardown(async () => {
    });

    test("Create a category", async () => {
        const newCategory = await geoTagService.createCategory(Kiln);
        assertSubset(Kiln, newCategory);
        assert.isDefined(newCategory._id);
    });

    test("Delete a Category", async () => {
        const oCategory = await geoTagService.createCategory(Kiln);
        const oResponse = await geoTagService.deleteCategory((oCategory._id));
        assert.equal(oResponse.status, 204); // 204 is no content
        try {
            const returnedCategory = await geoTagService.getCategory(oCategory._id);
            assert.fail("Deleted category should not be returned")
        } catch (error) {
            assert(error.response.data.message === "No category with this id");
            ;
            assert.equal(error.response.data.statusCode, 404);
        }
    });


    test("Get a category", async () => {
        const returnedCat = await geoTagService.getCategory(aCategories[0]._id);
        assert.deepEqual(aCategories[0], returnedCat);
    });

    test("Get all POI in a Category", async () => {
        // find the test category
        const returnedCat = await geoTagService.getCategory(aCategories[0]._id);
        // add the test points of interest to it
        for (let i = 0; i < testPOI.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            aPOI[i] = await geoTagService.createPOI(returnedCat._id, testPOI[i]);
        }
        // read back the added POI
        const returnedPOIs = await geoTagService.getCategoryPOI(returnedCat._id);
        assert.deepEqual(returnedPOIs, aPOI);

    });

    test("Get a category with a bad id", async () => {
        try {
            const returnedCat = await geoTagService.getCategory("1234");
            assert.fail("Should not return a response");
        } catch (error) {
            assert(error.response.data.message === "No category with this id");
            assert.equal(error.response.data.statusCode, 404);
        }
    });

    test("Delete all categories", async () => {
        let returnedCategories = await geoTagService.getAllCategories();
        assert.equal(returnedCategories.length, 3);
        await geoTagService.deleteAllCategories();
        returnedCategories = await geoTagService.getAllCategories();
        assert.equal(returnedCategories.length, 0);
    });

    test("Get a category - deleted category", async () => {
        await geoTagService.deleteAllCategories();
        try {
            const returnedCat = await geoTagService.getCategory(testCategories[0]._id);
            assert.fail("Should not return a response");
        } catch (error) {
            assert(error.response.data.message === "No category with this id");
            assert.equal(error.response.data.statusCode, 404);
        }
    });

});