import os
from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv


load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.login_message_category = "info"


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-secret-key"),
    )

    os.makedirs(app.instance_path, exist_ok=True)
    database_path = os.path.join(app.instance_path, "car_rental.sqlite")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{database_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    login_manager.init_app(app)

    from .models import User, Car  # noqa: F401
    from .auth import auth_bp
    from .cars import cars_bp
    from .bookings import bookings_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(cars_bp)
    app.register_blueprint(bookings_bp)

    @app.route("/")
    def home():
        return redirect(url_for("cars.list_cars"))

    @login_manager.user_loader
    def load_user(user_id):
        from .models import User
        return User.query.get(int(user_id))

    with app.app_context():
        db.create_all()
        from .models import User, Car
        if Car.query.count() == 0:
            sample_cars = [
                Car(brand="Toyota", model="Corolla", daily_price=45.0, seats=5, transmission="Automatic", image_url="https://images.unsplash.com/photo-1549921296-3ecf4a7a9b6a"),
                Car(brand="Renault", model="Clio", daily_price=40.0, seats=5, transmission="Manual", image_url="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023"),
                Car(brand="Peugeot", model="308", daily_price=50.0, seats=5, transmission="Automatic", image_url="https://images.unsplash.com/photo-1503376780353-7e6692767b70"),
            ]
            db.session.add_all(sample_cars)
            if not User.query.filter_by(email="admin@example.com").first():
                admin = User(name="Admin", email="admin@example.com", is_admin=True)
                admin.set_password("admin123")
                db.session.add(admin)
            db.session.commit()

    return app