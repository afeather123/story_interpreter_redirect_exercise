const Story = require('./story_interpreter');
const {readFileSync} = require('fs');

var story_data = readFileSync('./testRedirects.json');
story_data = JSON.parse(story_data);
const story = new Story(story_data);

console.log(story.Start());