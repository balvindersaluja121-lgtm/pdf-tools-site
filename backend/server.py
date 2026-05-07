from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
from PyPDF2 import PdfMerger
import fitz
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "PDF Tools API Running"}


# PDF TO WORD
@app.post("/pdf/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    return FileResponse(path, filename=file.filename)


# JPG TO PDF
@app.post("/pdf/jpg-to-pdf")
async def jpg_to_pdf(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")

    output = f"{UPLOAD_DIR}/converted.pdf"
    image.save(output)

    return FileResponse(output, filename="converted.pdf")


# PDF TO JPG
@app.post("/pdf/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    pdf_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    doc = fitz.open(pdf_path)
    page = doc.load_page(0)

    pix = page.get_pixmap()

    output = f"{UPLOAD_DIR}/page.jpg"
    pix.save(output)

    return FileResponse(output, filename="page.jpg")


# MERGE PDF
@app.post("/pdf/merge-pdf")
async def merge_pdf(files: list[UploadFile] = File(...)):
    merger = PdfMerger()

    for file in files:
        path = f"{UPLOAD_DIR}/{file.filename}"

        with open(path, "wb") as f:
            f.write(await file.read())

        merger.append(path)

    output = f"{UPLOAD_DIR}/merged.pdf"

    merger.write(output)
    merger.close()

    return FileResponse(output, filename="merged.pdf")


# SPLIT PDF
@app.post("/pdf/split-pdf")
async def split_pdf(file: UploadFile = File(...)):
    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    return FileResponse(path, filename=file.filename)


# COMPRESS PDF
@app.post("/pdf/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):
    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    return FileResponse(path, filename=file.filename)


# PROTECT PDF
@app.post("/pdf/protect-pdf")
async def protect_pdf(file: UploadFile = File(...)):
    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    return FileResponse(path, filename=file.filename)


# UNLOCK PDF
@app.post("/pdf/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...)):
    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    return FileResponse(path, filename=file.filename)
