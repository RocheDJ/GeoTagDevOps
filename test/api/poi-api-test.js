import {assert} from "chai";
import {db} from "../../src/models/db.js";
import {maggie, testPOI, Kiln, testKiln} from "../fixtures.js";
import {assertSubset} from "../test-utils.js";
import {geoTagService} from "./geotag-service.js";


suite("POI API tests", () => {
    let user = null;
    let kilnCategory = null;

    setup(async () => {
        await geoTagService.clearAuth(); // no await just call and
        // create and authenticate a user for initial configuration
        user = await geoTagService.createUser(maggie);
        await geoTagService.authenticate(maggie); // create a jwt for test user
        // delete all information so we start with a clean slate
        await geoTagService.deleteAllCategories();
        await geoTagService.deleteAllPOI();
        await geoTagService.deleteAllUsers();
        // add a user for testing
        user = await geoTagService.createUser(maggie);
        await geoTagService.authenticate(maggie); // create a jwt for test user
        // Give the category a user ID for the test user
        Kiln.userID = user._id;
        // Add the dummy kiln Category
        kilnCategory = await geoTagService.createCategory(Kiln);
    });
    teardown(async () => {
    });

    test("Create a POI", async () => {
        const returnedPOI = await geoTagService.createPOI(kilnCategory._id, testKiln);
        assertSubset(testKiln, returnedPOI); // is the testKiln a Subset of what we just created 
        assert.isDefined(returnedPOI._id); // does that subset have an ID

    });

    test("Create Multiple POIs", async () => {
        for (let i = 0; i < testPOI.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await geoTagService.createPOI(kilnCategory._id, testPOI[i]);
        }
        const returnedPOIs = await geoTagService.getAllPOI();
        assert.equal(returnedPOIs.length, testPOI.length);
        for (let i = 0; i < returnedPOIs.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const poi = await geoTagService.getPOI(returnedPOIs[i]._id);
            assertSubset(poi, returnedPOIs[i]);
        }
    });

    test("Delete All POIs 1 by 1", async () => {
        for (let i = 0; i < testPOI.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await geoTagService.createPOI(kilnCategory._id, testPOI[i]);
        }
        let returnedPOIs = await geoTagService.getAllPOI();
        assert.equal(returnedPOIs.length, testPOI.length);
        for (let i = 0; i < returnedPOIs.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const poi = await geoTagService.deletePOI(returnedPOIs[i]._id);
        }
        returnedPOIs = await geoTagService.getAllPOI();
        assert.equal(returnedPOIs.length, 0);
    });

    test("Create a demo POI", async () => {
        const returnedPOI = await geoTagService.createDEMOPOI(kilnCategory._id, testKiln);
        assertSubset(testKiln, returnedPOI); // is the testKiln a Subset of what we just created
        assert.isDefined(returnedPOI._id); // does that subset have an ID

    });
    test("Create Multiple Demo POIs", async () => {
        // get the demo user id
        const users = await geoTagService.getAllUsers();
        let demoUser = null;
        for (let i = 0; i < users.length; i += 1) {
            if(users[i].email === "demo@geotag.com"){
                demoUser = users[i];
            }
        }
        // get demo category
        const categories = await geoTagService.getAllCategories();
        let demoCat = null
        for (let i = 0; i < categories.length; i += 1) {
            if(categories[i].title === "Demo Locations"){
                demoCat = categories[i];
            }
        }

        for (let i = 0; i < testPOI.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const returnedPOI = await geoTagService.createDEMOPOI(demoCat._id, testPOI[i]);
        }

        const returnedPOIs = await geoTagService.getCategoryPOI(demoCat._id);
        assert.equal(returnedPOIs.length, testPOI.length);

    });
});
