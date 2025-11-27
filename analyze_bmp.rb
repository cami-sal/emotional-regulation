require 'json'

def analyze_bmp(bmp_path, output_path)
  File.open(bmp_path, 'rb') do |f|
    # BMP Header
    header = f.read(14)
    if header[0, 2] != 'BM'
      puts "Not a valid BMP file"
      return
    end
    
    pixel_offset = header[10, 4].unpack('V')[0]
    
    # DIB Header
    dib_header = f.read(40)
    width = dib_header[4, 4].unpack('l')[0]
    height = dib_header[8, 4].unpack('l')[0]
    bpp = dib_header[14, 2].unpack('v')[0]
    
    if ![24, 32].include?(bpp)
      puts "Unsupported BPP: #{bpp}"
      return
    end
    
    # Move to pixel data
    f.seek(pixel_offset)
    
    row_padding = (4 - (width * (bpp / 8)) % 4) % 4
    
    pixels = []
    
    # Read pixels (stored bottom-to-top)
    height.abs.times do
      row = []
      width.times do
        b = f.read(1).ord
        g = f.read(1).ord
        r = f.read(1).ord
        a = 255
        if bpp == 32
          a = f.read(1).ord
        end
        row << [r, g, b, a]
      end
      f.read(row_padding)
      pixels << row
    end
    
    # Reverse if height is positive (bottom-to-top)
    pixels.reverse! if height > 0
    
    path_points = []
    step = 10
    
    (0...height.abs).step(step) do |y|
      x_sum = 0
      count = 0
      
      width.times do |x|
        r, g, b, a = pixels[y][x]
        
        # Check for non-transparent/colored pixel
        is_path = false
        if bpp == 32 && a > 0
          is_path = true
        elsif bpp == 24
          # Assuming white background, so anything not white is path
          if r < 250 || g < 250 || b < 250
            is_path = true
          end
        end
        
        if is_path
          x_sum += x
          count += 1
        end
      end
      
      if count > 0
        avg_x = x_sum.to_f / count
        norm_x = avg_x / width
        norm_y = y.to_f / height.abs
        path_points << {x: norm_x, y: norm_y}
      end
    end
    
    File.open(output_path, 'w') do |out|
      out.write(JSON.generate(path_points))
    end
    
    puts "Successfully extracted #{path_points.length} points to #{output_path}"
  end
rescue => e
  puts "Error: #{e.message}"
  puts e.backtrace
end

base_dir = "/Users/camilasaldivia/Desktop/Clases/Data visualization study/class11/gravity"
bmp_file = File.join(base_dir, "base.bmp")
output_file = File.join(base_dir, "path_data.json")

analyze_bmp(bmp_file, output_file)
