"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const serviceJsonStr = core.getInput('serviceJsonStr');
        const serviceJsonFilePath = core.getInput('serviceJsonFilePath');
        const languageField = core.getInput('languageTypeField');
        const languageVersionField = core.getInput('languageVersionField');
        // Get service information
        let serviceJsonStrNew = serviceJsonStr;
        if (serviceJsonStrNew === '') {
            serviceJsonStrNew = fs.readFileSync(serviceJsonFilePath, 'utf-8');
        }
        const serviceObject = JSON.parse(serviceJsonStrNew);
        const languageEnvArray = [];
        // Extract language version information from service
        for (const index in serviceObject) {
            let languageType = serviceObject[index][languageField];
            let languageVersion = serviceObject[index][languageVersionField];
            if (languageType === undefined) {
                languageType = '';
            }
            if (languageVersion === undefined) {
                languageVersion = '';
            }
            const languageStr = languageType.concat('/', languageVersion);
            languageEnvArray.push(languageStr);
        }
        // Array deduplication
        const result = Array.from(new Set(languageEnvArray));
        console.log(result);
        // Set outputs for other workflow steps to use
        core.setOutput('languageEnv', result);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;
//# sourceMappingURL=main.js.map