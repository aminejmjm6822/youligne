from datetime import date
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from . import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    bookings = db.relationship(
        "Booking", backref="user", lazy="dynamic", cascade="all, delete-orphan"
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(120), nullable=False)
    model = db.Column(db.String(120), nullable=False)
    daily_price = db.Column(db.Float, nullable=False)
    seats = db.Column(db.Integer, default=5, nullable=False)
    transmission = db.Column(db.String(30), default="Manual")
    image_url = db.Column(db.String(1024))
    bookings = db.relationship(
        "Booking", backref="car", lazy="dynamic", cascade="all, delete-orphan"
    )

    @property
    def name(self) -> str:
        return f"{self.brand} {self.model}"


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey("car.id"), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default="confirmed", nullable=False)

    def overlaps(self, start: date, end: date) -> bool:
        return not (end < self.start_date or start > self.end_date)