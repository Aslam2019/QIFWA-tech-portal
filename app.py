from flask import Flask, render_template, request, jsonify, redirect, session
import sqlite3

app = Flask(__name__)
app.secret_key = "super_secret_key_for_admin"

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin (
            username TEXT PRIMARY KEY,
            password TEXT
        )
    """)
    # இங்க job_type (internship / job) சேர்க்கிறோம்
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT,
            domain_name TEXT,
            job_type TEXT
        )
    """)
    try:
        cursor.execute("INSERT INTO admin VALUES ('admin', 'admin123')")
    except sqlite3.IntegrityError:
        pass
    conn.commit()
    conn.close()

@app.route('/')
def home():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
   
    cursor.execute("SELECT product_name, domain_name, job_type FROM products")
    db_products = cursor.fetchall()
    conn.close()
    return render_template('index.html', db_products=db_products)

@app.route('/admin-login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM admin WHERE username=? AND password=?", (username, password))
        user = cursor.fetchone()
        conn.close()
        if user:
            session['logged_in'] = True
            return redirect('/dashboard')
        else:
            return "<script>alert('Invalid Credentials!'); window.location='/admin-login';</script>"
    return render_template('admin_login.html')

@app.route('/dashboard')
def dashboard():
    if not session.get('logged_in'):
        return redirect('/admin-login')
    
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT product_name, domain_name, job_type, id FROM products")
    db_products = cursor.fetchall()
    conn.close()
    return render_template('dashboard.html', db_products=db_products)

@app.route('/add-product', methods=['POST'])
def add_product():
    if not session.get('logged_in'):
        return jsonify({"status": "ERROR", "message": "Unauthorized"})
    prod_name = request.form.get('prod_name')
    dom_name = request.form.get('dom_name')
    job_type = request.form.get('job_type') # அட்மின் செலக்ட் பண்ணும் டைப்
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO products (product_name, domain_name, job_type) VALUES (?, ?, ?)", (prod_name, dom_name, job_type))
    conn.commit()
    conn.close()
    return "<script>alert('Opportunity Added Successfully! 🎉'); window.location='/dashboard';</script>"

@app.route('/delete-product/<int:product_id>')
def delete_product(product_id):
    if not session.get('logged_in'):
        return redirect('/admin-login')
    
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM products WHERE id=?", (product_id,))
    conn.commit()
    conn.close()
    return "<script>alert('Opportunity Removed Successfully! ❌'); window.location='/dashboard';</script>"

@app.route('/logout')
def logout():
    session['logged_in'] = False
    return redirect('/')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)