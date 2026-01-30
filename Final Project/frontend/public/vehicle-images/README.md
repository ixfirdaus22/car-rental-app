# Vehicle Images Folder

This folder contains vehicle images for the car rental system.

## Usage

When adding or updating a vehicle, you can specify the image in one of the following ways:

1. **Just filename**: `Accord.jpg`
   - Will automatically use: `/vehicle-images/Accord.jpg`

2. **Full path**: `/vehicle-images/Accord.jpg`
   - Will use the exact path provided

3. **External URL**: `https://example.com/image.jpg`
   - Will use the external URL as-is

## Available Images

- Accord.jpg
- creta.jpg
- Fortuner.jpg
- Maruti.jpg
- Nexon.jpg
- Swift.jpg
- XUV.jpg
- XUV500.jpg

## Adding New Images

1. Place your image file in this folder (`/public/vehicle-images/`)
2. When adding/editing a vehicle, enter just the filename (e.g., `mycar.jpg`)
3. The system will automatically use `/vehicle-images/mycar.jpg`

## Supported Formats

- JPG/JPEG
- PNG
- GIF
- WebP
