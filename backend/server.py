from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Backend running"}


def save_upload(file: UploadFile):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filepath


@app.post("/api/pdf/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename=file.filename)


@app.post("/api/pdf/jpg-to-pdf")
async def jpg_to_pdf(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="converted.pdf")


@app.post("/api/pdf/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="image.jpg")


@app.post("/api/pdf/merge-pdf")
async def merge_pdf(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="merged.pdf")


@app.post("/api/pdf/split-pdf")
async def split_pdf(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="split.pdf")


@app.post("/api/pdf/compress-pdf")
async def compress_pdf(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="compressed.pdf")


@app.post("/api/pdf/protect-pdf")
async def protect_pdf(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="protected.pdf")


@app.post("/api/pdf/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...)):
    filepath = save_upload(file)
    return FileResponse(filepath, filename="unlocked.pdf")
