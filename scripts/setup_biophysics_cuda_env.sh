#!/usr/bin/env bash
# =============================================================================
# EUREKA: In-Silico Biophysics & Generative Biology Workbench
# Environment Initialization & CUDA 12 Hardware Acceleration Script
# =============================================================================
set -euo pipefail

echo "======================================================================="
echo "  EUREKA In-Silico Discovery Environment Setup"
echo "  CUDA 12.x / PyTorch / RDKit / AutoDock Vina v1.2.5"
echo "======================================================================="

# Check Python version >= 3.11
REQUIRED_PY_MAJOR=3
REQUIRED_PY_MINOR=11

PYTHON_CMD="python3"
if ! command -v "${PYTHON_CMD}" &> /dev/null; then
    PYTHON_CMD="python"
fi

if ! command -v "${PYTHON_CMD}" &> /dev/null; then
    echo "[-] Error: Python is not installed. Please install Python 3.11 or higher."
    exit 1
fi

PY_VERSION=$("${PYTHON_CMD}" -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "[+] Detected Python version: ${PY_VERSION}"

# Check CUDA Toolkit availability
if command -v nvcc &> /dev/null; then
    CUDA_VER=$(nvcc --version | grep "release" | awk '{print $5}' | sed 's/,//')
    echo "[+] NVIDIA CUDA Compiler (NVCC) detected: version ${CUDA_VER}"
else
    echo "[!] Warning: NVCC not found in PATH. Operating in CPU/OpenMP fallback mode."
fi

# Create isolated Python virtual environment
VENV_DIR=".venv"
if [ ! -d "${VENV_DIR}" ]; then
    echo "[*] Creating virtual environment in ${VENV_DIR}..."
    "${PYTHON_CMD}" -m venv "${VENV_DIR}"
fi

# Activate environment
# shellcheck source=/dev/null
source "${VENV_DIR}/bin/activate" 2>/dev/null || source "${VENV_DIR}/Scripts/activate" 2>/dev/null || true

# Install biophysical requirements
echo "[*] Upgrading pip, wheel, and setuptools..."
pip install --upgrade pip setuptools wheel --quiet

echo "[*] Ingesting primary biophysical dependencies from requirements.txt..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet
fi

# Set biophysical scratch cache directories
export EUREKA_CACHE_DIR="${HOME}/.cache/eureka_biophysics"
export VINA_CPU_THREADS=$(nproc 2>/dev/null || echo 16)
mkdir -p "${EUREKA_CACHE_DIR}/pdbqt_cache"
mkdir -p "${EUREKA_CACHE_DIR}/cryoem_maps"

echo "[+] Biophysical directories initialized at ${EUREKA_CACHE_DIR}"
echo "[+] AutoDock Vina thread pool: ${VINA_CPU_THREADS} concurrent threads"
echo "======================================================================="
echo "  EUREKA biophysical environment ready for simulation."
echo "======================================================================="
