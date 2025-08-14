from flask import Blueprint, render_template, redirect, url_for, flash
from flask_login import login_required, current_user

from . import db
from .models import Car
from .forms import AddCarForm, BookingForm


cars_bp = Blueprint("cars", __name__, url_prefix="/cars")


@cars_bp.route("/")
def list_cars():
    cars = Car.query.order_by(Car.brand.asc(), Car.model.asc()).all()
    return render_template("cars/list.html", cars=cars)


@cars_bp.route("/<int:car_id>")
def detail(car_id: int):
    car = Car.query.get_or_404(car_id)
    form = BookingForm()
    return render_template("cars/detail.html", car=car, form=form)


@cars_bp.route("/add", methods=["GET", "POST"])
@login_required
def add():
    if not current_user.is_admin:
        flash("Accès réservé à l’administrateur.", "warning")
        return redirect(url_for("cars.list_cars"))
    form = AddCarForm()
    if form.validate_on_submit():
        car = Car(
            brand=form.brand.data.strip(),
            model=form.model.data.strip(),
            daily_price=form.daily_price.data,
            seats=form.seats.data,
            transmission=form.transmission.data.strip(),
            image_url=form.image_url.data.strip() if form.image_url.data else None,
        )
        db.session.add(car)
        db.session.commit()
        flash("Voiture ajoutée.", "success")
        return redirect(url_for("cars.list_cars"))
    return render_template("cars/add.html", form=form)