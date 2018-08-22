import os

from flask import Flask, render_template, session, request, redirect
from flask_socketio import SocketIO, emit
from flask_session import Session

app = Flask(__name__)
app.config["SECRET_KEY"] = 'Web50'
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Store channels
channels = []


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

    # Store display name from session
    display_name = session.get("display_name")

    return render_template("channel.html", display_name=display_name)


@app.route("/signin", methods=["POST"])
def signin():
    """ First time users are directed to this route
        to sign in via display name and remembered via session """

    # Javascript에서 input 제대로 주어졌는지 확인하기

    # Store display name via session
    session["display_name"] = request.form.get("displayname")

    # Redirect to channel
    return redirect("/channel")