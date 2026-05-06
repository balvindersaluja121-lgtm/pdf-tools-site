from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil
import os
from docx import Document

app = FastAPI()

# ✅ CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root
@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}

# ✅ PDF → WORD (Basic working version)
@app.post("/api/pdf/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    input_path = f"temp_{file.filename}"
    output_path = input_path.replace(".pdf", ".docx")

    # Save uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ⚠️ Simple demo conversion (text only)
    doc = Document()
    doc.add_paragraph("Converted from PDF (Demo version)")
    doc.save(output_path)

    # Return file
    from fastapi.responses import FileResponse
    return FileResponse(output_path, filename=output_path)
