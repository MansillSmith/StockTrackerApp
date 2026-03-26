import sys
import base64
import os

def image_to_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            return encoded_string.decode('utf-8')
    except FileNotFoundError:
        print(f"Error: File '{image_path}' not found.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_to_base64.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    base64_string = image_to_base64(image_path)
    print(base64_string)