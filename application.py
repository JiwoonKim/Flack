import os

from flask import Flask, render_template, session, request, redirect, jsonify
from flask_socketio import SocketIO, emit
from flask_session import Session

from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = 'Web50'
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Store channels globally as a dict
# (instead of sessions so that multiple users can access them)
channels = {}

@app.route("/")
def index():
    """ Default route for signing in to Flack
        User is prompted for display name and remembered via session """

    # If first time user, redirect to sign in
    if session.get("display_name") is None:
        return render_template("index.html")

    # If diplay name already exists, redirect to channel page
    else:
        return redirect("/channel")


@app.route("/channel")
def channel():
    """ Channel list displayed
        Most recent channel and recent messages are displayed
        User may create a new channel or send a new message to all """

    # Retrieve display name from session
    display_name = session.get("display_name")

    # Retrieve channels from session
    channels_list = channels

    # Retrieve current channel from session
    if not channels:
        session["current"] = "No channels"
    current = session["current"]

    return render_template("channel.html", display_name=display_name, channels=channels_list, current=current)


@app.route("/changechannel", methods=["POST"])
def changechannnel():
    """ User clicked on a channel list and thus, client has sent ajax request
        (used ajax instead of just a post request so that the sidebar on channel.html has no need to reload """

    # Store the channel name
    channel = request.form.get("channel")

    # Update the current channel in session
    session["current"] = channel

    # If channel does not exist, return error message
    if channel not in channels:
        return jsonify({"success": False})

    # else, return messages for the channel
    else:
        messages = list(channels[channel])
        return jsonify({"success": True, "messages": messages})


@app.route("/deletechannels")
def deleteChannel():
    """ Created delete channels route to delete all channels if needed => temporary function """

    channels = {}
    return redirect("/")


@app.route("/newchannel", methods=["POST"])
def newChannel():
    """ User has clicked button to add new channel
        and inputted a new channel's name """

    # Retrieve new channel name from form
    name = request.form.get("channel-name")

    # Ensure channel name is unique in javascript

    # Create empty deque for channel to store messages
    channel = deque([])

    # Add new channel to session
    channels[name] = channel

    # Update current channel to new channel
    session["current"] = name

    return redirect("/channel")


@socketio.on("send message")
def newMessage(data):
    """ Broadcast the send message event to all user whenever a new message is submitted """

    # Retrieve current channel from session
    current = session["current"]

    # store message into current channels storage (pop oldest message if over 100)
    if len(channels[current]) >= 100:
        channels[current].popleft()
    channels[current].append(data)

    # broadcast the new message to the channel for everyone to see
    emit("new message", data, braodcast=True)


@app.route("/signin", methods=["POST"])
def signin():
    """ Users are directed to this route to sign in with a display name
        Display name will be remembered via session """

    # Javascript에서 input 제대로 주어졌는지 확인하기

    # Store display name via session
    session["display_name"] = request.form.get("displayname")

    # Initialize current channel to no channesl
    session["current"] ="No channels"

    # Redirect to channel
    return redirect("/channel")


@app.route("/signout")
def signout():
    """ Sign out """

    # Forget any user_id
    session.clear()

    # Redirect to sign in page
    return redirect("/")