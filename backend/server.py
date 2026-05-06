from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List
import shutil
import fitz
import os

from docx import Document
from PIL import Image
from PyPDF2 import PdfMerger, PdfReader, PdfWriter

app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {"message": "Backend Running 🚀"}

# =========================
# PDF TO WORD
# =========================
@app.post("/api/pdf/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"
    output_path = "converted.docx"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(input_path)

    doc = Document()

    for page in pdf:
        text = page.get_text()

        if text.strip():
            doc.add_paragraph(text)
        else:
            doc.add_paragraph("[No readable text found on this page]")

    pdf.close()

    doc.save(output_path)

    os.remove(input_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )

# =========================
# JPG TO PDF
# =========================
@app.post("/api/pdf/jpg-to-pdf")
async def jpg_to_pdf(files: List[UploadFile] = File(...)):

    image_list = []

    for file in files:
        image_path = f"temp_{file.filename}"

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image = Image.open(image_path).convert("RGB")
        image_list.append(image)

    output_path = "converted.pdf"

    if image_list:
        image_list[0].save(
            output_path,
            save_all=True,
            append_images=image_list[1:]
        )

    return FileResponse(output_path, filename="converted.pdf")

# =========================
# PDF TO JPG
# =========================
@app.post("/api/pdf/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(input_path)

    page = pdf[0]
    pix = page.get_pixmap()

    output_path = "converted.jpg"

    pix.save(output_path)

    pdf.close()

    return FileResponse(output_path, filename="converted.jpg")

# =========================
# MERGE PDF
# =========================
@app.post("/api/pdf/merge-pdf")
async def merge_pdf(files: List[UploadFile] = File(...)):

    merger = PdfMerger()

    for file in files:
        temp_path = f"temp_{file.filename}"

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        merger.append(temp_path)

    output_path = "merged.pdf"

    merger.write(output_path)
    merger.close()

    return FileResponse(output_path, filename="merged.pdf")

# =========================
# SPLIT PDF
# =========================
@app.post("/api/pdf/split-pdf")
async def split_pdf(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    reader = PdfReader(input_path)

    writer = PdfWriter()

    writer.add_page(reader.pages[0])

    output_path = "split.pdf"

    with open(output_path, "wb") as output_file:
        writer.write(output_file)

    return FileResponse(output_path, filename="split.pdf")

# =========================
# COMPRESS PDF
# =========================
@app.post("/api/pdf/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(input_path)

    output_path = "compressed.pdf"

    pdf.save(output_path, garbage=4, deflate=True)

    pdf.close()

    return FileResponse(output_path, filename="compressed.pdf")

# =========================
# PROTECT PDF
# =========================
@app.post("/api/pdf/protect-pdf")
async def protect_pdf(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(input_path)

    output_path = "protected.pdf"

    pdf.save(
        output_path,
        encryption=fitz.PDF_ENCRYPT_AES_256,
        owner_pw="admin123",
        user_pw="1234"
    )

    pdf.close()

    return FileResponse(output_path, filename="protected.pdf")

# =========================
# UNLOCK PDF
# =========================
@app.post("/api/pdf/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...)):

    input_path = f"temp_{file.filename}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    pdf = fitz.open(input_path)

    if pdf.needs_pass:
        pdf.authenticate("1234")

    output_path = "unlocked.pdf"

    pdf.save(output_path)

    pdf.close()

    return FileResponse(output_path, filename="unlocked.pdf")
