"""Flask app for Cupcakes"""
from flask import Flask, render_template, flash, redirect, sessions, request, jsonify
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///cupcakes"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = False
app.config['SECRET_KEY'] = "abcdef"

connect_db(app)
db.create_all()

@app.route("/")
def home():
    """Home page"""
    return render_template("index.html")

@app.route("/api/cupcakes", methods=["GET"])
def all_cupcakes():
    """ Get list of cupcakes from database """
    cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes = cupcakes)

@app.route("/api/cupcakes/<int:id>", methods=["GET"])
def get_cupcake(id):
    """ Get specified cupcake from the database"""
    cupcake = Cupcake.query.get_or_404(id).serialize()
    return jsonify(cupcake = cupcake)

@app.route("/api/cupcakes", methods=["POST"])
def create_cupcake():
    """ Create and add cupcake to database"""
    new_cupcake = Cupcake(flavor = request.json["flavor"], size = request.json["size"], rating = request.json["rating"])
    new_cupcake.image = request.json.get("image", new_cupcake.image)

    db.session.add(new_cupcake)
    db.session.commit()

    resp = jsonify(cupcake = new_cupcake.serialize())
    return (resp, 201)

@app.route("/api/cupcakes/<int:id>", methods=["PATCH"])
def edit_cupcake(id):
    """ Edit specified cupcake in database """
    cupcake = Cupcake.query.get_or_404(id)
    cupcake.flavor = request.json.get("flavor", cupcake.flavor)
    cupcake.size = request.json.get("size", cupcake.size)
    cupcake.rating = request.json.get("rating", cupcake.rating)
    cupcake.image = request.json.get("image", cupcake.image)

    db.session.add(cupcake)
    db.session.commit()

    return jsonify(cupcake = cupcake.serialize())

@app.route("/api/cupcakes/<int:id>", methods=["DELETE"])
def delete_cupcake(id):
    """ Delete cupcake from database """
    cupcake = Cupcake.query.get_or_404(id)

    db.session.delete(cupcake)
    db.session.commit()

    return {"message": "Deleted"}