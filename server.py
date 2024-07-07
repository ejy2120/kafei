from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect, flash, url_for
import json
app = Flask(__name__)

# ROUTES

@app.route('/')
def homepage():
   return render_template('homepage.html')   

@app.route("/get_cafes")
def get_cafes():
    with open("cafes.json", "r") as f:
        cafes = json.load(f)
    return jsonify(cafes)

@app.route("/search")
def search():
    query = request.args.get("query")
    
    with open("cafes.json", "r") as f:
        cafes = json.load(f)

    results = []
    for cafe in cafes:
        if (query.lower() in cafe["name"].lower()
            or query.lower() in cafe["borough"].lower()
            or any(query.lower() in amenity.lower() for amenity in cafe["amenities"])):
            results.append(cafe)

    return render_template('search.html', results=results, query=query)

@app.route("/view/<id>")
def view(id):
    # load the cafes from cafes.json
    with open("cafes.json", "r") as f:
        cafes = json.load(f)
    
    # find the cafe with id
    cafe = None
    for c in cafes:
        if c["id"] == int(id) :
            cafe = c
            break

    if cafe is None:
        return "Cafe not found", 404

    return render_template("view.html", cafe=cafe)

@app.route("/add")
def add():
    return render_template("add.html")

@app.route("/submit_data", methods=["POST"])
def submit_data():
    with open("cafes.json", "r") as f:
        data =  json.load(f)

    # find current id 
    current_id = max(cafe["id"] for cafe in data)
   
    new_cafe = {
        "id": current_id + 1, # new id
        "name": request.form["name"],
        "image1": request.form["image1"],
        "image2": request.form["image2"],
        "image3": request.form["image3"],
        "image4": request.form["image4"],
        "address": request.form["address"],
        "borough": request.form["borough"],
        "google_rating": request.form["google_rating"],
        "amenities": request.form["amenities"].split(","),
        "open_hours": request.form["open_hours"].split(","),
        "about": request.form["about"],
        "miniblurb": request.form["miniblurb"],
        "insidertips": request.form["insiderTips"]
    }

    # modifies the "data" list in memory
    data.append(new_cafe)

    # update the actual json file
    with open("cafes.json", "w") as f:
        json.dump(data, f, indent=4)

    return jsonify({"id": current_id + 1})

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    with open("cafes.json", "r") as f:
        cafes =  json.load(f)
    
    cafe = None
    for c in cafes:
        if c["id"] == id:
            cafe = c
            break

    if request.method == "POST":
        cafe["name"] = request.form["name"]
        cafe["image1"] = request.form["image1"]
        cafe["image2"] = request.form["image2"]
        cafe["image3"] = request.form["image3"]
        cafe["image4"] = request.form["image4"]
        cafe["image1alt"] = request.form["image1alt"]
        cafe["image2alt"] = request.form["image2alt"]
        cafe["image3alt"] = request.form["image3alt"]
        cafe["image4alt"] = request.form["image4alt"]
        cafe["address"] = request.form["address"]
        cafe["borough"] = request.form["borough"]
        cafe["google_rating"] = request.form["google_rating"]
        cafe["amenities"] = request.form.getlist("amenities[]") 
        cafe["open_hours"] = request.form["open_hours_input"].split("\n")  
        cafe["about"] = request.form["about"]
        cafe["insidertips"] = request.form["insidertips"]

        with open("cafes.json", "w") as f:
            json.dump(cafes, f, indent=4)

        return redirect(url_for("view", id=id))

    return render_template("edit.html", cafe=cafe)


if __name__ == '__main__':
   app.run(debug = True)




