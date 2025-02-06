from flask import Blueprint, render_template

menu = Blueprint("menu", __name__)


@menu.route("/manage_menu")
def manage_menu():
    return render_template("manage_menu.html")
