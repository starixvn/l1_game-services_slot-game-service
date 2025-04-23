import { ingameTest } from "./in-game.test";
import { settleTest } from "./settle.test";
import { signinTest } from "./sign-in.test";
import { startServiceProcess, startSetupDataProcess } from "./stubs/test-jobs";

let processStartService;
const JEST_ASSERT_WAITING_RESPONSE_TIMEOUT = 120000;
jest.setTimeout(JEST_ASSERT_WAITING_RESPONSE_TIMEOUT);

beforeAll((done) => {
    startSetupDataProcess(() => {
        console.log("done setup db");
        processStartService = startServiceProcess(() => {
            setTimeout(() => {
                console.log("start tests");
                done();
            }, 15000);
        });
    });
});

afterAll(() => {
    processStartService.stdin.pause();
    processStartService.kill();
});


signinTest();
ingameTest();
settleTest();
