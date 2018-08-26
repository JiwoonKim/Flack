import os

from flask import Flask, render_template, session, request, redirect
from flask_socketio import SocketIO, emit
from flask_session import Session

from helpers import Message
from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = 'Web50'
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


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
    if session.get("channels") is None:
        session["channels"] = {}
    channels = session["channels"]

    # Retrieve current channel from session
    if not session.get("channels"):
        session["current_channel"] = "no channels"
    current = session["current_channel"]

    return render_template("channel.html", display_name=display_name, channels=channels, current=current)


@app.route("/deletechannels")
def deleteChannel():
    """ Created delete channels route to delete all channels if needed => temporary function """

    del session["channels"]
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
    session["channels"][name] = channel

    # Update current channel to new channel
    session["current_channel"] = name

    return redirect("/channel")


@app.route("/signin", methods=["POST"])
def signin():
    """ Users are directed to this route to sign in with a display name
        Display name will be remembered via session """

    # Javascript에서 input 제대로 주어졌는지 확인하기

    # Store display name via session
    session["display_name"] = request.form.get("displayname")

    # Redirect to channel
    return redirect("/channel")


@app.route("/signout")
def signout():
    """ Sign out """

    # Forget any user_id
    session.clear()

    # Redirect to sign in page
    return redirect("/")