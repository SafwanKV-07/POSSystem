from flask import Blueprint, jsonify, current_app
from ..models import MainGroup

structure = Blueprint("structure", __name__)


@structure.route("/menu/get_structure", methods=["GET"])
def get_structure():
    try:
        groups = MainGroup.query.all()
        structure_data = []
        for group in groups:
            group_data = {"id": group.id, "name": group.name, "subgroups": []}
            for subgroup in group.subgroups:
                subgroup_data = {
                    "id": subgroup.id,
                    "name": subgroup.name,
                    "menu_items": [],
                }
                for item in subgroup.menu_items:
                    item_data = {
                        "id": item.id,
                        "name": item.name,
                        "price": item.price,
                        "addons": [],
                    }
                    for addon in item.addons:
                        item_data["addons"].append(
                            {"id": addon.id, "name": addon.name, "price": addon.price}
                        )
                    subgroup_data["menu_items"].append(item_data)
                group_data["subgroups"].append(subgroup_data)
            structure_data.append(group_data)
        return jsonify(structure_data)
    except Exception as e:
        current_app.logger.error(f"Error fetching structure: {e}")
        return jsonify({"error": "Internal server error"}), 500
