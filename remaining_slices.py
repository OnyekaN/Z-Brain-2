# remaining_slices.py
import re
import os
import sys
import json
import warnings
import numpy as np
from PIL import Image, ImageEnhance
from skimage import io
from skimage import exposure

# Get commandline args and set globals
stack_name = sys.argv[1]
brightness = float(sys.argv[2])
gamma = float(sys.argv[3])
zslice = int(sys.argv[4])
file_path = os.path.dirname(os.path.realpath(__file__))
path = "{}/app/assets/images/{}/".format(file_path,stack_name)
new_paths = []
interval = 8

# Sort filenames by natural numerical order
def atoi(text):
     return int(text) if text.isdigit() else text

def natural_keys(text):
     return [ atoi(c) for c in re.split('(\d+)', text) ]

stack_images = [i for i in os.listdir(path)]
stack_images.sort(key=natural_keys)


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

          # save brightness and gamma corrected image
          with warnings.catch_warnings():
               warnings.simplefilter("ignore")
               io.imsave(new_path, im_bg)
               new_paths.append(re.sub('{}/app/assets/'.format(file_path), '', new_path))

          return


def create_order(zslice, interval):
     start = zslice % interval 
     stride = interval
     full = np.arange(138)
     full = [f for f in full if f not in full[start::8]] 
     remaining = []

     while stride > 0:
          arr = [f for f in full if f in full[start::stride]
                    and f not in remaining]
          arr = sorted(arr, key=lambda val: abs(zslice-val))
          remaining = np.concatenate((remaining, arr), axis = 0)
          if stride == 1:
               break
          stride = stride / 2
          
     remaining = [int(r) for r in remaining]
     return remaining
     

def modify_images(stack_images, path, brightness, gamma, zslice, interval):
     order = create_order(zslice, interval)
     
     for i in order:
          save_img_slice(stack_images, path, i)

     return 0

modify_images(stack_images, path, brightness, gamma, zslice, interval)

