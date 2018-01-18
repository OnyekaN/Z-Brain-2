# initial_slices.py
import re
import os
import sys
import json
import warnings
import numpy as np
from PIL import Image, ImageEnhance
from skimage import io
from skimage import exposure


# Get commandline args
stack_name = sys.argv[1]
brightness = float(sys.argv[2])
gamma = float(sys.argv[3])
zslice = int(sys.argv[4])
file_path = os.path.dirname(os.path.realpath(__file__))
path = "{}/app/assets/images/0-Lines/{}/".format(file_path,stack_name)


# Sort filenames by natural numerical order
def atoi(text):
     return int(text) if text.isdigit() else text

def natural_keys(text):
     return [ atoi(c) for c in re.split('(\d+)', text) ]

stack_images = [i for i in os.listdir(path)]
stack_images.sort(key=natural_keys)



def print_stack_names(file_path, stack_images, brightness, gamma):
     new_paths = []
     # self note: consider replacing with a generator
     for i, image in enumerate(stack_images):
          filename = '{}{}'.format(path, image)
          # remove dot from floats to insert into new filename
          b = re.sub('\.', '_', str(brightness))
          g = re.sub('\.', '_', str(gamma))

          new_path = (
               "images/1-TemporaryLineImages/{}&b{}&g{}-{}.jpg"
               .format(stack_name, b, g, i)
                    )

          new_paths.append(new_path)

     for p in new_paths:
          f = '{}/app/assets/{}'.format(file_path,p)
          open(f, 'a')

     return new_paths


def save_img_slice(stack_images, path, zindex):
          filename = '{}{}'.format(path, stack_images[zindex])
          # remove dot from floats to insert into new filename
          b = re.sub('\.', '_', str(brightness))
          g = re.sub('\.', '_', str(gamma))

          new_path = (
               "{}/app/assets/images/1-TemporaryLineImages/{}&b{}&g{}-{}.jpg"
               .format(file_path, stack_name, b, g, zindex)
                    )

          # read image from filename and update gamma
          im = io.imread(filename)
          gamma_corrected = exposure.adjust_gamma(im, gamma)

          # convert image to PIL format and update brightness
          im_g = Image.fromarray(gamma_corrected)
          enhancer = ImageEnhance.Brightness(im_g)
          im_bg = enhancer.enhance(brightness)

          # save corrected image
          with warnings.catch_warnings():
               warnings.simplefilter("ignore")
               io.imsave(new_path, im_bg)
     
          return
 

def modify_images(file_path, stack_images, path, brightness, gamma, zslice):
     interval = 8
     start = zslice % interval
     remaining = np.arange(138)[start::interval]
     remaining = sorted(remaining, key=lambda val: abs(zslice-val))
     new_paths = []

     for i in remaining:
          save_img_slice(stack_images, path, i)
 
     output = print_stack_names(file_path, stack_images, brightness, gamma)
     print json.dumps(output)
     return 0

modify_images(file_path, stack_images, path, brightness, gamma, zslice)


