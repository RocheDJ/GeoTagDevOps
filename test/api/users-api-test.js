import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { geoTagService } from "./geotag-service.js";
import { maggie,maggieCredentials, testUsers } from "../fixtures.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    await geoTagService.clearAuth();
    await geoTagService.createUser(maggie);
    await geoTagService.authenticate(maggieCredentials); // create a jwt for test user
    await geoTagService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await geoTagService.createUser(testUsers[i]);
    }

    await geoTagService.createUser(maggie);
    await geoTagService.authenticate(maggieCredentials); // create a jwt for test user
  });
  teardown(async () => {});

  test("create a user", async () => {
    const newUser = await geoTagService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all user Api", async () => {
    let returnedUsers = await geoTagService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await geoTagService.deleteAllUsers(); // delete them all
    await geoTagService.createUser(maggie); // create and authenticate the test user so we call the get users command
    await geoTagService.authenticate(maggieCredentials);
    returnedUsers = await geoTagService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user", async () => {
    const returnedUser = await geoTagService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await geoTagService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a user - deleted user", async () => {
    await geoTagService.deleteAllUsers();
    try {
      await geoTagService.createUser(maggie); // create and authenticate the test user so we call the get users command
      await geoTagService.authenticate(maggieCredentials);
      const returnedUser = await geoTagService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
