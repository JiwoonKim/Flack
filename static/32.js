// function for new channel button clicked
const createNewChannel = () => {

    // get input for new channel name
    let channel_input = document.querySelector("#newname");
    let new_name = channel_input.value;

    // ensure input for new channel name is submitted
    if (new_name.length === 0) {
        let error = document.createElement('p');
        error.textContent = "\nEnter new channel name";
        error.style.color = "red";
        document.querySelector(".modal-body").appendChild(error);
        channel_input.value = "";
    }
    else {
        // check if name already exists

        // send form to server via POST
        sendForm("/newchannel", {"channel-name": new_name});
    }
}

// function to send form with data via post
const sendForm = (route, object) => {

    // create form to send to server via post
    let form = document.createElement('form');
    form.setAttribute("method", "post");
    form.setAttribute("action", route);

    // create input and append to form
    let input = document.createElement('input');
    input.setAttribute("type", "hidden");
    let key = Object.keys(object)[0];
    input.setAttribute("name", key);
    input.setAttribute("value", object[key]);
    form.appendChild(input)

    // send form to server
    document.body.appendChild(form);
    form.submit();
}

// function to create new message and display it
const displayNewMessage = data => {

    // create div element for row
    const row = document.createElement('div');
    row.classList.add("row", "message-row")

    // create elements for left side of message and append them
    const ml = document.createElement('div');
    ml.classList.add("message-left", "d-inline-block");
    row.appendChild(ml);
    const a = document.createElement('div');
    a.classList.add("message-alphabet");
    a.textContent = data.name[0].toUpperCase();;
    ml.appendChild(a);

    // create elements for right side of message and append them
    const mr = document.createElement('div');
    mr.classList.add("message-right", "d-inline-block");
    row.appendChild(mr);
    const h5 = document.createElement('h5');
    h5.classList.add("message-name");
    h5.textContent = data.name;
    mr.appendChild(h5);
    const p = document.createElement('p');
    p.classList.add("message-text");
    p.textContent = data.text;
    mr.appendChild(p);

    // finally, append the row to the content middle
    document.querySelector("#content-middle").appendChild(row);

    // update the message number next to channel
    let num = document.querySelector(".message-num");
    num.textContent = parseInt(num.textContent) + 1;
}

// when document is loaded
document.addEventListener('DOMContentLoaded', () => {

    // when new channel button (access via plus button to modal) is clicked, create new channel
    document.querySelector("#create-newchannel").addEventListener('click', createNewChannel);

    // when a channel is clicked, change the active component



    // create socket to allow real-time communication to send and display new messages
    let socket = io.connect(`${location.protocol}//${document.domain}:${location.port}`);

    // when socket is connected
    socket.on('connect', () => {

        // when the plus button to submit new message is clicked
        document.querySelector(".plus-button").onclick = () => {

            // store the necessary information
            const name = document.querySelector(".navbar-brand").textContent;
            const text = document.querySelector("#new-message").value;
            const timestamp = new Date().toLocaleString()

            // emit send message event to server with data
            socket.emit('send message', {'name': name, 'text': text, 'timestamp': timestamp})
        }
    });

    // when new message event is emitted, display the new message on page
    socket.on('new message', data => displayNewMessage(data));
});
