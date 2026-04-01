"""
PDF Processing API Routes
Handles file upload and processing for PDF tools
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from typing import List
import logging
from pdf_services import pdf_service

logger = logging.getLogger(__name__)

pdf_router = APIRouter(prefix="/api/pdf", tags=["PDF Tools"])


@pdf_router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """
    Merge multiple PDF files into one
    """
    try:
        if len(files) < 2:
            raise HTTPException(status_code=400, detail="At least 2 PDF files required")
        
        # Read all PDF files
        pdf_contents = []
        for file in files:
            if not file.filename.endswith('.pdf'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
            
            content = await file.read()
            pdf_contents.append(content)
        
        # Merge PDFs
        merged_pdf = pdf_service.merge_pdfs(pdf_contents)
        
        # Return merged PDF
        return Response(
            content=merged_pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=merged.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in merge_pdfs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to merge PDFs: {str(e)}")


@pdf_router.post("/split")
async def split_pdf(file: UploadFile = File(...)):
    """
    Split PDF into separate pages
    Returns a ZIP file containing all pages
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        content = await file.read()
        
        # Split PDF
        split_pdfs = pdf_service.split_pdf(content)
        
        # Create ZIP file
        import zipfile
        import io
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for i, pdf_bytes in enumerate(split_pdfs, 1):
                zip_file.writestr(f"page_{i}.pdf", pdf_bytes)
        
        zip_buffer.seek(0)
        
        # Return ZIP file
        return Response(
            content=zip_buffer.getvalue(),
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=split_pages.zip"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in split_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to split PDF: {str(e)}")


@pdf_router.post("/compress")
async def compress_pdf(file: UploadFile = File(...), quality: str = "medium"):
    """
    Compress PDF file
    Quality options: low, medium, high
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        content = await file.read()
        original_size = len(content)
        
        # Compress PDF
        compressed_pdf = pdf_service.compress_pdf(content, quality)
        compressed_size = len(compressed_pdf)
        
        # Calculate compression ratio
        compression_ratio = round((1 - compressed_size / original_size) * 100, 2)
        
        logger.info(f"Compressed PDF: {original_size} -> {compressed_size} bytes ({compression_ratio}% reduction)")
        
        # Return compressed PDF
        return Response(
            content=compressed_pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=compressed.pdf",
                "X-Compression-Ratio": str(compression_ratio)
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in compress_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to compress PDF: {str(e)}")


@pdf_router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    """
    Convert PDF to Word (DOCX)
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        content = await file.read()
        
        # Convert PDF to Word
        docx_content = pdf_service.pdf_to_word(content)
        
        # Return DOCX file
        filename = file.filename.replace('.pdf', '.docx')
        return Response(
            content=docx_content,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in pdf_to_word: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to Word: {str(e)}")


@pdf_router.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    """
    Convert PDF to JPG images
    Returns a ZIP file containing all images
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        content = await file.read()
        
        # Convert PDF to JPG
        jpg_images = pdf_service.pdf_to_jpg(content)
        
        # Create ZIP file
        import zipfile
        import io
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for i, jpg_bytes in enumerate(jpg_images, 1):
                zip_file.writestr(f"page_{i}.jpg", jpg_bytes)
        
        zip_buffer.seek(0)
        
        return Response(
            content=zip_buffer.getvalue(),
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=pdf_images.zip"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in pdf_to_jpg: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to JPG: {str(e)}")


@pdf_router.post("/jpg-to-pdf")
async def jpg_to_pdf(files: List[UploadFile] = File(...)):
    """
    Convert JPG images to PDF
    """
    try:
        if len(files) < 1:
            raise HTTPException(status_code=400, detail="At least 1 JPG file required")
        
        # Read all JPG files
        jpg_contents = []
        for file in files:
            if not file.filename.lower().endswith(('.jpg', '.jpeg')):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a JPG")
            
            content = await file.read()
            jpg_contents.append(content)
        
        # Convert to PDF
        pdf_content = pdf_service.jpg_to_pdf(jpg_contents)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=converted.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in jpg_to_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to convert JPG to PDF: {str(e)}")


@pdf_router.post("/jpg-to-word")
async def jpg_to_word(files: List[UploadFile] = File(...)):
    """
    Convert JPG images to Word document
    """
    try:
        if len(files) < 1:
            raise HTTPException(status_code=400, detail="At least 1 JPG file required")
        
        # Read all JPG files
        jpg_contents = []
        for file in files:
            if not file.filename.lower().endswith(('.jpg', '.jpeg')):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a JPG")
            
            content = await file.read()
            jpg_contents.append(content)
        
        # Convert to Word
        docx_content = pdf_service.jpg_to_word(jpg_contents)
        
        return Response(
            content=docx_content,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": "attachment; filename=converted.docx"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in jpg_to_word: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to convert JPG to Word: {str(e)}")


@pdf_router.post("/word-to-jpg")
async def word_to_jpg(file: UploadFile = File(...)):
    """
    Convert Word document to JPG images
    Returns a ZIP file containing all images
    """
    try:
        if not file.filename.endswith('.docx'):
            raise HTTPException(status_code=400, detail="File must be a DOCX file")
        
        content = await file.read()
        
        # Convert to JPG
        jpg_images = pdf_service.word_to_jpg(content)
        
        # Create ZIP file
        import zipfile
        import io
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for i, jpg_bytes in enumerate(jpg_images, 1):
                zip_file.writestr(f"page_{i}.jpg", jpg_bytes)
        
        zip_buffer.seek(0)
        
        return Response(
            content=zip_buffer.getvalue(),
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=word_images.zip"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in word_to_jpg: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to convert Word to JPG: {str(e)}")


@pdf_router.post("/unlock-pdf")
async def unlock_pdf(file: UploadFile = File(...), password: str = ""):
    """
    Remove password protection from PDF
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        content = await file.read()
        
        # Unlock PDF
        unlocked_pdf = pdf_service.unlock_pdf(content, password)
        
        return Response(
            content=unlocked_pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=unlocked.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in unlock_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to unlock PDF: {str(e)}")


@pdf_router.post("/protect-pdf")
async def protect_pdf(file: UploadFile = File(...), password: str = ""):
    """
    Add password protection to PDF
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        if not password:
            raise HTTPException(status_code=400, detail="Password is required")
        
        content = await file.read()
        
        # Protect PDF
        protected_pdf = pdf_service.protect_pdf(content, password)
        
        return Response(
            content=protected_pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=protected.pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in protect_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to protect PDF: {str(e)}")


@pdf_router.post("/organize-pdf")
async def organize_pdf(file: UploadFile = File(...)):
    """
    Reorganize PDF pages
    For now, reverses the page order as a demo
    """
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        content = await file.read()
        
        # Get page count
        import io as io_module
        from PyPDF2 import PdfReader
        reader = PdfReader(io_module.BytesIO(content))
        total_pages = len(reader.pages)
        
        # Reverse order for demo (you can customize this)
        page_order = list(range(total_pages, 0, -1))
        
        # Organize PDF
        organized_pdf = pdf_service.organize_pdf(content, page_order)
        
        return Response(
            content=organized_pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=organized.pdf",
                "X-Page-Order": "reversed"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in organize_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to organize PDF: {str(e)}")



@pdf_router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    """
    Convert Word (DOCX) to PDF
    """
    try:
        if not file.filename.endswith('.docx'):
            raise HTTPException(status_code=400, detail="File must be a DOCX file")
        
        content = await file.read()
        
        # Convert Word to PDF
        pdf_content = pdf_service.word_to_pdf(content)
        
        # Return PDF file
        filename = file.filename.replace('.docx', '.pdf')
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in word_to_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to convert Word to PDF: {str(e)}")


@pdf_router.get("/health")
async def health_check():
    """
    Health check endpoint for PDF services
    """
    return {
        "status": "healthy",
        "services": {
            "merge": "available",
            "split": "available",
            "compress": "available",
            "pdf_to_word": "available",
            "word_to_pdf": "available",
            "pdf_to_jpg": "available",
            "jpg_to_pdf": "available",
            "jpg_to_word": "available",
            "word_to_jpg": "available",
            "unlock_pdf": "available",
            "protect_pdf": "available",
            "organize_pdf": "available"
        }
    }
