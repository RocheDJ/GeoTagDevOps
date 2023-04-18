import {assert} from "chai";
import {geoTagService} from "./geotag-service.js";
import {maggie} from "../fixtures.js";
import {decodeToken} from "../../src/api/jwt-utils.js";


suite("Authentication API tests", async () => {
    setup(async () => {
        await geoTagService.clearAuth();
        await geoTagService.createUser(maggie);
        await geoTagService.authenticate(maggie);
        await geoTagService.deleteAllUsers();
    });

    test("Authenticate", async () => {
        const returnedUser = await geoTagService.createUser(maggie);
        const response = await geoTagService.authenticate(maggie);
        assert(response.success);
        assert.isDefined(response.token);
    });

    test("Verify Token", async () => {
        const returnedUser = await geoTagService.createUser(maggie);
        const response = await geoTagService.authenticate(maggie);

        const userInfo = decodeToken(response.token);
        assert.equal(userInfo.email, returnedUser.email);
        assert.equal(userInfo.userId, returnedUser._id);
    });

    test("Check Unauthorized", async () => {
        await geoTagService.clearAuth();
        try {
            await geoTagService.deleteAllUsers();
            assert.fail("Route not protected");
        } catch (error) {
            assert.equal(error.response.data.statusCode, 401);
        }
    });
});