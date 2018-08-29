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
    form.appendChild(input);

    // send form to server
    document.body.appendChild(form);
    form.submit();
};

// function to create new message and display it
const displayMessage = data => {

    // create div element for row
    const row = document.createElement('div');
    row.classList.add("row", "message-row");

    // create elements for left side of message and append them
    const ml = document.createElement('div');
    ml.classList.add("message-left", "d-inline-block");
    row.appendChild(ml);
    const a = document.createElement('div');
    a.classList.add("message-alphabet");
    a.textContent = data.name[0].toUpperCase();
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
    const span = document.createElement('span');
    span.classList.add("message-timestamp");
    span.textContent = data.timstamp;

    // finally, append the row to the content middle
    document.querySelector("#content-middle").appendChild(row);
};

// function to display error message when creating new channel
const error_message = (input, message) => {
    let error = document.createElement('p');
    error.textContent = message;
    error.style.color = "red";
    document.querySelector(".modal-body").appendChild(error);
    input.value = "";
};

// function to check duplicate matchings of channel names
const matching = (channel_nodes, new_channel) => {
    let match = false;
    channel_nodes.forEach(channel => {
        if (channel.textContent === new_channel) {
            match = true;
        }
    });
    return match;
};

// when document is loaded
document.addEventListener('DOMContentLoaded', () => {

    // when new channel button (access via plus button to modal) is clicked, create new channel
    document.querySelector("#create-newchannel").addEventListener('click', () => {

        // get input for new channel name
        let channel_input = document.querySelector("#newname");
        let new_name = channel_input.value;

        // ensure input for new channel name is submitted
        if (new_name.length === 0) {
            error_message(channel_input, "Enter new channel name");
        }
        // check if name already exists via matching function
        else if (matching(document.querySelectorAll(".nav-link"), `#${new_name}`)) {
            error_message(channel_input, "Channel already exists");
        }
        // if all is well, send form to server via POST
        else {
            sendForm("/newchannel", {"channel-name": new_name});
        }
    });
    // add event listener to all channel links in the sidebar
    document.querySelectorAll(".nav-link").forEach(channel => {

        // when a certain channel link is clicked
        channel.onclick = () => {

            // remove previously highlighted channel and highlight new channel clicked
            document.querySelector(".highlight").classList.remove("highlight");
            channel.classList.add("highlight");

            // change the channel head in contents
            document.querySelector("#current-channel").textContent = channel.textContent;

            // initialize new ajax request
            const request = new XMLHttpRequest();
            request.open('POST', '/changechannel');

            // predefine callback function for when the request completes
            request.onload = () => {

                // parse data of messages
                const data = JSON.parse(request.responseText);

                // first clear the content middle
                document.querySelector("#content-middle").textContent = "";

                // if data is successful, loop over messages to diplay in the content-middle
                if (data.success) {
                    data.messages.forEach(message => {
                        displayMessage(message);
                    });
                }
                // else, display error message in content middle
                else {
                    document.querySelector("#content-middle").textContent = "Error";
                }
            };

            // send ajax request to server with new selected channel as data
            const data = new FormData();
            let new_channel = channel.textContent.substring(1);
            data.append('channel', new_channel);
            request.send(data);
            return false;
        };
    });
    // create socket to allow real-time communication between client and server
    let socket = io.connect(`${location.protocol}//${document.domain}:${location.port}`);

    // when socket is connected
    socket.on('connect', () => {

        // when the plus button to submit new message is clicked
        document.querySelector(".plus-button").onclick = () => {

            // if there is no channel or no text in textarea, display error message
            const textbox = document.querySelector("#new-message");
            const current = document.querySelector("#current-channel").textContent;
            if (current === "No channels") {
                textbox.placeholder = "Must create channel first!";
                textbox.value = "";
            }
            else if (textbox.value === "") {
                textbox.placeholder = "Must enter message to submit!";
            }
            // if the requirements are satisfied,
            else {
                // store the necessary information
                const channel = document.querySelector("#current-channel").textContent.substring(1);
                const name = document.querySelector(".navbar-brand").textContent;
                const text = textbox.value;
                const timestamp = new Date().toString().substring(0, 15);

                // emit message event to server with data
                socket.emit('send message', {'channel': channel, 'message':{'name': name, 'text': text, 'timestamp': timestamp}});
                textbox.value = "";
            }
        };
    });
    // when new message event is emitted,
    socket.on('new message', data => {

        // display the new message on page
        displayMessage(data.message);

        // find the current channel label in sidebar and update the number of messages
        document.querySelectorAll(".nav-link").forEach(channel => {
            if (channel.textContent.substring(1) === data.current) {
                channel.parentElement.children[1].textContent = data.size;
            }
        });
    });
});