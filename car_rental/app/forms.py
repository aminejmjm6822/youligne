from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, IntegerField, FloatField
from wtforms.fields import DateField
from wtforms.validators import DataRequired, Email, EqualTo, Length, NumberRange, URL, Optional


class RegisterForm(FlaskForm):
    name = StringField("Nom", validators=[DataRequired(), Length(min=2, max=120)])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Mot de passe", validators=[DataRequired(), Length(min=6)])
    confirm = PasswordField(
        "Confirmer le mot de passe", validators=[DataRequired(), EqualTo("password")]
    )
    submit = SubmitField("Créer le compte")


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Mot de passe", validators=[DataRequired()])
    remember = BooleanField("Se souvenir de moi")
    submit = SubmitField("Se connecter")


class AddCarForm(FlaskForm):
    brand = StringField("Marque", validators=[DataRequired(), Length(min=1, max=120)])
    model = StringField("Modèle", validators=[DataRequired(), Length(min=1, max=120)])
    daily_price = FloatField("Prix/jour (€)", validators=[DataRequired(), NumberRange(min=1)])
    seats = IntegerField("Places", validators=[DataRequired(), NumberRange(min=1, max=9)])
    transmission = StringField("Transmission", validators=[DataRequired(), Length(min=3, max=30)])
    image_url = StringField("Image URL", validators=[Optional(), URL(require_tld=False, message="URL invalide")])
    submit = SubmitField("Ajouter la voiture")


class BookingForm(FlaskForm):
    start_date = DateField("Début", validators=[DataRequired()], format="%Y-%m-%d")
    end_date = DateField("Fin", validators=[DataRequired()], format="%Y-%m-%d")
    submit = SubmitField("Réserver")