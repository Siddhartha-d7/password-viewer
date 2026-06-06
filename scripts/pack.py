import os
import zipfile

def pack_extension():
    zip_name = "revealpass-extension.zip"
    print(f"Creating Chrome Web Store distribution bundle: {zip_name}...")
    
    # List of files/folders to include in the public distribution
    included_files = [
        "manifest.json",
    ]
    
    included_dirs = [
        "background",
        "config",
        "content",
        "popup",
        "icons"
    ]
    
    # Create the zip file
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Pack top-level files
        for file in included_files:
            if os.path.exists(file):
                zipf.write(file)
                print(f" -> Added: {file}")
            else:
                print(f" [WARNING] File not found: {file}")
                
        # Pack directories
        for directory in included_dirs:
            if os.path.exists(directory):
                for root, _, files in os.walk(directory):
                    for file in files:
                        file_path = os.path.join(root, file)
                        # Avoid adding temp or backup files
                        if not file.endswith('.tmp') and not file.startswith('.'):
                            # The path inside the zip should be relative to the workspace root
                            zipf.write(file_path, os.path.relpath(file_path, '.'))
                            print(f" -> Added: {file_path}")
            else:
                print(f" [WARNING] Directory not found: {directory}")
                
    print(f"\nSuccessfully created {zip_name}!")
    print("This ZIP file contains only the extension runtime files, ready for uploading.")

if __name__ == "__main__":
    pack_extension()
