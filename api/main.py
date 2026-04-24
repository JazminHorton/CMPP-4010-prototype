from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app) #Lets the (future) react frontend to talk to this api

@app.route('/api/scammers', methods=['GET'])
def get_scammers():
    try:
        #connect to DB
        conn = psycopg2.connect(
            host="db",
            database="scalper_data",
            user="admin",
            password="password123"
        )
        cursor = conn.cursor()

        #grab the data
        cursor.execute("SELECT id, ip_address, ban_time FROM banned_users;")
        rows = cursor.fetchall()

        #format it all nice
        scammer_list = [{"id": row[0], "ip": row[1], "time": str(row[2])} for row in rows]

        cursor.close()
        conn.close()
        return jsonify(scammer_list)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    