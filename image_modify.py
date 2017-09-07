import re
import os
import sys
import json
from PIL import Image, ImageEnhance
from skimage import io
from skimage import exposure

stack_name = sys.argv[1]
brightness = float(sys.argv[2])
gamma = float(sys.argv[3])
path = "app/assets/images/{}/".format(stack_name)
new_paths = []

def atoi(text):
     return int(text) if text.isdigit() else text

def natural_keys(text):
     return [ atoi(c) for c in re.split('(\d+)', text) ]

stack_images = [i for i in os.listdir(path)]
stack_images.sort(key=natural_keys)


def adjust_stack_images(stack_images, brightness, gamma):
     for i, image in enumerate(stack_images):
          filename = '{}{}'.format(path, image)
          # remove dot from floats to insert into new filename
          b = re.sub('\.', '_', str(brightness))
          g = re.sub('\.', '_', str(gamma))

          new_path = (
               "app/assets/images/1TemporaryLineImages/{}&b{}&g{}-{}.jpg"
               .format(stack_name, b, g, i)
                    )

          # read image from filename and update gamma
          im = io.imread(filename)
          gamma_corrected = exposure.adjust_gamma(im, gamma)

          # convert image to PIL format and update brightness
          im_g = Image.fromarray(gamma_corrected)
          enhancer = ImageEnhance.Brightness(im_g)
          im_bg = enhancer.enhance(brightness)
          
          # save brightnes and gamma corrected image
          io.imsave(new_path, im_bg)
          new_paths.append(re.sub('app/assets/', '', new_path))

     print json.dumps(new_paths)
     return 0

adjust_stack_images(stack_images, brightness, gamma)
