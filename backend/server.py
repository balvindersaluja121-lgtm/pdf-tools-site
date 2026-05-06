from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import fitz  # PyMuPDF
from docx import Document

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}

# ✅ REAL PDF → WORD
@app.post("/api/pdf/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    
    input_path = f"temp_{file.filename}"
    output_path = input_path.replace(".pdf", ".docx")

    # Save file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    pdf = fitz.open(input_path)
    text = ""

    for page in pdf:
        text += page.get_text()

    pdf.close()

    # Create Word file
    doc = Document()
    doc.add_paragraph(text if text else "No readable text found")
    doc.save(output_path)

    # Return file
    return FileResponse(output_path, filename="converted.docx")
