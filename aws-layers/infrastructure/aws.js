const SDK = require("aws-sdk");
const { StepFunctions } = SDK;
const awsConfig = require("./aws-config.json");

/**
 * @type {InstanceType<StepFunctions>}
 */
var stepFunction;
let isInitialized = false;

function initAwsConfig() {
    if(!isInitialized) {
        SDK.config.update({
            accessKeyId: awsConfig["AWS_ACCESS_ID"].split("").reverse().join(""),
            secretAccessKey: awsConfig["AWS_SECRET"].split("").reverse().join(""),
            region: awsConfig["AWS_REGION"]
        });
        stepFunction = new StepFunctions();
        isInitialized = true;
    }
}


/**
 * @param {string} arn 
 * @param {string} executionId 
 * @param {string} input 
 */
async function EmitFunction(arn, executionId, input) {
    await stepFunction.startExecution({
        stateMachineArn: arn,
        name: executionId,
        input,
    }).promise()
}

/**
 * @param {string} arn 
 */
async function StopFunction(arn, va_number) {
    await stepFunction.stopExecution({
        executionArn: arn,
        cause: `va number ${va_number} updated to be success`
    }).promise();
}

initAwsConfig();
module.exports = {
    step: {
        EmitFunction,
        StopFunction,
    },
};