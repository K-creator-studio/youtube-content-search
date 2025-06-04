
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import jwt
import datetime
from config import SECRET_KEY  # Your secret key here
from flask import Blueprint

get_department_teachers_bp = Blueprint('get_department_teachers', __name__)
get_teacher_courses_bp = Blueprint('get_teacher_courses', __name__)
register_course_bp = Blueprint('register_course', __name__)
get_registered_courses_bp = Blueprint('get_registered_courses', __name__)
unregister_course_bp = Blueprint('unregister_course', __name__)

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = SECRET_KEY

def get_db_connection():
    return pymysql.connect(
        host="localhost",
              # ✅ You are using port 3307 (phpMyAdmin confirms this)
        user="root",
        password="",
        database="",
        cursorclass=pymysql.cursors.DictCursor,
        charset="utf8",
        autocommit=True
    )

# ----------------------------
# Get teachers in student's department
# ----------------------------
@get_department_teachers_bp.route('/get_department_teachers', methods=['GET'])
def get_department_teachers():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if decoded["role"] != "student":
                return jsonify({"error": "Only students can fetch teachers"}), 403
            student_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT dep_id FROM students WHERE student_id = %s", (student_id,))
                student = cursor.fetchone()
                if not student:
                    return jsonify({"error": "Student not found"}), 404
                dep_id = student["dep_id"]

                cursor.execute("SELECT teacher_id, teacher_name FROM teachers WHERE dep_id = %s", (dep_id,))
                teachers = cursor.fetchall()

        return jsonify({"teachers": teachers}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Get courses by teacher_id
# ----------------------------
@get_teacher_courses_bp.route('/get_teacher_courses', methods=['GET'])
def get_teacher_courses():
    try:
        teacher_id = request.args.get('teacher_id')
        if not teacher_id:
            return jsonify({"error": "Teacher ID is required"}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT course_id, course_name 
                    FROM courses 
                    WHERE teacher_id = %s
                """, (teacher_id,))
                courses = cursor.fetchall()

        if not courses:
            return jsonify({"error": "No courses found for this teacher"}), 404

        return jsonify({"courses": courses}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Register student to course
# ----------------------------
@register_course_bp .route('/register_course', methods=['POST'])
def register_course():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if decoded["role"] != "student":
                return jsonify({"error": "Only students can register for courses"}), 403
            student_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        data = request.get_json()
        teacher_id = data.get("teacher_id")
        course_id = data.get("course_id")

        if not teacher_id or not course_id:
            return jsonify({"error": "Teacher ID and Course ID are required"}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Check student's department
                cursor.execute("SELECT dep_id FROM students WHERE student_id = %s", (student_id,))
                student = cursor.fetchone()
                if not student:
                    return jsonify({"error": "Student not found"}), 404
                student_dep = student["dep_id"]

                # Check course and teacher match and department
                cursor.execute("SELECT dep_id, teacher_id FROM courses WHERE course_id = %s", (course_id,))
                course = cursor.fetchone()
                if not course:
                    return jsonify({"error": "Course not found"}), 404
                if str(course["teacher_id"]) != str(teacher_id):
                    return jsonify({"error": "This course is not taught by the selected teacher"}), 403
                if course["dep_id"] != student_dep:
                    return jsonify({"error": "You can only register for courses from your department"}), 403

                # Insert or ignore duplicate
                cursor.execute("""
                    INSERT INTO student_courses (student_id, course_id)
                    VALUES (%s, %s)
                    ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), course_id = VALUES(course_id)
                """, (student_id, course_id))

        return jsonify({"message": "Successfully registered for the course!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Get registered courses of student
# ----------------------------
@get_registered_courses_bp .route('/get_registered_courses', methods=['GET'])
def get_registered_courses():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if decoded["role"] != "student":
                return jsonify({"error": "Only students can view registered courses"}), 403
            student_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT c.course_id, c.course_name, t.teacher_name
                    FROM student_courses sc
                    JOIN courses c ON sc.course_id = c.course_id
                    JOIN teachers t ON c.teacher_id = t.teacher_id
                    WHERE sc.student_id = %s
                """, (student_id,))
                courses = cursor.fetchall()

        return jsonify({"courses": courses}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Unregister student from course
# ----------------------------
@unregister_course_bp.route('/unregister_course', methods=['POST'])
def unregister_course():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            if decoded["role"] != "student":
                return jsonify({"error": "Only students can unregister courses"}), 403
            student_id = decoded["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        data = request.get_json()
        course_id = data.get("course_id")

        if not course_id:
            return jsonify({"error": "Course ID is required"}), 400

        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM student_courses 
                    WHERE student_id = %s AND course_id = %s
                """, (student_id, course_id))

        return jsonify({"message": "Successfully unregistered from the course!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

