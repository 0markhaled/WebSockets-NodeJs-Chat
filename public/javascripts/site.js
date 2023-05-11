
import WebSocketService from '/javascripts/ws.js';
const wsService = new WebSocketService();

const msgEl = document.getElementById("messages");
const textEl = document.getElementById("message");

wsService.onmessage = (data) => {

    let prefix = "";
    if (data.time != null) {
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const dt = new Date(data.time);
        prefix += `[${dt.toLocaleString("en-CA", options)}]`;
    }

    if (data.sender != null) {
        prefix += `[${data.sender}] `;
    }



    msgEl.innerHTML += `<div class="chat_message other">${prefix} ${data.data}</div>`;
    scrollBottom();
}

let reqSendMsg = () => {
    wsService.sendMessage(textEl.value);
    msgEl.innerHTML += `<div class="chat_message me">${textEl.value}</div>`;
    textEl.value = "";
    scrollBottom();
}

textEl.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        reqSendMsg();
    }
});

document.getElementById("send").addEventListener("click", () => {
    reqSendMsg();
});

let scrollBottom = () => {
    msgEl.scrollTop = msgEl.scrollHeight;
}