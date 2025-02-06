from flask import Blueprint, jsonify, request, current_app
from ..models import db, SubGroup, MainGroup

subgroup = Blueprint("subgroup", __name__)


@subgroup.route("/add", methods=["POST"])
def add_subgroup():
    try:
        data = request.json
        name = data.get("name", "").strip()
        main_group_id = data.get("main_group_id")
        if not name or not main_group_id:
            return (
                jsonify({"error": "Subgroup name and main group id are required"}),
                400,
            )
        if not MainGroup.query.get(main_group_id):
            return jsonify({"error": "Main group not found"}), 404
        new_subgroup = SubGroup(name=name, main_group_id=main_group_id)
        db.session.add(new_subgroup)
        db.session.commit()
        return (
            jsonify({"message": "Subgroup added successfully", "id": new_subgroup.id}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding subgroup: {e}")
        return jsonify({"error": "Internal server error"}), 500


@subgroup.route("/update/<int:id>", methods=["PUT"])
def update_subgroup(id):
    try:
        data = request.json
        name = data.get("name", "").strip()
        if not name:
            return jsonify({"error": "Subgroup name is required"}), 400
        sg = SubGroup.query.get(id)
        if not sg:
            return jsonify({"error": "Subgroup not found"}), 404
        sg.name = name
        db.session.commit()
        return jsonify({"message": "Subgroup updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating subgroup: {e}")
        return jsonify({"error": "Internal server error"}), 500


@subgroup.route("/delete/<int:id>", methods=["DELETE"])
def delete_subgroup(id):
    try:
        sg = SubGroup.query.get(id)
        if not sg:
            return jsonify({"error": "Subgroup not found"}), 404
        db.session.delete(sg)
        db.session.commit()
        return jsonify({"message": "Subgroup deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting subgroup: {e}")
        return jsonify({"error": "Internal server error"}), 500
