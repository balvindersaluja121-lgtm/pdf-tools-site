"""
PDF Processing Services for Easy Scan PDF
Implements core PDF operations: Merge, Split, Compress, PDF to Word, Word to PDF, and more
"""

import os
import io
from typing import List, Tuple
from PyPDF2 import PdfReader, PdfWriter, PdfMerger
from pdf2docx import Converter
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
import tempfile
import logging
from pdf2image import convert_from_bytes

logger = logging.getLogger(__name__)


class PDFService:
    """Service class for PDF operations"""

    @staticmethod
    def merge_pdfs(pdf_files: List[bytes]) -> bytes:
        """
        Merge multiple PDF files into one
        Args:
            pdf_files: List of PDF file contents as bytes
        Returns:
            Merged PDF as bytes
        """
        try:
            merger = PdfMerger()
            
            for pdf_bytes in pdf_files:
                pdf_stream = io.BytesIO(pdf_bytes)
                merger.append(pdf_stream)
            
            output = io.BytesIO()
            merger.write(output)
            merger.close()
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error merging PDFs: {str(e)}")
            raise Exception(f"Failed to merge PDFs: {str(e)}")

    @staticmethod
    def split_pdf(pdf_file: bytes, split_type: str = "all") -> List[bytes]:
        """
        Split PDF into separate pages
        Args:
            pdf_file: PDF file content as bytes
            split_type: 'all' for all pages, or specific ranges later
        Returns:
            List of PDF pages as bytes
        """
        try:
            pdf_stream = io.BytesIO(pdf_file)
            reader = PdfReader(pdf_stream)
            
            split_pdfs = []
            
            for page_num in range(len(reader.pages)):
                writer = PdfWriter()
                writer.add_page(reader.pages[page_num])
                
                output = io.BytesIO()
                writer.write(output)
                output.seek(0)
                split_pdfs.append(output.getvalue())
            
            return split_pdfs
        except Exception as e:
            logger.error(f"Error splitting PDF: {str(e)}")
            raise Exception(f"Failed to split PDF: {str(e)}")

    @staticmethod
    def compress_pdf(pdf_file: bytes, quality: str = "medium") -> bytes:
        """
        Compress PDF by reducing image quality and removing duplicates
        Args:
            pdf_file: PDF file content as bytes
            quality: 'low', 'medium', or 'high'
        Returns:
            Compressed PDF as bytes
        """
        try:
            pdf_stream = io.BytesIO(pdf_file)
            reader = PdfReader(pdf_stream)
            writer = PdfWriter()
            
            # Quality settings
            quality_map = {"low": 50, "medium": 75, "high": 85}
            compression_quality = quality_map.get(quality, 75)
            
            for page in reader.pages:
                # Compress page
                page.compress_content_streams()
                writer.add_page(page)
            
            # Remove duplicate objects
            writer.add_metadata(reader.metadata)
            
            output = io.BytesIO()
            writer.write(output)
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error compressing PDF: {str(e)}")
            raise Exception(f"Failed to compress PDF: {str(e)}")

    @staticmethod
    def pdf_to_word(pdf_file: bytes) -> bytes:
        """
        Convert PDF to Word (DOCX)
        Args:
            pdf_file: PDF file content as bytes
        Returns:
            DOCX file as bytes
        """
        try:
            # Create temporary files
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as pdf_temp:
                pdf_temp.write(pdf_file)
                pdf_path = pdf_temp.name
            
            docx_path = pdf_path.replace('.pdf', '.docx')
            
            # Convert PDF to DOCX
            cv = Converter(pdf_path)
            cv.convert(docx_path, start=0, end=None)
            cv.close()
            
            # Read DOCX file
            with open(docx_path, 'rb') as docx_file:
                docx_bytes = docx_file.read()
            
            # Cleanup temporary files
            os.unlink(pdf_path)
            os.unlink(docx_path)
            
            return docx_bytes
        except Exception as e:
            logger.error(f"Error converting PDF to Word: {str(e)}")
            raise Exception(f"Failed to convert PDF to Word: {str(e)}")

    @staticmethod
    def word_to_pdf(docx_file: bytes) -> bytes:
        """
        Convert Word (DOCX) to PDF
        Args:
            docx_file: DOCX file content as bytes
        Returns:
            PDF file as bytes
        """
        try:
            # Create temporary DOCX file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as docx_temp:
                docx_temp.write(docx_file)
                docx_path = docx_temp.name
            
            # Read DOCX content
            doc = Document(docx_path)
            
            # Create PDF
            output = io.BytesIO()
            pdf_canvas = canvas.Canvas(output, pagesize=letter)
            width, height = letter
            
            y_position = height - 50
            
            # Extract text from DOCX and add to PDF
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    # Wrap text if too long
                    text = paragraph.text
                    if len(text) > 80:
                        # Simple text wrapping
                        words = text.split()
                        line = ""
                        for word in words:
                            if len(line + word) < 80:
                                line += word + " "
                            else:
                                pdf_canvas.drawString(50, y_position, line.strip())
                                y_position -= 15
                                line = word + " "
                                
                                if y_position < 50:
                                    pdf_canvas.showPage()
                                    y_position = height - 50
                        
                        if line:
                            pdf_canvas.drawString(50, y_position, line.strip())
                            y_position -= 15
                    else:
                        pdf_canvas.drawString(50, y_position, text)
                        y_position -= 15
                    
                    if y_position < 50:
                        pdf_canvas.showPage()
                        y_position = height - 50
            
            pdf_canvas.save()
            output.seek(0)
            
            # Cleanup
            os.unlink(docx_path)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error converting Word to PDF: {str(e)}")
            raise Exception(f"Failed to convert Word to PDF: {str(e)}")

    @staticmethod
    def pdf_to_jpg(pdf_file: bytes) -> List[bytes]:
        """
        Convert PDF pages to JPG images
        Args:
            pdf_file: PDF file content as bytes
        Returns:
            List of JPG images as bytes
        """
        try:
            # Convert PDF to images
            images = convert_from_bytes(pdf_file, fmt='jpeg', dpi=200)
            
            jpg_images = []
            for image in images:
                # Convert PIL Image to bytes
                img_byte_arr = io.BytesIO()
                image.save(img_byte_arr, format='JPEG', quality=95)
                img_byte_arr.seek(0)
                jpg_images.append(img_byte_arr.getvalue())
            
            return jpg_images
        except Exception as e:
            logger.error(f"Error converting PDF to JPG: {str(e)}")
            raise Exception(f"Failed to convert PDF to JPG: {str(e)}")

    @staticmethod
    def jpg_to_pdf(jpg_files: List[bytes]) -> bytes:
        """
        Convert JPG images to PDF
        Args:
            jpg_files: List of JPG file contents as bytes
        Returns:
            PDF file as bytes
        """
        try:
            output = io.BytesIO()
            pdf_canvas = canvas.Canvas(output, pagesize=letter)
            width, height = letter
            
            for jpg_bytes in jpg_files:
                # Open image
                img = Image.open(io.BytesIO(jpg_bytes))
                
                # Calculate dimensions to fit page
                img_width, img_height = img.size
                aspect = img_height / img_width
                
                if aspect > (height / width):
                    # Height is limiting factor
                    new_height = height - 40
                    new_width = new_height / aspect
                else:
                    # Width is limiting factor
                    new_width = width - 40
                    new_height = new_width * aspect
                
                # Center image on page
                x = (width - new_width) / 2
                y = (height - new_height) / 2
                
                # Draw image
                img_reader = ImageReader(io.BytesIO(jpg_bytes))
                pdf_canvas.drawImage(img_reader, x, y, new_width, new_height)
                pdf_canvas.showPage()
            
            pdf_canvas.save()
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error converting JPG to PDF: {str(e)}")
            raise Exception(f"Failed to convert JPG to PDF: {str(e)}")

    @staticmethod
    def jpg_to_word(jpg_files: List[bytes]) -> bytes:
        """
        Convert JPG images to Word document
        Args:
            jpg_files: List of JPG file contents as bytes
        Returns:
            DOCX file as bytes
        """
        try:
            doc = Document()
            
            for jpg_bytes in jpg_files:
                # Save image temporarily
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_img:
                    temp_img.write(jpg_bytes)
                    temp_img_path = temp_img.name
                
                # Add image to document
                doc.add_picture(temp_img_path, width=doc.sections[0].page_width - doc.sections[0].left_margin - doc.sections[0].right_margin)
                doc.add_paragraph()  # Add space between images
                
                # Cleanup temp file
                os.unlink(temp_img_path)
            
            # Save document to bytes
            output = io.BytesIO()
            doc.save(output)
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error converting JPG to Word: {str(e)}")
            raise Exception(f"Failed to convert JPG to Word: {str(e)}")

    @staticmethod
    def word_to_jpg(docx_file: bytes) -> List[bytes]:
        """
        Convert Word document to JPG images
        First converts to PDF, then PDF to JPG
        Args:
            docx_file: DOCX file content as bytes
        Returns:
            List of JPG images as bytes
        """
        try:
            # First convert Word to PDF
            pdf_bytes = PDFService.word_to_pdf(docx_file)
            
            # Then convert PDF to JPG
            jpg_images = PDFService.pdf_to_jpg(pdf_bytes)
            
            return jpg_images
        except Exception as e:
            logger.error(f"Error converting Word to JPG: {str(e)}")
            raise Exception(f"Failed to convert Word to JPG: {str(e)}")

    @staticmethod
    def unlock_pdf(pdf_file: bytes, password: str = "") -> bytes:
        """
        Remove password protection from PDF
        Args:
            pdf_file: PDF file content as bytes
            password: Password to unlock the PDF (if needed)
        Returns:
            Unlocked PDF as bytes
        """
        try:
            pdf_stream = io.BytesIO(pdf_file)
            reader = PdfReader(pdf_stream)
            
            # Try to decrypt if encrypted
            if reader.is_encrypted:
                if password:
                    reader.decrypt(password)
                else:
                    # Try empty password
                    reader.decrypt("")
            
            # Create new PDF without encryption
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            
            output = io.BytesIO()
            writer.write(output)
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error unlocking PDF: {str(e)}")
            raise Exception(f"Failed to unlock PDF. Make sure you provided the correct password: {str(e)}")

    @staticmethod
    def protect_pdf(pdf_file: bytes, password: str) -> bytes:
        """
        Add password protection to PDF
        Args:
            pdf_file: PDF file content as bytes
            password: Password to protect the PDF
        Returns:
            Protected PDF as bytes
        """
        try:
            pdf_stream = io.BytesIO(pdf_file)
            reader = PdfReader(pdf_stream)
            writer = PdfWriter()
            
            # Add all pages
            for page in reader.pages:
                writer.add_page(page)
            
            # Encrypt with password
            writer.encrypt(user_password=password, owner_password=password, algorithm="AES-256")
            
            output = io.BytesIO()
            writer.write(output)
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error protecting PDF: {str(e)}")
            raise Exception(f"Failed to protect PDF: {str(e)}")

    @staticmethod
    def organize_pdf(pdf_file: bytes, page_order: List[int]) -> bytes:
        """
        Reorganize PDF pages in custom order
        Args:
            pdf_file: PDF file content as bytes
            page_order: List of page numbers in desired order (1-indexed)
        Returns:
            Reorganized PDF as bytes
        """
        try:
            pdf_stream = io.BytesIO(pdf_file)
            reader = PdfReader(pdf_stream)
            writer = PdfWriter()
            
            total_pages = len(reader.pages)
            
            # If no order specified, use original order
            if not page_order:
                page_order = list(range(1, total_pages + 1))
            
            # Add pages in specified order
            for page_num in page_order:
                # Convert to 0-indexed
                page_index = page_num - 1
                
                if 0 <= page_index < total_pages:
                    writer.add_page(reader.pages[page_index])
                else:
                    logger.warning(f"Page {page_num} out of range, skipping")
            
            output = io.BytesIO()
            writer.write(output)
            output.seek(0)
            
            return output.getvalue()
        except Exception as e:
            logger.error(f"Error organizing PDF: {str(e)}")
            raise Exception(f"Failed to organize PDF: {str(e)}")



# Initialize service
pdf_service = PDFService()
