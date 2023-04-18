import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { geoTagService } from "./geotag-service.js";
import {maggie, maggieCredentials, testKiln, testUsers} from "../fixtures.js";


suite("Demo API tests", () => {
    setup(async () => {
     ;
    });
    teardown(async () => {});

    test("Create a demo POI", async () => {
        try
        {
            const returnedPOI = await geoTagService.createDEMOPOI(123, testKiln);
            assertSubset(testKiln, returnedPOI); // is the testKiln a Subset of what we just created
            assert.isDefined(returnedPOI._id); // does that subset have an ID
        }catch (e) {
            console.log(`Create a demo POI error = ${ e.message}`)
        }



    });


});
