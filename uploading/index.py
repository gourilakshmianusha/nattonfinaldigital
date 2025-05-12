from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
import requests
import pandas as pd

app = Flask(__name__)

BASE_FOLDER = os.path.join(os.getcwd(), "download_files")
os.makedirs(BASE_FOLDER, exist_ok=True)

def download_image(image_url, folder_path, filename):
    try:
        # Add a user-agent to mimic a browser request
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        img_data = requests.get(image_url, headers=headers, timeout=10)
        if img_data.status_code == 200:
            with open(os.path.join(folder_path, filename), 'wb') as f:
                f.write(img_data.content)
            print(f"Downloaded {filename}")
            return True
        else:
            print(f"Failed to download {image_url}")
            return False
    except Exception as e:
        print(f"Error downloading image: {e}")
        return False

def get_shopee_images(product_url):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in background (without UI)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    driver.get(product_url)

    # Wait until the images are visible (maximum wait time of 10 seconds)
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'img')))
    except Exception as e:
        print(f"Error: Timed out while waiting for images to load. {e}")
        driver.quit()
        return []

    image_urls = []

    # Find all image elements (look for 'src' attributes)
    img_elements = driver.find_elements(By.CSS_SELECTOR, 'img')
    for img in img_elements:
        src = img.get_attribute('src')
        if src and any(ext in src for ext in ['.jpg', '.jpeg', '.png', '.webp']):
            # Exclude logos and brand images by checking for common keywords
            if 'logo' not in src.lower() and 'brand' not in src.lower() and 'icon' not in src.lower():
                image_urls.append(src)
            if len(image_urls) >= 5:  # Limit to 5 images
                break

    driver.quit()

    print(f"Found {len(image_urls)} images for product '{product_url}'")
    return image_urls

@app.route('/fetch-from-excel', methods=['POST'])
def fetch_from_excel():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    df = pd.read_excel(file, header=None)

    results = []
    for index, row in df.iterrows():
        try:
            # Fetching the SKU sequence from column C (index 2)
            sku_sequence = str(row[2]).strip()  # Column C is index 2 (0-based)
            sdp_link = str(row[5]).strip()  # Column F is index 5 (0-based)

            if not sku_sequence or not sdp_link or sdp_link.lower() == 'nan':
                continue

            print(f"Processing SKU Sequence: {sku_sequence} - SDP Link: {sdp_link}")

            # Folder will be created using the SKU sequence from column C
            sku_folder = os.path.join(BASE_FOLDER, sku_sequence)  # Use SKU sequence as the folder name
            os.makedirs(sku_folder, exist_ok=True)

            image_urls = get_shopee_images(sdp_link)
            downloaded_files = []

            for idx, url in enumerate(image_urls):
                ext = os.path.splitext(url.split("?")[0])[-1]
                if not ext.startswith('.'):
                    ext = '.jpg'
                filename = f"image_{idx + 1}{ext}"
                if download_image(url, sku_folder, filename):
                    downloaded_files.append(filename)

            results.append({
                'sku_sequence': sku_sequence,
                'sdp_link': sdp_link,
                'sku_folder': sku_folder,
                'images_downloaded': downloaded_files
            })
        except Exception as e:
            results.append({
                'sku_sequence': sku_sequence,
                'sdp_link': sdp_link,
                'sku_folder': None,
                'images_downloaded': [],
                'error': str(e)
            })

    return jsonify({
        'message': 'Images downloaded successfully.',
        'results': results
    })

@app.route('/')
def home():
    return '''
    <h2>Shopee Product Image Downloader</h2>
    <form method="post" action="/fetch-from-excel" enctype="multipart/form-data">
    <label>Select Excel File (SKU Sequence in column C and SDP_LINK in column F):</label><br>
    <input type="file" name="file"><br><br>
    <button type="submit">Upload & Download Images</button>
    </form>
    '''

if __name__ == '__main__':
    app.run(debug=True, port=5002)
