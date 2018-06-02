module.exports = class Story {
    constructor(story_data) {
        this.variables = story_data.variables;
        this.start = story_data.start;
        this.nodes = story_data.nodes;
        this.subscribers = [];
    }

    // Subscribe is how our story object will communicate with other parts of our program. You can pass in a callback
    // function into Subscribe, and that callback function will be called whenever NextNode is called to get the
    // Next part of our dialogue.
    Subscribe(callback) {
        this.subscribers.push(callback);
    }

    // This function is used by NextNode to pass the new_node to all of the subscribers listening for information about it
    NotifySubscribers(node_data) {
        this.subscribers.forEach(subscriber => {
            subscriber(node_data);
        })
    }

    NextNode(node_name) {
        // This function will take in the name of the node, then check the conditions of that nodes redirects (if there are any)
        // To find the correct redirect, then 
    }

    MakeChoice(choice) {
        // This function will take in a choice object, then set the conditions in choice.set_conditions if they exist,
        // And call NextNode with the node_name of the choices redirect 
    }

    Start() {
        // This function will call next node with the starting node
    }
}