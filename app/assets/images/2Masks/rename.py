import os
import shutil

contents = os.listdir(".")
dirs = [d for d in contents if "." not in d]

for dir in dirs[2:]:
	print dir
	all_images = os.listdir(dir)
	images = [image for image in all_images if 'Tecum' in image]
	#print images[:5]
        for image in images:
               old_name = "%s/%s" % (dir, image)
	       renamed_image = image.replace("Tecum", "Tectum")
	       new_name = "%s/%s" % (dir, renamed_image)
	       print old_name
	       print new_name
	       #os.rename(old_name, new_name)
