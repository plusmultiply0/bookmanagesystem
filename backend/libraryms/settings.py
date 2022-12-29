import os

from libraryms import app

SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL')

JWT_SECRET_KEY="super-secret"
