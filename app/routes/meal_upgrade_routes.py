from flask import Blueprint, jsonify, request, current_app
from ..models import db, MealUpgrade, MenuItem

meal_upgrade = Blueprint("meal_upgrade", __name__)


@meal_upgrade.route("/add", methods=["POST"])
def add_meal_upgrade():
    try:
        data = request.json
        menu_item_id = data.get("menu_item_id")
        drink_item_id = data.get("drink_item_id")
        side_item_id = data.get("side_item_id")
        custom_drink_price = data.get("custom_drink_price")
        custom_side_price = data.get("custom_side_price")
        if not menu_item_id:
            return jsonify({"error": "Menu item id is required"}), 400
        # Optionally, you can validate that the drink_item_id belongs to the Drinks main group,
        # and that the side_item_id belongs to the Sides main group.
        new_upgrade = MealUpgrade(
            menu_item_id=menu_item_id,
            drink_item_id=drink_item_id,
            side_item_id=side_item_id,
            custom_drink_price=custom_drink_price,
            custom_side_price=custom_side_price,
        )
        db.session.add(new_upgrade)
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "Meal upgrade option added successfully",
                    "id": new_upgrade.id,
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding meal upgrade: {e}")
        return jsonify({"error": "Internal server error"}), 500


@meal_upgrade.route("/delete/<int:id>", methods=["DELETE"])
def delete_meal_upgrade(id):
    try:
        upgrade = MealUpgrade.query.get(id)
        if not upgrade:
            return jsonify({"error": "Meal upgrade option not found"}), 404
        db.session.delete(upgrade)
        db.session.commit()
        return jsonify({"message": "Meal upgrade option deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting meal upgrade: {e}")
        return jsonify({"error": "Internal server error"}), 500
