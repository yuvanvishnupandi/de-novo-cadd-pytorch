# 🚀 EUREKA: Comprehensive GPU Training Guide for Teammates

**Hey Team!** 
The Backend Data Pipeline, AI Models, and Orchestration scripts are 100% complete, error-free, and pushed to our GitHub repository. 

However, because university laptops have Application Control Policies that block compiled ML libraries (like `scikit-learn` DLLs), and because training Deep Learning models requires massive parallel computation, **these specific training scripts cannot run on my laptop.**

I need a teammate with a **High-End Gaming Laptop** to run the final model training scripts and push the trained AI weights back to GitHub.

---

## 💻 1. Minimum Hardware & Software Requirements

To successfully train these models, your laptop MUST meet the following criteria:

* **GPU (Crucial):** You MUST have a dedicated **Nvidia GPU** (e.g., RTX 3050, 3060, 4060, 4070, or higher). AMD GPUs or Intel Integrated Graphics will NOT work for PyTorch CUDA acceleration.
* **Processor (CPU):** Intel Core i7 / AMD Ryzen 7 (or higher) is recommended.
* **RAM:** Minimum 16GB RAM.
* **Storage:** At least 5GB to 10GB of free SSD space.
* **Software:** Python 3.10 or 3.11 must be installed and added to your system PATH.

---

## 🛠️ 2. Step-by-Step Execution Instructions

Please follow these exact steps to download the code, install dependencies, run the training, and upload the models.

### Step 1: Download the Project
Open your terminal (PowerShell or Command Prompt) and run:
```bash
git clone https://github.com/yuvanvishnupandi/eureka.git
cd eureka/backend
```

### Step 2: Install Required Libraries
You need to install all the python packages required for the project. 
```bash
pip install -r requirements.txt
```
*(Note: To ensure your Nvidia GPU is actually used, you may need to install the CUDA-specific version of PyTorch. You can get the exact command from [pytorch.org](https://pytorch.org/) if the standard install defaults to CPU).*

### Step 3: Train the Heavy Deep Learning GenAI Model
This is the most intensive task. It trains our PyTorch LSTM Neural Network on 500,000 chemical molecules. **This will take a few hours depending on your GPU's power.**
```bash
python ai_models/train_genai.py
```
*Wait for this script to finish completely! When successful, it will generate a large file called `genai_trained_weights.pth` inside the `ai_models` folder.*

### Step 4: Train the Machine Learning Toxicity Grader
This script trains our Random Forest classifier to detect poisonous molecules using the Tox21 dataset. This is fast but requires your laptop because university laptops block the ML DLLs.
```bash
python data_pipelines/tox21_preprocessing.py
```
*Wait for this to finish! It will generate a file called `toxicity_grader.pkl` inside the `ai_models` folder.*

### Step 5: Train the Bioactivity ML Grader
This script trains the Random Forest classifier that checks if a molecule will actually cure the target disease.
```bash
python ai_models/model_training.py
```
*Wait for this to finish! It will generate a file called `ml_grader_model.pkl` inside the `ai_models` folder.*

### Step 6: Push the Trained Models to GitHub
Once all three model files (`genai_trained_weights.pth`, `toxicity_grader.pkl`, and `ml_grader_model.pkl`) have been successfully generated, you need to push them to GitHub so I can pull them down for the presentation.

Run these exact commands:
```bash
git add .
git commit -m "Added trained AI model weights from GPU laptop"
git push origin main
```

---

## 🤖 3. Automated Prompt for your AI Agent
If you use an AI coding assistant like Cursor, Windsurf, or Antigravity, you can literally just copy and paste this prompt to it, and it will do everything for you!

> **Copy and paste this to your AI:**
> 
> "Hi AI. My teammate has pushed the 'eureka' project to our GitHub repo. I have an Nvidia GPU laptop and I need to generate the model weights. I need you to do the following exactly:
> 1. Clone the repo: `git clone https://github.com/yuvanvishnupandi/eureka.git`
> 2. Navigate into the folder: `cd eureka/backend`
> 3. Install the dependencies: `pip install -r requirements.txt` (Make sure PyTorch with CUDA is installed so it utilizes my Nvidia GPU).
> 4. Run `python ai_models/train_genai.py`. Let it finish training the LSTM on my GPU until it generates `genai_trained_weights.pth`.
> 5. Run `python data_pipelines/tox21_preprocessing.py`. This will generate `toxicity_grader.pkl`.
> 6. Run `python ai_models/model_training.py` to generate `ml_grader_model.pkl`.
> 7. Once all 3 files are generated, `git add .`, `git commit -m "Add trained AI weights"`, and `git push origin main`.
> Please execute this step-by-step automatically and let me know when it is pushed!"
