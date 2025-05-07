import os, sqlite3, threading
from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime, date as dt_date
import schedule
import time
import calendar

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
                date TEXT NOT NULL,
                admin BOOL NOT NULL )''')
   conn.commit()
   conn.close()

user_table()

def user_daily_intake_table():
   conn = sqlite3.connect('users.db')
   c = conn.cursor()
   c.execute('''CREATE TABLE IF NOT EXISTS userDaily
                (username TEXT UNIQUE NOT NULL,
                calories DECIMAL,
                protein DECIMAL,
                carbs DECIMAL,
                fats DECIMAL)''')
   conn.commit()
   conn.close()


user_daily_intake_table()

def user_meals_table():
   conn = sqlite3.connect('users.db')
   c = conn.cursor()
   c.execute('''CREATE TABLE IF NOT EXISTS userMeals
                (username TEXT UNIQUE NOT NULL,
                breakfastCal DECIMAL,
                lunchCal DECIMAL,
                dinnerCal DECIMAL,
                snacksCal DECIMAL)''')
   conn.commit()
   conn.close()

user_meals_table()

def user_weight_table():
   conn = sqlite3.connect('users.db')
   c = conn.cursor()
   c.execute('''CREATE TABLE IF NOT EXISTS userWeight
                (username TEXT UNIQUE NOT NULL,
                sunday DECIMAL,
                monday DECIMAL,
                tuesday DECIMAL,
                wednesday DECIMAL,
                thursday DECIMAL,
                friday DECIMAL,
                saturday DECIMAL
              )''')
   conn.commit()
   conn.close()

user_weight_table()


def nutrition_table():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS weeklyNutrition (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    day TEXT NOT NULL,
                    protein DECIMAL NOT NULL,
                    fats DECIMAL NOT NULL,
                    carbs DECIMAL NOT NULL,
                    FOREIGN KEY (username) REFERENCES users(username)
                )''')
    
    conn.commit()
    conn.close()

nutrition_table()

@app.route("/")
def home():
   if current_user != "guest":
      user_data = get_user_data()
      return render_template('index.html', current_user=current_user, is_admin=is_admin, user_data=user_data)
   else:
      user_data = None
      return render_template('index.html', current_user=current_user, is_admin=is_admin, user_data=user_data)

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
         c.execute("INSERT INTO users (username, firstname, lastname, password, email, gender, goal, activity, height, weight, date, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (username, first_name, last_name, password, email, gender, goal, activity_lvl, height, weight, date, 0))
         c.execute("INSERT INTO userDaily (username, calories, protein, fats, carbs) VALUES (?, 0, 0, 0, 0)", (username,))
         c.execute("INSERT INTO userMeals (username, breakfastCal, lunchCal, dinnerCal, snacksCal) VALUES (?, 0, 0, 0, 0)", (username,))
         
         c.execute("INSERT INTO userWeight (username, sunday, monday, tuesday, wednesday, thursday, friday, saturday) VALUES (?, 0, 0, 0, 0, 0, 0, 0)", (username,))
         conn.commit()

         set_weight(username)

         days_of_week = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

         for day in days_of_week:
            c.execute('''INSERT INTO weeklyNutrition (username, day, protein, fats, carbs) VALUES (?, ?, 0, 0, 0)''', (username, day))
      
         conn.commit()
         conn.close()

         return redirect(url_for("login"))
      
      conn.commit()
      conn.close()
      
   if current_user != "guest":
      user_data = get_user_data()
   else:
      user_data = None

   return render_template("signup.html", current_user=current_user, is_admin=is_admin, user_data=user_data)

@app.route("/usercheck",  methods=['GET', 'POST'])
def usercheck():
   global current_user
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
      
   if current_user != "guest":
      user_data = get_user_data()
   else:
      user_data = None

   return render_template('login.html', current_user=current_user, error_message=error_message, is_admin=is_admin, user_data=user_data)

@app.route("/dashboard") 
def dashboard():
      global current_user
      if current_user != "guest":
         user_data = get_user_data()
         return render_template('dashboard.html', current_user=current_user, is_admin=is_admin, user_data=user_data)
      else:
         user_data = None
         return render_template('access-denied.html', current_user=current_user, is_admin=is_admin, user_data=user_data)


@app.route("/start_journey")
def start_journey():
    global current_user
    if current_user == "guest":
        return redirect(url_for("login"))
    else:
        return redirect(url_for("dashboard"))

def get_user_data():
   global current_user
   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("SELECT goal, activity, height, weight  FROM users WHERE username = ?", (current_user,))
   user_data = c.fetchone()
   conn.close()

   activities = [
    {'value': 'sedentary', 'label': 'Sedentary', 'selected': user_data[1] == 'sedentary'},
    {'value': 'lightly-active', 'label': 'Lightly Active', 'selected': user_data[1] == 'lightly-active'},
    {'value': 'moderately-active', 'label': 'Moderately Active', 'selected': user_data[1] == 'moderately-active'},
    {'value': 'very-active', 'label': 'Very Active', 'selected': user_data[1] == 'very-active'},
]
   
   goals = [
    {'value': 'cut', 'label': 'Cut', 'selected': user_data[0] == 'cut'},
    {'value': 'maintain', 'label': 'Maintain', 'selected': user_data[0] == 'maintain'},
    {'value': 'bulk', 'label': 'Bulk', 'selected': user_data[0] == 'bulk'},
   ]

   return user_data, goals, activities

@app.route("/health_data", methods=['GET', 'POST'])
def health_data():
   global current_user
   data = request.get_json()

   goal = data.get('goal')
   activity = data.get('activity')
   height = data.get('height')
   weight = data.get('weight')

   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("UPDATE users SET goal=?, activity=?, height=?, weight=? WHERE username = ?", (goal, activity, height, weight, current_user))
   
   date = dt_date.today()
   today = calendar.day_name[date.weekday()].lower()

   query = f"UPDATE userWeight SET {today}=? WHERE username = ?"
   c.execute(query, (weight, current_user))

   conn.commit()
   conn.close()
   
   return jsonify({"status": "error", "message": str(sqlite3.Error)})


@app.route("/logout")
def logout():
   global current_user, is_admin
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
    
      if current_user != "guest":
         user_data = get_user_data()
      else:
         user_data = None

         user_data = get_user_data()
      return render_template("users-control.html", users=users, current_user=current_user, is_admin=is_admin, user_data=user_data)
   else:
      user_data = None
      return render_template('access-denied.html', current_user=current_user, is_admin=is_admin, user_data=user_data)

@app.route("/get_calories", methods=['GET', 'POST'])
def get_calories():
      global current_user
      conn = sqlite3.connect('users.db')
      c = conn.cursor()
      c.execute("SELECT goal, gender, activity, height, weight, date FROM users WHERE username=?", (current_user,))
      rows = c.fetchone()

      c.execute("SELECT calories FROM userDaily WHERE username=?", (current_user,))  
      daily_calories = c.fetchone()

      conn.close()
    
      goal = rows[0]
      gender = rows[1]
      activity = rows[2]
      height = rows[3]
      weight = rows[4]
      date = rows[5]

      birthdate = datetime.strptime(date, "%Y-%m-%d").date()
      today = dt_date.today()
      age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

   # calculate BMR
      if gender == "male":
         BMR = 10*weight + 6.25*height - 5* age +5
      else:
         BMR = 10 * weight + 6.25 * height - 5 * age - 161
    
   # calculate TDEE
      if activity == "sedentary":
         TDEE = BMR*1.2
      elif activity == "lightly-active":
         TDEE = BMR*1.375
      elif activity == "moderately-active":
         TDEE = BMR*1.55
      elif activity == "very-active":
         TDEE = BMR*1.725
      else:
         TDEE = BMR*1.9

    # calculate for goals
      if daily_calories:
         return jsonify(round( TDEE - (TDEE * 0.2)), daily_calories) if goal == "cut" else jsonify(round(TDEE + (TDEE * 0.15)), daily_calories) if goal == "bulk" else jsonify(round(TDEE), daily_calories)

@app.route("/get_mealcal", methods=['GET', 'POST'])
def get_mealcal():
   global current_user
   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("SELECT breakfastCal, lunchCal, dinnerCal, snacksCal FROM userMeals WHERE username = ?", (current_user,))
   meals_calories = c.fetchone()

   return jsonify(meals_calories)



@app.route("/get_food", methods=['GET', 'POST'])
def get_food():
   conn = sqlite3.connect('foods.db')
   c = conn.cursor()

   c.execute("SELECT foodname FROM FoodData")
   foods_array = c.fetchall()
   conn.close()

   food_names = [food[0] for food in foods_array]

   return jsonify(food_names)

@app.route("/get_nutrition", methods=['GET', 'POST'])
def get_nutrition():

   data = request.get_json()
   foodname = data.get('foodname')

   conn = sqlite3.connect('foods.db')
   c = conn.cursor()

   c.execute("SELECT calories, protein, carbs, fats FROM FoodData WHERE foodname = ?", (foodname,))
   food_nutrition = c.fetchone()
   conn.close()

   return jsonify(food_nutrition)



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

@app.route("/daily_intake", methods=['GET', 'POST'])
def daily_intake():
   global current_user
   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("SELECT calories, protein, carbs, fats FROM userDaily WHERE username = ?", (current_user,))
   daily_nutrition = c.fetchone()

   data = request.get_json()
   daily_calories = data.get("calories") + daily_nutrition[0]
   daily_protein = data.get("protein") + daily_nutrition[1]
   daily_carbs = data.get('carbs')+ daily_nutrition[2]
   daily_fats = data.get('fats')+ daily_nutrition[3]
   meal_type = data.get('meal') + "Cal"
   
   
   c.execute("UPDATE userDaily SET calories=?, protein=?, carbs=?, fats=? WHERE username=?", (daily_calories, daily_protein, daily_carbs, daily_fats, current_user))
   c.execute("SELECT calories, protein, carbs, fats FROM userDaily WHERE username = ?", (current_user,))
   daily_nutrition = c.fetchone()

   query = f"SELECT {meal_type} FROM userMeals WHERE username = ?"
   c.execute(query, (current_user,))
   meal_calories = c.fetchone()
      
   meal_calories_update = data.get("calories") + int(meal_calories[0])
   query = f"UPDATE userMeals SET {meal_type} = ? WHERE username = ?"
   c.execute(query, (meal_calories_update, current_user))

   conn.commit()
   conn.close()

   update_nutrition(current_user)
   return jsonify(daily_nutrition, meal_calories_update)

def set_all_weights():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("SELECT username FROM users")
    usernames = c.fetchall()
    conn.close()

    for (username,) in usernames:
        set_weight(username)

@app.route("/get_weekly_nutrition", methods=['GET', 'POST'])
def get_weekly_nutrition():
    global current_user
    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute('''SELECT day, protein, fats, carbs FROM weeklyNutrition
                 WHERE username = ?''', (current_user,))
    
    data = c.fetchall()
    conn.close()

    return jsonify(data)

@app.route("/get_goal", methods=['GET', "POST"])
def get_goal():
   global current_user
   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("SELECT goal FROM users WHERE username = ?", (current_user,))
   goal = c.fetchone()
   conn.close()

   return jsonify(goal)

def set_weight(username):
   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("SELECT weight FROM users WHERE username = ?", (username,))
   weight = c.fetchone()

   date = dt_date.today()
   today = calendar.day_name[date.weekday()].lower()

   query = f"UPDATE userWeight SET {today}=? WHERE username = ?"
   c.execute(query, (weight[0], username))

   conn.commit()
   conn.close()

@app.route("/get_weight", methods=['GET', 'POST'])
def get_weight():
   global current_user
   conn = sqlite3.connect('users.db')
   c = conn.cursor()

   c.execute("SELECT sunday, monday, tuesday, wednesday, thursday, friday, saturday  FROM userWeight WHERE username= ?", (current_user, ))
   week_weight = c.fetchone()
   conn.close()

   return jsonify(week_weight)

@app.route("/about_us")
def about_us():
   global current_user, is_admin
   if current_user != "guest":
      user_data = get_user_data()
   else:
      user_data = None

   return render_template("about-us.html", current_user=current_user, is_admin=is_admin, user_data=user_data)
   
@app.route("/support")
def support():
   global current_user, is_admin
   if current_user != "guest":
      user_data = get_user_data()
   else:
      user_data = None

   return render_template("support.html", current_user=current_user, is_admin=is_admin, user_data=user_data)

def daily_data():
    global current_user
    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("UPDATE userDaily SET calories = 0, protein = 0, fats = 0, carbs = 0 ")
    c.execute("UPDATE userMeals SET breakfastCal = 0, lunchCal = 0, dinnerCal = 0, snacksCal = 0")
   
    conn.commit()
    conn.close()
   
    set_all_weights()


def update_nutrition(username):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    date = dt_date.today()
    today = calendar.day_name[date.weekday()].lower()

    c.execute("SELECT protein, fats, carbs FROM userDaily WHERE username=?", (username,))
    result = c.fetchone()
    protein, fats, carbs = result

    c.execute('''UPDATE weeklyNutrition SET protein=?, fats=?, carbs=? WHERE username=? AND day=?''',(protein, fats, carbs, username, today))

    conn.commit() 
    conn.close()

def update_all_nutrition():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("SELECT username FROM userDaily")
    usernames = c.fetchall()

    for (username,) in usernames:
      update_nutrition(username)

    conn.close()


schedule.every().day.at("23:59").do(update_all_nutrition)
schedule.every().day.at("00:00").do(daily_data)


def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":

    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()

    app.run(port=int(os.environ.get('PORT', 5000)), debug=True)
