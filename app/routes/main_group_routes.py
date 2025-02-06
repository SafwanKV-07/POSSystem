from flask import Blueprint, jsonify, request, current_app
from ..models import db, MainGroup

main_group = Blueprint("main_group", __name__)


@main_group.route("/add", methods=["POST"])
def add_main_group():
    try:
        data = request.json
        name = data.get("name", "").strip()
        if not name:
            return jsonify({"error": "Main group name is required"}), 400
        if MainGroup.query.filter_by(name=name).first():
            return jsonify({"error": "Main group already exists"}), 400
        new_group = MainGroup(name=name)
        db.session.add(new_group)
        db.session.commit()
        return (
            jsonify({"message": "Main group added successfully", "id": new_group.id}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding main group: {e}")
        return jsonify({"error": "Internal server error"}), 500


@main_group.route("/update/<int:id>", methods=["PUT"])
def update_main_group(id):
    try:
        data = request.json
        name = data.get("name", "").strip()
        if not name:
            return jsonify({"error": "Main group name is required"}), 400
        group = MainGroup.query.get(id)
        if not group:
            return jsonify({"error": "Main group not found"}), 404
        group.name = name
        db.session.commit()
        return jsonify({"message": "Main group updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating main group: {e}")
        return jsonify({"error": "Internal server error"}), 500


@main_group.route("/delete/<int:id>", methods=["DELETE"])
def delete_main_group(id):
    try:
        group = MainGroup.query.get(id)
        if not group:
            return jsonify({"error": "Main group not found"}), 404
        db.session.delete(group)
        db.session.commit()
        return jsonify({"message": "Main group deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting main group: {e}")
        return jsonify({"error": "Internal server error"}), 500
