from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class MainGroup(db.Model):
    __tablename__ = "main_groups"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    subgroups = db.relationship(
        "SubGroup", backref="main_group", cascade="all, delete-orphan", lazy=True
    )


class SubGroup(db.Model):
    __tablename__ = "subgroups"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    main_group_id = db.Column(
        db.Integer, db.ForeignKey("main_groups.id"), nullable=False
    )
    menu_items = db.relationship(
        "MenuItem", backref="subgroup", cascade="all, delete-orphan", lazy=True
    )


class MenuItem(db.Model):
    __tablename__ = "menu_items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    sub_group_id = db.Column(db.Integer, db.ForeignKey("subgroups.id"), nullable=False)
    # New columns for meal upgrade option
    upgradable = db.Column(db.Boolean, default=False, nullable=False)
    upgrade_drink_price = db.Column(db.Float, nullable=True)
    upgrade_side_price = db.Column(db.Float, nullable=True)
    addons = db.relationship(
        "AddOn", backref="menu_item", cascade="all, delete-orphan", lazy=True
    )


class AddOn(db.Model):
    __tablename__ = "addons"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=False)


# New model for Meal Upgrade Options
class MealUpgrade(db.Model):
    __tablename__ = "meal_upgrades"
    id = db.Column(db.Integer, primary_key=True)
    # The menu item that can be upgraded (e.g. Burger)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=False)
    # The chosen drink from the Drinks main group
    drink_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=True)
    # The chosen side from the Sides main group
    side_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=True)
    # Custom prices for the upgrade (when used in a meal)
    custom_drink_price = db.Column(db.Float, nullable=True)
    custom_side_price = db.Column(db.Float, nullable=True)
