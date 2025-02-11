from .main_group_routes import main_group
from .subgroup_routes import subgroup
from .menu_item_routes import menu_item
from .addon_routes import addon
from .structure_routes import structure
from .order_routes import order
from .menu_render_routes import menu
from .meal_upgrade_routes import meal_upgrade  # New blueprint for meal upgrades


def register_routes(app):
    app.register_blueprint(order)  # Root blueprint for `/`
    app.register_blueprint(main_group, url_prefix="/main_group")
    app.register_blueprint(subgroup, url_prefix="/subgroup")
    app.register_blueprint(menu_item, url_prefix="/menu_item")
    app.register_blueprint(addon, url_prefix="/addon")
    app.register_blueprint(structure, url_prefix="/structure")
    app.register_blueprint(menu, url_prefix="/menu")
    app.register_blueprint(meal_upgrade, url_prefix="/meal_upgrade")
