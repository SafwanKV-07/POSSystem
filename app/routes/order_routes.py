from flask import Blueprint, render_template

order = Blueprint("order", __name__)


@order.route("/", endpoint="home")
def home():
    return render_template("home.html")


@order.route("/manage_order")
def manage_order():
    return render_template("manage_order.html")
