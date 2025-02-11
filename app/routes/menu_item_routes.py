from flask import Blueprint, jsonify, request, current_app
from ..models import db, MenuItem, SubGroup

menu_item = Blueprint("menu_item", __name__)


@menu_item.route("/add", methods=["POST"])
def add_menu_item():
    try:
        data = request.json
        name = data.get("name", "").strip()
        price = data.get("price")
        sub_group_id = data.get("sub_group_id")
        upgradable = data.get("upgradable", False)
        upgrade_drink_price = data.get("upgrade_drink_price")
        upgrade_side_price = data.get("upgrade_side_price")
        if not name or price is None or not sub_group_id:
            return jsonify({"error": "Name, price and subgroup id are required"}), 400
        if not SubGroup.query.get(sub_group_id):
            return jsonify({"error": "Subgroup not found"}), 404
        new_item = MenuItem(
            name=name,
            price=price,
            sub_group_id=sub_group_id,
            upgradable=upgradable,
            upgrade_drink_price=upgrade_drink_price,
            upgrade_side_price=upgrade_side_price,
        )
        db.session.add(new_item)
        db.session.commit()
        return (
            jsonify({"message": "Menu item added successfully", "id": new_item.id}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding menu item: {e}")
        return jsonify({"error": "Internal server error"}), 500


@menu_item.route("/update/<int:id>", methods=["PUT"])
def update_menu_item(id):
    try:
        data = request.json
        name = data.get("name", "").strip()
        price = data.get("price")
        sub_group_id = data.get("sub_group_id")
        if not name or price is None or not sub_group_id:
            return jsonify({"error": "Name, price and subgroup id are required"}), 400
        item = MenuItem.query.get(id)
        if not item:
            return jsonify({"error": "Menu item not found"}), 404
        item.name = name
        item.price = price
        item.sub_group_id = sub_group_id
        db.session.commit()
        return jsonify({"message": "Menu item updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating menu item: {e}")
        return jsonify({"error": "Internal server error"}), 500


@menu_item.route("/delete/<int:id>", methods=["DELETE"])
def delete_menu_item(id):
    try:
        item = MenuItem.query.get(id)
        if not item:
            return jsonify({"error": "Menu item not found"}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Menu item deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting menu item: {e}")
        return jsonify({"error": "Internal server error"}), 500
