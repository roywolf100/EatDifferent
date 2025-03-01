import os
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)   

current_user = "guest"
#למחוק את הרשימות
users = ['roys', 'itamar', 'hello']
passwords = ['1qaQ!Q', '123', 'hello123']
#ליצור טבלה

redirect_page = False

@app.route("/")
def home():
   return render_template('index.html', current_user=current_user)

@app.route("/signup",  methods=['GET', 'POST'])
def signup():
      if request.method == 'POST':
             username = request.form['username']
             password = request.form['password']
             if username not in users: #לבדוק בבסיס נתונים ולא ברשימות
                  users.append(username) #להוסיף לבסיס נתונים במקום לרשימות
                  passwords.append(password)
                  return redirect(url_for("login"))
      return render_template("signup.html", current_user=current_user)

@app.route("/usercheck",  methods=['GET', 'POST'])
def usercheck():
   global users, current_user, passwords
   error_message = ""
   data = request.get_json()
   username = data.get('username')

   if username not in users:
      return jsonify(False)
   else: 
      return jsonify(True)


@app.route("/login", methods=['GET', 'POST']) 
def login():
   global passwords, users, current_user
   error_message = ""
   if request.method == 'POST':
      user = request.form['username']
      password = request.form['password']
      if user in users and password in passwords[users.index(user)]: #לבדוק בבסיס נתונים
         current_user = user
         return redirect(url_for("dashboard"))
      else:
         error_message = "Username or Password are incorrect"
      
   return render_template('login.html', current_user=current_user, error_message=error_message)

@app.route("/dashboard") 
def dashboard():
      global current_user
      if current_user != "guest":
         return render_template('dashboard.html', current_user=current_user)
      else:
          return render_template('access-denied.html', current_user=current_user)

def main():
   app.run(port=int(os.environ.get('PORT', 5080)))

@app.route("/start_journey")
def start_journey():
    global current_user
    if current_user == "guest":
        return redirect(url_for("login"))
    else:
        return redirect(url_for("dashboard"))

@app.route("/logout")
def logout():
   global current_user
   current_user = "guest"
   return redirect(url_for("home"))

if __name__ == "__main__":
   main()

