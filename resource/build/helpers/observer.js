class Observer {
    constructor() {
        this.queue = {};
    }
    on(eventName, callback) {
        if (!this.queue[eventName]){
            this.queue[eventName] = [];
        }
        this.queue[eventName].push(callback);
    }
    off(eventName) {
        this.queue[eventName] = null;
    }
    trigger(eventName, data){
        if (!this.queue[eventName]){
            return;
        }
        this.queue[eventName].forEach((callback) => {
            callback(data);
        })
    }
}
module.exports = Observer;