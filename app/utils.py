import sqlite3
from flask import current_app


def get_all_categories():
    """
    Fetch all categories from the database.
    """
    db = sqlite3.connect(current_app.config["DATABASE"])
    db.row_factory = sqlite3.Row
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    db.close()
    return categories


def get_menu_items_by_category(category_id):
    """
    Fetch all menu items for a specific category.
    """
    db = sqlite3.connect(current_app.config["DATABASE"])
    db.row_factory = sqlite3.Row
    cursor = db.cursor()
    cursor.execute("SELECT * FROM menu WHERE category_id = ?", (category_id,))
    items = cursor.fetchall()
    db.close()
    return items


def log_event(message):
    """
    Log application events for debugging and auditing purposes.
    """
    current_app.logger.info(message)
