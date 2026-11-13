import os
import sys

root = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root not in sys.path:
    sys.path.insert(0, root)

import uvicorn

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)

