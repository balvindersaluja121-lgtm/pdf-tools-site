#!/usr/bin/env python3
"""
Additional Edge Case Tests for PDF Processing Endpoints
Tests error handling and edge cases
"""

import requests
import io

BACKEND_URL = "https://pdf-converter-168.preview.emergentagent.com/api"

def test_edge_cases():
    """Test edge cases and error handling"""
    print("=" * 60)
    print("PDF PROCESSING EDGE CASE TESTS")
    print("=" * 60)
    
    results = []
    
    # Test 1: Merge with only one file (should fail)
    print("Test 1: Merge with only one file...")
    try:
        files = [('files', ('test.pdf', io.BytesIO(b'fake pdf'), 'application/pdf'))]
        response = requests.post(f"{BACKEND_URL}/pdf/merge", files=files, timeout=30)
        
        if response.status_code == 400:
            print("✅ PASS: Correctly rejected merge with only one file")
            results.append(True)
        else:
            print(f"❌ FAIL: Expected 400, got {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Error testing single file merge: {e}")
        results.append(False)
    
    # Test 2: Upload non-PDF file to PDF endpoint
    print("\nTest 2: Upload non-PDF file to merge endpoint...")
    try:
        files = [
            ('files', ('test.txt', io.BytesIO(b'not a pdf'), 'text/plain')),
            ('files', ('test2.txt', io.BytesIO(b'also not a pdf'), 'text/plain'))
        ]
        response = requests.post(f"{BACKEND_URL}/pdf/merge", files=files, timeout=30)
        
        if response.status_code == 400:
            print("✅ PASS: Correctly rejected non-PDF files")
            results.append(True)
        else:
            print(f"❌ FAIL: Expected 400, got {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Error testing non-PDF upload: {e}")
        results.append(False)
    
    # Test 3: Upload non-DOCX file to word-to-pdf endpoint
    print("\nTest 3: Upload non-DOCX file to word-to-pdf endpoint...")
    try:
        files = {'file': ('test.txt', io.BytesIO(b'not a docx'), 'text/plain')}
        response = requests.post(f"{BACKEND_URL}/pdf/word-to-pdf", files=files, timeout=30)
        
        if response.status_code == 400:
            print("✅ PASS: Correctly rejected non-DOCX file")
            results.append(True)
        else:
            print(f"❌ FAIL: Expected 400, got {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Error testing non-DOCX upload: {e}")
        results.append(False)
    
    # Test 4: Test compression with different quality levels
    print("\nTest 4: Test compression with different quality levels...")
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        
        # Create a sample PDF
        buffer = io.BytesIO()
        pdf_canvas = canvas.Canvas(buffer, pagesize=letter)
        pdf_canvas.drawString(50, 750, "Test PDF for quality testing")
        pdf_canvas.save()
        buffer.seek(0)
        pdf_content = buffer.getvalue()
        
        qualities = ['low', 'medium', 'high']
        quality_results = []
        
        for quality in qualities:
            files = {'file': ('test.pdf', io.BytesIO(pdf_content), 'application/pdf')}
            data = {'quality': quality}
            response = requests.post(f"{BACKEND_URL}/pdf/compress", files=files, data=data, timeout=30)
            
            if response.status_code == 200:
                quality_results.append(f"{quality}: ✅")
            else:
                quality_results.append(f"{quality}: ❌")
        
        print(f"Quality test results: {', '.join(quality_results)}")
        results.append(all('✅' in result for result in quality_results))
        
    except Exception as e:
        print(f"❌ FAIL: Error testing quality levels: {e}")
        results.append(False)
    
    # Test 5: Test with empty file
    print("\nTest 5: Test with empty file...")
    try:
        files = {'file': ('empty.pdf', io.BytesIO(b''), 'application/pdf')}
        response = requests.post(f"{BACKEND_URL}/pdf/split", files=files, timeout=30)
        
        # Should fail gracefully
        if response.status_code in [400, 500]:
            print("✅ PASS: Correctly handled empty file")
            results.append(True)
        else:
            print(f"❌ FAIL: Unexpected response for empty file: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Error testing empty file: {e}")
        results.append(False)
    
    print("\n" + "=" * 60)
    print("EDGE CASE TEST SUMMARY")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Total Edge Case Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    return passed == total

if __name__ == "__main__":
    success = test_edge_cases()
    
    if success:
        print("\n🎉 All edge case tests passed!")
        exit(0)
    else:
        print("\n⚠️  Some edge case tests failed.")
        exit(1)