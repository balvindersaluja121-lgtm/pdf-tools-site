```python
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import fitz
from docx import Document
from PIL import Image
import img2pdf
from PyPDF2 import PdfMerger

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HOME
@app.get("/")
def home():
    return {"message": "Backend running"}

# PDF TO WORD
@app.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = Document()

    pdf = fitz.open(pdf_path)

    for page in pdf:
        text = page.get_text()
        doc.add_paragraph(text)

    output_path = "converted.docx"
    doc.save(output_path)

    pdf.close()

    os.remove(pdf_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )

# JPG TO PDF
@app.post("/jpg-to-pdf")
async def jpg_to_pdf(file: UploadFile = File(...)):

    image_path = f"temp_{file.filename}"

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf_path = "converted.pdf"

    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(image_path))

    os.remove(image_path)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="converted.pdf"
    )

# PDF TO JPG
@app.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(pdf_path)

    page = pdf.load_page(0)

    pix = page.get_pixmap()

    image_path = "converted.jpg"

    pix.save(image_path)

    pdf.close()

    os.remove(pdf_path)

    return FileResponse(
        image_path,
        media_type="image/jpeg",
        filename="converted.jpg"
    )

# MERGE PDF
@app.post("/merge-pdf")
async def merge_pdf(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    merger = PdfMerger()

    merger.append(pdf_path)

    output_path = "merged.pdf"

    merger.write(output_path)
    merger.close()

    os.remove(pdf_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="merged.pdf"
    )

# SPLIT PDF
@app.post("/split-pdf")
async def split_pdf(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(pdf_path)

    page = pdf.load_page(0)

    new_pdf = fitz.open()

    new_pdf.insert_pdf(pdf, from_page=0, to_page=0)

    output_path = "split.pdf"

    new_pdf.save(output_path)

    pdf.close()
    new_pdf.close()

    os.remove(pdf_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="split.pdf"
    )

# COMPRESS PDF
@app.post("/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output_path = "compressed.pdf"

    shutil.copy(pdf_path, output_path)

    os.remove(pdf_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="compressed.pdf"
    )

# PROTECT PDF
@app.post("/protect-pdf")
async def protect_pdf(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output_path = "protected.pdf"

    shutil.copy(pdf_path, output_path)

    os.remove(pdf_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="protected.pdf"
    )

# UNLOCK PDF
@app.post("/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...)):

    pdf_path = f"temp_{file.filename}"

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output_path = "unlocked.pdf"

    shutil.copy(pdf_path, output_path)

    os.remove(pdf_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename="unlocked.pdf"
    )
```
