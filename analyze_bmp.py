import json
import struct
import os

def analyze_bmp(bmp_path, output_path):
    try:
        with open(bmp_path, 'rb') as f:
            # BMP Header
            header = f.read(14)
            if header[:2] != b'BM':
                print("Not a valid BMP file")
                return
            
            pixel_offset = struct.unpack('<I', header[10:14])[0]
            
            # DIB Header
            dib_header = f.read(40)
            width = struct.unpack('<i', dib_header[4:8])[0]
            height = struct.unpack('<i', dib_header[8:12])[0]
            bpp = struct.unpack('<H', dib_header[14:16])[0]
            
            if bpp not in [24, 32]:
                print(f"Unsupported BPP: {bpp}. Only 24 and 32 are supported.")
                return

            # Move to pixel data
            f.seek(pixel_offset)
            
            row_padding = (4 - (width * (bpp // 8)) % 4) % 4
            
            path_points = []
            step = 10 # Scan every 10th row
            
            # BMP stores pixels bottom-to-top usually
            # We will read all and then process
            
            pixels = []
            for y in range(height):
                row = []
                for x in range(width):
                    b = f.read(1)[0]
                    g = f.read(1)[0]
                    r = f.read(1)[0]
                    a = 255
                    if bpp == 32:
                        a = f.read(1)[0]
                    
                    row.append((r, g, b, a))
                
                f.read(row_padding)
                pixels.append(row)
            
            # Reverse rows to get top-to-bottom
            pixels.reverse()
            
            for y in range(0, height, step):
                x_sum = 0
                count = 0
                
                for x in range(width):
                    r, g, b, a = pixels[y][x]
                    
                    # Check for non-transparent or colored pixel
                    # Assuming the path is drawn on a transparent background
                    # If converted from PNG, transparency might be lost or converted to white/black depending on sips
                    # Let's assume the path is NOT white (255, 255, 255) if background is white
                    # Or check alpha if preserved (BMP v3 usually doesn't support alpha well unless v4/v5)
                    
                    # Let's check for "not white" and "not black" if it's a drawing?
                    # Or just check for "colored" pixels?
                    
                    # Heuristic: If R, G, B are not all 255 (white) and not all 0 (black)
                    # Or if alpha is used.
                    
                    is_path = False
                    if bpp == 32 and a > 0:
                        is_path = True
                    elif bpp == 24:
                        # Assuming white background
                        if r < 250 or g < 250 or b < 250:
                            is_path = True
                            
                    if is_path:
                        x_sum += x
                        count += 1
                
                if count > 0:
                    avg_x = x_sum / count
                    norm_x = avg_x / width
                    norm_y = y / height
                    path_points.append({'x': norm_x, 'y': norm_y})
            
            with open(output_path, 'w') as out:
                json.dump(path_points, out)
                
            print(f"Successfully extracted {len(path_points)} points to {output_path}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    base_dir = "/Users/camilasaldivia/Desktop/Clases/Data visualization study/class11/gravity"
    bmp_file = os.path.join(base_dir, "base.bmp")
    output_file = os.path.join(base_dir, "path_data.json")
    
    analyze_bmp(bmp_file, output_file)
