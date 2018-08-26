// when new channel button is clicked, create new channel
document.querySelector("#create-newchannel").addEventListener('click', createNewChannel);

// function for new channel button clicked
function createNewChannel() {

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

const sendForm = (route, object) => {
    // create form to send to server via post
    let form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", route);

    // create input and append to form
    let input = document.createElement("input");
    input.setAttribute("type", "hidden");
    let key = Object.keys(object)[0];
    input.setAttribute("name", key);
    input.setAttribute("value", object[key]);
    form.appendChild(input)

    // send form to server
    document.body.appendChild(form);
    form.submit();
}