from datetime import timedelta
from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user

from . import db
from .models import Car, Booking
from .forms import BookingForm


bookings_bp = Blueprint("bookings", __name__, url_prefix="/bookings")


@bookings_bp.route("/create/<int:car_id>", methods=["POST"])
@login_required
def create(car_id: int):
    car = Car.query.get_or_404(car_id)
    form = BookingForm()
    if not form.validate_on_submit():
        flash("Dates invalides.", "danger")
        return redirect(url_for("cars.detail", car_id=car.id))

    start = form.start_date.data
    end = form.end_date.data

    if end < start:
        flash("La date de fin doit être postérieure à la date de début.", "warning")
        return redirect(url_for("cars.detail", car_id=car.id))

    # Check overlaps
    existing = Booking.query.filter_by(car_id=car.id).all()
    for b in existing:
        if not (end < b.start_date or start > b.end_date):
            flash("Cette voiture est déjà réservée sur cette période.", "danger")
            return redirect(url_for("cars.detail", car_id=car.id))

    # Compute days inclusive
    days = (end - start).days + 1
    total_price = round(days * car.daily_price, 2)

    booking = Booking(
        user_id=current_user.id,
        car_id=car.id,
        start_date=start,
        end_date=end,
        total_price=total_price,
    )
    db.session.add(booking)
    db.session.commit()

    flash("Réservation confirmée !", "success")
    return redirect(url_for("bookings.mine"))


@bookings_bp.route("/mine")
@login_required
def mine():
    my_bookings = (
        Booking.query.filter_by(user_id=current_user.id)
        .order_by(Booking.start_date.desc())
        .all()
    )
    return render_template("bookings/list.html", bookings=my_bookings)


@bookings_bp.route("/cancel/<int:booking_id>", methods=["POST"])
@login_required
def cancel(booking_id: int):
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != current_user.id and not current_user.is_admin:
        flash("Action non autorisée.", "danger")
        return redirect(url_for("bookings.mine"))
    db.session.delete(booking)
    db.session.commit()
    flash("Réservation annulée.", "info")
    return redirect(url_for("bookings.mine"))