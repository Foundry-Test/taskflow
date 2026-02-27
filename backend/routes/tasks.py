from flask import Blueprint, request, jsonify
from backend.db.database import get_db_connection
from backend.models.task import Task
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)


def parse_due_date(due_date_str):
    """Parse due date string to datetime object."""
    if not due_date_str:
        return None
    try:
        return datetime.strptime(due_date_str, '%Y-%m-%d').date()
    except ValueError:
        try:
            return datetime.strptime(due_date_str, '%Y-%m-%dT%H:%M:%S').date()
        except ValueError:
            return None


@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks with optional filtering."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()

        status_filter = request.args.get('status')
        overdue_filter = request.args.get('overdue')
        project_id = request.args.get('project_id')

        query = "SELECT * FROM tasks WHERE 1=1"
        params = []

        if status_filter:
            query += " AND status = ?"
            params.append(status_filter)

        if project_id:
            query += " AND project_id = ?"
            params.append(project_id)

        if overdue_filter and overdue_filter.lower() == 'true':
            today = datetime.now().date().isoformat()
            query += " AND due_date IS NOT NULL AND due_date < ? AND status != 'completed'"
            params.append(today)

        query += " ORDER BY due_date ASC NULLS LAST, created_at DESC"

        cursor.execute(query, params)
        rows = cursor.fetchall()

        tasks = []
        for row in rows:
            task = Task.from_db_row(row)
            tasks.append(task.to_dict())

        return jsonify({
            'success': True,
            'tasks': tasks,
            'count': len(tasks)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a single task by ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404

        task = Task.from_db_row(row)
        return jsonify({
            'success': True,
            'task': task.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    """Create a new task."""
    data = request.get_json()

    if not data:
        return jsonify({
            'success': False,
            'error': 'No data provided'
        }), 400

    title = data.get('title', '').strip()
    if not title:
        return jsonify({
            'success': False,
            'error': 'Task title is required'
        }), 400

    description = data.get('description', '').strip()
    status = data.get('status', 'pending')
    priority = data.get('priority', 'medium')
    project_id = data.get('project_id')
    assigned_to = data.get('assigned_to')
    due_date_str = data.get('due_date')

    valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
    if status not in valid_statuses:
        return jsonify({
            'success': False,
            'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
        }), 400

    valid_priorities = ['low', 'medium', 'high', 'urgent']
    if priority not in valid_priorities:
        return jsonify({
            'success': False,
            'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'
        }), 400

    due_date = None
    if due_date_str:
        due_date = parse_due_date(due_date_str)
        if due_date is None:
            return jsonify({
                'success': False,
                'error': 'Invalid due date format. Use YYYY-MM-DD'
            }), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        now = datetime.now().isoformat()

        cursor.execute(
            """
            INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, due_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (title, description, status, priority, project_id, assigned_to,
             due_date.isoformat() if due_date else None, now, now)
        )
        conn.commit()

        task_id = cursor.lastrowid
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()
        task = Task.from_db_row(row)

        return jsonify({
            'success': True,
            'task': task.to_dict(),
            'message': 'Task created successfully'
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT')
def update_task(task_id):
    """Update an existing task."""
    data = request.get_json()

    if not data:
        return jsonify({
            'success': False,
            'error': 'No data provided'
        }), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404

        existing_task = Task.from_db_row(row)

        title = data.get('title', existing_task.title).strip()
        if not title:
            return jsonify({
                'success': False,
                'error': 'Task title cannot be empty'
            }), 400

        description = data.get('description', existing_task.description)
        status = data.get('status', existing_task.status)
        priority = data.get('priority', existing_task.priority)
        project_id = data.get('project_id', existing_task.project_id)
        assigned_to = data.get('assigned_to', existing_task.assigned_to)

        valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        if status not in valid_statuses:
            return jsonify({
                'success': False,
                'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }), 400

        valid_priorities = ['low', 'medium', 'high', 'urgent']
        if priority not in valid_priorities:
            return jsonify({
                'success': False,
                'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'
            }), 400

        due_date = existing_task.due_date
        if 'due_date' in data:
            due_date_str = data['due_date']
            if due_date_str is None or due_date_str == '':
                due_date = None
            else:
                due_date = parse_due_date(due_date_str)
                if due_date is None:
                    return jsonify({
                        'success': False,
                        'error': 'Invalid due date format. Use YYYY-MM-DD'
                    }), 400

        now = datetime.now().isoformat()

        cursor.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, status = ?, priority = ?,
                project_id = ?, assigned_to = ?, due_date = ?, updated_at = ?
            WHERE id = ?
            """,
            (title, description, status, priority, project_id, assigned_to,
             due_date.isoformat() if due_date else None, now, task_id)
        )
        conn.commit()

        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        updated_row = cursor.fetchone()
        updated_task = Task.from_db_row(updated_row)

        return jsonify({
            'success': True,
            'task': updated_task.to_dict(),
            'message': 'Task updated successfully'
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks/<int:task_id>', methods=['PATCH'])
def patch_task(task_id):
    """Partially update a task (e.g., just the status or due date)."""
    data = request.get_json()

    if not data:
        return jsonify({
            'success': False,
            'error': 'No data provided'
        }), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404

        allowed_fields = ['title', 'description', 'status', 'priority', 'assigned_to', 'due_date', 'project_id']
        update_fields = []
        update_values = []

        for field in allowed_fields:
            if field in data:
                if field == 'status':
                    valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
                    if data[field] not in valid_statuses:
                        return jsonify({
                            'success': False,
                            'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
                        }), 400
                elif field == 'priority':
                    valid_priorities = ['low', 'medium', 'high', 'urgent']
                    if data[field] not in valid_priorities:
                        return jsonify({
                            'success': False,
                            'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'
                        }), 400
                elif field == 'due_date':
                    if data[field] is None or data[field] == '':
                        update_fields.append("due_date = ?")
                        update_values.append(None)
                        continue
                    else:
                        parsed = parse_due_date(data[field])
                        if parsed is None:
                            return jsonify({
                                'success': False,
                                'error': 'Invalid due date format. Use YYYY-MM-DD'
                            }), 400
                        update_fields.append("due_date = ?")
                        update_values.append(parsed.isoformat())
                        continue

                update_fields.append(f"{field} = ?")
                update_values.append(data[field])

        if not update_fields:
            return jsonify({
                'success': False,
                'error': 'No valid fields to update'
            }), 400

        now = datetime.now().isoformat()
        update_fields.append("updated_at = ?")
        update_values.append(now)
        update_values.append(task_id)

        query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, update_values)
        conn.commit()

        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        updated_row = cursor.fetchone()
        updated_task = Task.from_db_row(updated_row)

        return jsonify({
            'success': True,
            'task': updated_task.to_dict(),
            'message': 'Task updated successfully'
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task by ID."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404

        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()

        return jsonify({
            'success': True,
            'message': f'Task {task_id} deleted successfully'
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks/overdue', methods=['GET'])
def get_overdue_tasks():
    """Get all overdue tasks."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        today = datetime.now().date().isoformat()

        cursor.execute(
            """
            SELECT * FROM tasks
            WHERE due_date IS NOT NULL
              AND due_date < ?
              AND status NOT IN ('completed', 'cancelled')
            ORDER BY due_date ASC
            """,
            (today,)
        )
        rows = cursor.fetchall()

        tasks = []
        for row in rows:
            task = Task.from_db_row(row)
            tasks.append(task.to_dict())

        return jsonify({
            'success': True,
            'tasks': tasks,
            'count': len(tasks)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    finally:
        conn.close()


@tasks_bp.route('/tasks/due-today', methods=['GET'])
def get_tasks_due_today():
    """Get all tasks due today."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        today = datetime.now().date().isoformat()

        cursor.execute(
            """
            SELECT * FROM tasks
            WHERE due_date = ?
              AND status NOT IN ('completed', 'cancelled')
            ORDER BY priority DESC, created_at ASC
            """,
            (today,)
        )
        rows = cursor.fetchall()

        tasks = []
        for row in rows:
            task = Task.from_db_row(row)
            tasks.append(task.to_dict())

        return jsonify({
            'success': True,
            'tasks': tasks,
            'count': len(tasks)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)