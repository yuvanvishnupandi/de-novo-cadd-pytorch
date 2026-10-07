import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

BASE = r'C:\Users\yuvan\OneDrive\Documents\eureka\whatsapp_docs'
OUTPUT = os.path.join(BASE, 'EUREKA_Review2_PBL2.pptx')

# We use the full rendered images from the PDF to get 100% exact design
bg_slide1 = os.path.join(BASE, 'template_page1_full.png')
logo_soc = os.path.join(BASE, 'template_page1_img2.png')
logo_srm = os.path.join(BASE, 'template_page1_img1.png')
pipeline_diagram = os.path.join(BASE, 'template_page3_full.png')
chart_dir = os.path.join(BASE, 'charts')

prs = Presentation()
# Set exactly 16:9 standard dimensions
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

TITLE_COLOR = RGBColor(60, 20, 220) # Blue/Purple like the original template

def add_header_logos(slide):
    # Top left SOC logo
    slide.shapes.add_picture(logo_soc, Inches(0.2), Inches(0.1), height=Inches(0.6))
    # Top right SRM logo
    slide.shapes.add_picture(logo_srm, Inches(11.3), Inches(0.1), height=Inches(0.5))

def add_title(slide, text):
    tx = slide.shapes.add_textbox(Inches(1.5), Inches(0.1), Inches(10.3), Inches(0.8))
    tf = tx.text_frame
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = TITLE_COLOR
    p.alignment = PP_ALIGN.CENTER

def add_bullet(tf, text, size=18, bold=False, color=RGBColor(0,0,0), italic=False, first=False):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.text = text
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.italic = italic
    p.font.color.rgb = color
    p.space_after = Pt(10)
    return p

# --- SLIDE 1: TITLE SLIDE (Exact Replica of Review 1) ---
s1 = prs.slides.add_slide(prs.slide_layouts[6])
# Add the exact page 1 image as background for perfect fidelity
s1.shapes.add_picture(bg_slide1, Inches(0), Inches(0), Inches(13.333), Inches(7.5))

# Add the Review 2 label over it nicely
tx = s1.shapes.add_textbox(Inches(3.16), Inches(4.5), Inches(7.0), Inches(0.8))
tf = tx.text_frame
# Add a white semi-transparent background to text box? 
# pptx doesn't easily do text box background transparency, so we'll just use a highly visible color
p = tf.paragraphs[0]
p.text = "REVIEW-2 | PBL-2 | 7th Oct 2026"
p.font.size = Pt(22)
p.font.bold = True
p.font.color.rgb = RGBColor(200, 0, 0) # Red
p.alignment = PP_ALIGN.CENTER

# --- SLIDE 2: Comments Addressed ---
s2 = prs.slides.add_slide(prs.slide_layouts[6])
add_header_logos(s2)
add_title(s2, "Comments given during the review (Review-1)")

tx = s2.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(5.8))
tf = tx.text_frame
tf.word_wrap = True

add_bullet(tf, "The following Review-1 comments have been addressed:", size=22, bold=True, color=RGBColor(0, 100, 0), first=True)
add_bullet(tf, "1. Justification of AI Strategy: Ensured ZERO Agentic AI. The pipeline is strictly deterministic, using Generative AI (LSTM) for creation and ML (Random Forest) for validation.", size=18)
add_bullet(tf, "2. Fine-tuning of Pipeline: Integrated PubChem REST API to dynamically fetch molecular features (MW, LogP) for accurate multi-criteria validation.", size=18)
add_bullet(tf, "3. Live Demonstration Ready: The local environment is configured to demonstrate 70% implementation, generating molecules and passing them through the ML graders.", size=18)
add_bullet(tf, "4. Progress: The backend is 100% complete and tested. Remaining 30% focuses on React Frontend and Cloud Deployment.", size=18)


# --- SLIDE 3: Justification on ML/DL/NLP/Transformer (10 marks) ---
s3 = prs.slides.add_slide(prs.slide_layouts[6])
add_header_logos(s3)
add_title(s3, "1. Justification on ML/DL/NLP — GenAI Concepts")

tx_left = s3.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(6.0), Inches(5.8))
tf_left = tx_left.text_frame
tf_left.word_wrap = True
add_bullet(tf_left, "Deep Learning (DL/NLP) for Generation", size=20, bold=True, color=TITLE_COLOR, first=True)
add_bullet(tf_left, "• Architecture: Long Short-Term Memory (LSTM) Neural Network.", size=16)
add_bullet(tf_left, "• NLP Approach: SMILES chemical strings are treated as a 'language'. The AI learns the grammar to generate De Novo (novel) structures.", size=16)
add_bullet(tf_left, "• Parameters: 5.5 Million trainable weights.", size=16)
add_bullet(tf_left, "• Training Data: 500,000 molecules from ZINC.", size=16)

tx_right = s3.shapes.add_textbox(Inches(6.8), Inches(1.2), Inches(6.0), Inches(5.8))
tf_right = tx_right.text_frame
tf_right.word_wrap = True
add_bullet(tf_right, "Machine Learning (ML) for Validation", size=20, bold=True, color=TITLE_COLOR, first=True)
add_bullet(tf_right, "• Architecture: Random Forest Classifiers.", size=16)
add_bullet(tf_right, "• Bioactivity Grader: Predicts if the generated drug will bind to the target disease (ChEMBL data).", size=16)
add_bullet(tf_right, "• Toxicity Grader: Predicts compound safety (Tox21).", size=16)
add_bullet(tf_right, "• Constraint Compliance: The system is entirely linear. There is NO Agentic AI orchestrating the steps.", size=16, bold=True, color=RGBColor(200,0,0))


# --- SLIDE 4: Generated content and analysis link with Objectives (5 marks) ---
s4 = prs.slides.add_slide(prs.slide_layouts[6])
add_header_logos(s4)
add_title(s4, "2. Generated Content & Analysis (Pipeline Diagram)")

# We put the exact pipeline diagram from Review 1, which the user requested to fine-tune
s4.shapes.add_picture(pipeline_diagram, Inches(0.5), Inches(1.0), Inches(12.333), Inches(4.0))

tx_bot = s4.shapes.add_textbox(Inches(0.5), Inches(5.2), Inches(12.3), Inches(2.0))
tf_bot = tx_bot.text_frame
tf_bot.word_wrap = True
add_bullet(tf_bot, "Analysis & Fine-Tuning of Objectives:", size=18, bold=True, color=TITLE_COLOR, first=True)
add_bullet(tf_bot, "• Generated content is immediately analyzed against 4 critical criteria: Synthesizability, Toxicity, Drug-Likeness, and Target-Binding.", size=16)
add_bullet(tf_bot, "• The pipeline loops deterministically until viable candidates are found, successfully linking generated output with the objective of discovering safe drugs.", size=16)


# --- SLIDE 5: Prompt engineering usage on use case scenarios (5 marks) ---
s5 = prs.slides.add_slide(prs.slide_layouts[6])
add_header_logos(s5)
add_title(s5, "3. Prompt Engineering on Use Case Scenarios")

tx_left = s5.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(6.5), Inches(5.8))
tf_left = tx_left.text_frame
tf_left.word_wrap = True
add_bullet(tf_left, "Temperature Scaling as Prompting", size=20, bold=True, color=TITLE_COLOR, first=True)
add_bullet(tf_left, "In LSTM GenAI, prompts are applied via 'Temperature'—tuning the probability distribution of generated characters.", size=16)
add_bullet(tf_left, "Use Case 1: Drug Optimization (Temp = 0.1)", size=18, bold=True, color=RGBColor(0,100,0))
add_bullet(tf_left, "• Highly conservative. Minor variations of known drugs. High validity, low diversity.", size=14)
add_bullet(tf_left, "Use Case 2: Balanced Discovery (Temp = 0.8)", size=18, bold=True, color=RGBColor(0,100,0))
add_bullet(tf_left, "• Optimal balance. Generates novel but chemically plausible structures.", size=14)
add_bullet(tf_left, "Use Case 3: Exploratory Research (Temp = 2.0)", size=18, bold=True, color=RGBColor(0,100,0))
add_bullet(tf_left, "• Highly creative. Discovers entirely new drug classes at the cost of stability.", size=14)

# Charts on right side
s5.shapes.add_picture(os.path.join(chart_dir, 'chart_temperature.png'), Inches(7.2), Inches(1.2), Inches(5.8), Inches(2.8))
s5.shapes.add_picture(os.path.join(chart_dir, 'chart_logp.png'), Inches(7.2), Inches(4.2), Inches(5.8), Inches(2.8))

prs.save(OUTPUT)
print(f"PPT saved to {OUTPUT}")
