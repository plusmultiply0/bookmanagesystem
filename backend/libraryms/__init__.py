from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

app=Flask('libraryms',template_folder="../templates",static_folder="../static")

app.config.from_pyfile('settings.py')

cors = CORS(app)
db=SQLAlchemy(app)
jwt = JWTManager()

jwt.init_app(app)

from libraryms import views,commands
