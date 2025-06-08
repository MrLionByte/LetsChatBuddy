import subprocess
import os

project_root = os.getcwd()

frontend_path = os.path.join(project_root, "client/letschatbuddy")   # Adjust if needed
backend_path = os.path.join(project_root, "server/letschatbuddy")  # Adjust if needed
venv_path = os.path.join(backend_path, ".venv", "bin", "activate")


backend_command = f"source {venv_path} && python manage.py runserver"


# Start backend (Django server)
backend_process = subprocess.Popen(
    ["bash", "-c", backend_command],
    cwd=backend_path
)

# Start frontend (React app)
frontend_process = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=frontend_path,
    shell=True 
)

backend_process.wait()
frontend_process.wait()
