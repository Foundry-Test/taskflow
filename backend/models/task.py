from datetime import datetime
from backend.db.database import get_db_connection


class Task:
    def __init__(self, id, title, description, status, due_date, created_at, updated_at):
        self.id = id
        self.title = title
        self.description = description
        self.status = status
        self.due_date = due_date
        self.created_at = created_at
        self.updated_at = updated_at

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_overdue": self.is_overdue(),
        }

    def is_overdue(self):
        if self.due_date is None:
            return False
        if self.status in ("completed", "done"):
            return False
        now = datetime.utcnow().date()
        due = self.due_date.date() if isinstance(self.due_date, datetime) else self.due_date
        return due < now

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(
            id=row["id"],
            title=row["title"],
            description=row.get("description"),
            status=row.get("status", "pending"),
            due_date=row.get("due_date"),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )

    @classmethod
    def get_all(cls):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, title, description, status, due_date, created_at, updated_at "
                "FROM tasks ORDER BY created_at DESC"
            )
            rows = cursor.fetchall()
            return [cls.from_row(row) for row in rows]
        finally:
            conn.close()

    @classmethod
    def get_by_id(cls, task_id):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, title, description, status, due_date, created_at, updated_at "
                "FROM tasks WHERE id = %s",
                (task_id,),
            )
            row = cursor.fetchone()
            return cls.from_row(row)
        finally:
            conn.close()

    @classmethod
    def create(cls, title, description=None, status="pending", due_date=None):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            now = datetime.utcnow()
            cursor.execute(
                "INSERT INTO tasks (title, description, status, due_date, created_at, updated_at) "
                "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (title, description, status, due_date, now, now),
            )
            task_id = cursor.fetchone()["id"]
            conn.commit()
            return cls.get_by_id(task_id)
        finally:
            conn.close()

    @classmethod
    def update(cls, task_id, title=None, description=None, status=None, due_date=None):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            fields = []
            values = []

            if title is not None:
                fields.append("title = %s")
                values.append(title)
            if description is not None:
                fields.append("description = %s")
                values.append(description)
            if status is not None:
                fields.append("status = %s")
                values.append(status)
            if due_date is not None:
                fields.append("due_date = %s")
                values.append(due_date)

            if not fields:
                return cls.get_by_id(task_id)

            fields.append("updated_at = %s")
            values.append(datetime.utcnow())
            values.append(task_id)

            query = f"UPDATE tasks SET {', '.join(fields)} WHERE id = %s"
            cursor.execute(query, values)
            conn.commit()
            return cls.get_by_id(task_id)
        finally:
            conn.close()

    @classmethod
    def delete(cls, task_id):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    @classmethod
    def get_overdue(cls):
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            today = datetime.utcnow().date()
            cursor.execute(
                "SELECT id, title, description, status, due_date, created_at, updated_at "
                "FROM tasks "
                "WHERE due_date < %s AND status NOT IN ('completed', 'done') "
                "ORDER BY due_date ASC",
                (today,),
            )
            rows = cursor.fetchall()
            return [cls.from_row(row) for row in rows]
        finally:
            conn.close()