"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1539207",
    key: "9d8edb5e61dc6badf395",
    secret: "af459072840d083b9d25",
    cluster: "ap2",
    useTLS: true,
});
pusher.trigger("my-channel", "my-event", {
    message: "hello world",
});
exports.default = pusher;
