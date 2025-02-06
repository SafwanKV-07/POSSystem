from flask import Blueprint, jsonify, request, current_app
from ..models import db, AddOn, MenuItem

addon = Blueprint("addon", __name__)


@addon.route("/add", methods=["POST"])
def add_addon():
    try:
        data = request.json
        name = data.get("name", "").strip()
        price = data.get("price")
        menu_item_id = data.get("menu_item_id")
        if not name or price is None or not menu_item_id:
            return jsonify({"error": "Name, price and menu item id are required"}), 400
        if not MenuItem.query.get(menu_item_id):
            return jsonify({"error": "Menu item not found"}), 404
        new_addon = AddOn(name=name, price=price, menu_item_id=menu_item_id)
        db.session.add(new_addon)
        db.session.commit()
        return (
            jsonify({"message": "Add-on added successfully", "id": new_addon.id}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding add-on: {e}")
        return jsonify({"error": "Internal server error"}), 500


@addon.route("/update/<int:id>", methods=["PUT"])
def update_addon(id):
    try:
        data = request.json
        name = data.get("name", "").strip()
        price = data.get("price")
        if not name or price is None:
            return jsonify({"error": "Name and price are required"}), 400
        addon_obj = AddOn.query.get(id)
        if not addon_obj:
            return jsonify({"error": "Add-on not found"}), 404
        addon_obj.name = name
        addon_obj.price = price
        db.session.commit()
        return jsonify({"message": "Add-on updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating add-on: {e}")
        return jsonify({"error": "Internal server error"}), 500


@addon.route("/delete/<int:id>", methods=["DELETE"])
def delete_addon(id):
    try:
        addon_obj = AddOn.query.get(id)
        if not addon_obj:
            return jsonify({"error": "Add-on not found"}), 404
        db.session.delete(addon_obj)
        db.session.commit()
        return jsonify({"message": "Add-on deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting add-on: {e}")
        return jsonify({"error": "Internal server error"}), 500
