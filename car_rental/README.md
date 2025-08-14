# CarRental — Plateforme de location de voiture

## Lancer en local

1. Créer un virtualenv et installer les dépendances

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Variables d’environnement (optionnel)

```bash
cp .env.example .env
# puis éditez .env et changez SECRET_KEY
```

3. D démarrer l’app

```bash
python run.py
```

- Admin seedé: admin@example.com / admin123
- Base de données: `instance/car_rental.sqlite`

## Fonctionnalités
- Authentification (inscription, connexion, déconnexion)
- Listing des voitures, détail, ajout (admin)
- Réservation avec vérification des chevauchements
- Mes réservations + annulation