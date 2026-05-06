from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import fitz
from docx import Document
import os

app = FastAPI()

# CORS
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

# PDF TO WORD
@app.post("/api/pdf/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"
    output_path = "converted.docx"

    # Save uploaded PDF
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Open PDF
    pdf = fitz.open(input_path)

    doc = Document()

    # Extract text page by page
    for page in pdf:
        text = page.get_text()

        if text.strip():
            doc.add_paragraph(text)
        else:
            doc.add_paragraph("[No readable text found on this page]")

    pdf.close()

    # Save Word
    doc.save(output_path)

    # Cleanup PDF
    os.remove(input_path)

    # Return DOCX
    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )
