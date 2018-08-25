// when new channel button is clicked, create new channel
document.querySelector("#create-newchannel").addEventListener('clicked', createNewChannel);

// function for new channel button clicked
function createNewChannel() {

    // get input for new channel name
    let channel_input = document.querySelector("#newname");
    console.log(channel_input);
    let new_name = channel_input.value;
    console.log(new_name);

    // ensure input for new channel name is submitted
    if (new_name.length === 0) {
        console.log("not submitted");
        let error = document.createElement('p');
        error.textContent = "Must enter new channel name";
        error.style.color = "red";
        document.querySelector(".modal-body").append(error);
        channel_input.value = "";
    }
    else {
        // check if name already exists

        // create form to send to server via post
        console.log("sending to server");
        let form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", "/newchannel");

        // create input and append to form
        let input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "channel-name");
        input.setAttribute("value", new_name);
        form.appendChile(input)

        // send form to server
        document.body.appendChild(form);
        form.submit();
    }
}
