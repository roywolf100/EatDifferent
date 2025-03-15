import os, sqlite3
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)   

current_user = "guest"
is_admin = False
def user_table():
   conn = sqlite3.connect('users.db')
   c = conn.cursor()
   c.execute('''CREATE TABLE IF NOT EXISTS users
                (username TEXT UNIQUE NOT NULL,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                password TEXT NOT NULL,
                email TEXT NOT NULL,
                gender TEXT NOT NULL,
                goal TEXT NOT NULL,
                activity TEXT NOT NULL,
                height DECIMAL NOT NULL,
                weight DECIMAL NOT NULL,
                admin BOOL NOT NULL )''')
   conn.commit()
   conn.close()

user_table()

@app.route("/")
def home():
   return render_template('index.html', current_user=current_user, is_admin=is_admin)

@app.route("/signup",  methods=['GET', 'POST'])
def signup():
   if request.method == 'POST':
      username = request.form['username']
      password = request.form['password']
      email = request.form['email']
      first_name = request.form['first-name']
      last_name = request.form['last-name']
      
      height = request.form['height']
      weight = request.form['weight']
      date = request.form['date']
      
      goal = request.form['goal']
      activity_lvl = request.form['activity']
      gender = request.form['gender']


      conn = sqlite3.connect('users.db')
      c = conn.cursor()
      c.execute("SELECT username FROM users WHERE username = ?", (username,))
      user_from_table = c.fetchone()
      if user_from_table is None:
         c.execute("INSERT INTO users (username, firstname, lastname, password, email, gender, goal, activity, height, weight, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (username, first_name, last_name, password, email, gender, goal, activity_lvl, height, weight, 0))
         conn.commit()
         conn.close()
         return redirect(url_for("login"))
      
      conn.close()
   return render_template("signup.html", current_user=current_user, is_admin=is_admin)

@app.route("/usercheck",  methods=['GET', 'POST'])
def usercheck():
   global users, current_user, passwords
   error_message = ""
   data = request.get_json()
   username = data.get('username')

   conn = sqlite3.connect('users.db')
   c = conn.cursor()
   c.execute("SELECT username FROM users WHERE username = ?", (username,))
   user_from_table = c.fetchone()
   conn.close()

   if user_from_table is None:
      return jsonify(False)
   else: 
      return jsonify(True)

@app.route("/login", methods=['GET', 'POST']) 
def login():
   global current_user, is_admin
   error_message = ""
   if request.method == 'POST':
      username = request.form['username']
      password = request.form['password']

      conn = sqlite3.connect('users.db')
      c = conn.cursor()
      c.execute("SELECT password FROM users WHERE username = ?", (username,))
      password_from_table = c.fetchone()

      c.execute("SELECT admin FROM users WHERE username = ?", (username,))
      admin = c.fetchone()
      conn.close()
      if admin[0] == 1:
         is_admin = True
      else:
         is_admin = False
      
      if password_from_table is None or password != password_from_table[0]:
         error_message = "Username or Password are incorrect"
      else:
         current_user = username
         return redirect(url_for("dashboard"))
      
   return render_template('login.html', current_user=current_user, error_message=error_message, is_admin=is_admin)

@app.route("/dashboard") 
def dashboard():
      global current_user
      if current_user != "guest":
         return render_template('dashboard.html', current_user=current_user, is_admin=is_admin)
      else:
          return render_template('access-denied.html', current_user=current_user, is_admin=is_admin)

def main():
   app.run(port=int(os.environ.get('PORT', 5000)))

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
   is_admin  = False
   return redirect(url_for("home"))

@app.route("/users")
def users():
   if is_admin == True:
      conn = sqlite3.connect('users.db')
      c = conn.cursor()
    
      c.execute("SELECT * FROM users")  
      users = c.fetchall()
      conn.close()
    
      return render_template("users-control.html", users=users, current_user=current_user, is_admin=is_admin)
   else:
      return render_template('access-denied.html', current_user=current_user, is_admin=is_admin)


@app.route("/admin", methods=['POST'])
def admin():
   username = request.form['username']

   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("UPDATE users SET admin=? WHERE username=?", (1, username))
   conn.commit()
   conn.close()
   return redirect(url_for('users'))

@app.route("/delete_user", methods=['POST'])
def delete_user():
   username = request.form['username']

   conn = sqlite3.connect('users.db')
   c = conn.cursor()
   c.execute("DELETE FROM users WHERE username=?", (username,))
   conn.commit()
   conn.close()
    

   return redirect(url_for('users'))

@app.route("/about_us")
def about_us():
   global current_user, is_admin
   return render_template("about-us.html", current_user=current_user, is_admin=is_admin)
   

if __name__ == "__main__":
   app.debug = True
   main()

