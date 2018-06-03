const Story = require('./story_interpreter.js');
const {readFileSync} = require('fs');
const _ = require('lodash');

var story_data = readFileSync('./testRedirects.json');
story_data = JSON.parse(story_data);

function TestTrueTrue(callback) {
    const story = new Story(story_data);
    story.variables.haveCar = true;
    story.variables.carWorks = true;
    let data = null;
    story.Subscribe(node => {
        data = node;
    })
    story.Start();

    let start = {
        "data": {
            "text": "Hey, do you think you could give me a ride?",
            "response_text": "Oh..."
        },
        "redirect": {
            "node_name": "yes",
            "conditions": [
                {
                    "variable": "haveCar",
                    "operator": "=",
                    "value": true
                },
                {
                    "variable": "carWorks",
                    "operator": "=",
                    "value": true
                }
            ]
        }
    }

    if(data === null) {
        callback(false, "Failed case: haveCar = true, carWorks = true", "Subscriber callback not called")
        return;
    }

    if(_.isEqual(data, start)) {
        callback(true, "Passed case: haveCar = true, carWorks = true");
    } else {
        callback(false, "Failed case: haveCar = true, carWorks = true", "Invalid return.");
    }
}

function TestTrueFalse(callback) {
    const story = new Story(story_data);
    story.variables.haveCar = true;
    story.variables.carWorks = false;
    let data = null;
    story.Subscribe(node => {
        data = node
    })

    let start = {
        "data": {
            "text": "Hey, do you think you could give me a ride?",
            "response_text": "Oh..."
        },
        "redirect": {
            "node_name": "not_working",
            "conditions": [
                {
                    "variable": "haveCar",
                    "operator": "=",
                    "value": true
                },
                {
                    "variable": "carWorks",
                    "operator": "!=",
                    "value": true
                }
            ]
        }
    }
    story.Start();
    if(data === null) {
        callback(false, "Failed case: haveCar = true, carWorks = false", "Subscriber callback not called");
        return;
    }

    if(_.isEqual(data, start)) {
        callback(true, "Passed case: haveCar = true, carWorks = false");
    } else {
        callback(false, "Failed case: haveCar = true, carWorks = false", "Invalid return.");
    }
    
}

function TestFalse(callback) {
    const story = new Story(story_data);
    story.variables.haveCar = false;
    let data = null;;
    story.Subscribe(node => {
        let data = node;
    })
    story.Start();

    let start = {
        "data": {
            "text": "Hey, do you think you could give me a ride?",
            "response_text": "Oh..."
        },
        "redirect": {
            "node_name": "no_car",
            "conditions": [
                {
                    "variable": "haveCar",
                    "operator": "!=",
                    "value": true
                }
            ]
        }
    }

    if(data === null) {
        callback(false, "Failed case: haveCar = false", "Subscriber callback not called.");
        return;
    } 

    if(_.isEqual(data, start)) {
        callback(true, "Passed case: haveCar = false");
    } else {
        callback(false, "Failed case: haveCar = false");
    }
}


function RunTests(...tests) {
    let index = 0;
    let passedTests = 0;
    let failedTests = 0;
    function Test(result, message, error) {
        if(result) {
            passedTests++;
            console.log("\x1b[32m", message);
        } else {
            failedTests++;
            console.log("\x1b[31m", message);
        }
        if(error) console.log("\x1b[33m", error)
        if(index < tests.length - 1) {
            index++;
            tests[index](Test);
        } else {
            console.log("\x1b[32m", "Tests passed: " + passedTests);
            if(failedTests <= 0) {
                console.log("\x1b[32m", "Tests failed: " + failedTests);
            } else {
                console.log("\x1b[31m", "Tests failed: " + failedTests);
            }
            if(passedTests === tests.length) console.log("\x1b[32m", "All tests passed!");
        }
    }
    tests[0](Test);
}

RunTests(TestTrueTrue, TestTrueFalse, TestFalse);