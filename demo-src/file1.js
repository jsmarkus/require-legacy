function addMessage(msg) {
    var tag = document.createElement('DIV');
    tag.innerHTML = msg;
    document.body.appendChild(tag);
}


addMessage('Hello! I am file1.js!');