import os, sys, csv, glob, ntpath, operator, pickle
from pymongo import MongoClient

flag = sys.argv[1]
file_path = os.path.dirname(os.path.realpath(__file__))

#### from csv build dictionary that is the basis of database
def build_dict(file_path):

     with open('%s/Website Formation.csv' % file_path, 'rb') as csvfile:
          csvreader = csv.reader(csvfile, dialect=csv.excel_tab,
                    delimiter=',', quotechar='"')

          linesDict = dict()
          line = dict()

          for i, row in enumerate(csvreader):
               for j, col in enumerate(row):
                    if i == 0:
                         line[j] = col
                         linesDict[line[j]] = dict()
                         linesDict[line[j]]['Line Number'] = col
                         linesDict[line[j]]['Annotations'] = []
                    else:
                         if col != '' and col not in linesDict[line[j]]['Annotations']:
                              linesDict[line[j]]['Annotations'].append(col)
     print 'Initialized Dict from CSV'
     return linesDict

def to_dict_add_image_paths(file_path, dictionary):
     for key in dictionary:
          old_tif_path = [p for p in glob.glob('%s/../app/assets/images/*%s*.tif'
                    % (file_path, key)) if '16bit' not in p]
          old_16bit_tif_path = [p for p in glob.glob('%s/../app/assets/images/*%s*.tif'
                    % (file_path, key)) if '16bit' in p]
          old_jpeg_path = glob.glob('%s/../app/assets/images/*%s*.jpeg'
                    % (file_path, key))
          if old_tif_path and old_jpeg_path:
               new_tif_path = 'images/%s' % ntpath.basename(old_tif_path[0])
               new_16bit_tif_path = 'images/%s' % ntpath.basename(old_16bit_tif_path[0])
               new_jpeg_path = 'images/%s' % ntpath.basename(old_jpeg_path[0])
               dictionary[key]['TIF'] = new_tif_path
               dictionary[key]['TIF16'] = new_16bit_tif_path
               dictionary[key]['JPEG'] = new_jpeg_path
          else:
               print 'Add Image Path Error, %s, tif:%s, 16tif:%s, jpg:%s' % (key, old_tif_path, old_16bit_tif_path, old_jpeg_path)
               return

     print 'Added Image Srcs to Dict'

#### mongoDB operations
def connect_to_db(database, collection):

     client = MongoClient()
     db = client[database]
     db.drop_collection(collection)
     return db[collection]

def add_to_db(collection, dictionary):
     insertions = []
     for key in dictionary:
          insertions.append(collection.insert_one(dictionary[key]))
     return insertions

def update_db(collection, dictionary):
     updates = []
     for key in dictionary:
          updates.append(collection.find_and_modify(
               query={'Line Number': dictionary[key]['Line Number']},
               update={'$set': {'TIF': dictionary[key]['TIF'],
                              'JPEG': dictionary[key]['JPEG']}},
               upsert='false'))
    # print [update for update in updates]


def main(file_path, flag):


     # If dry run, output and/or print results of attempts to build dict and add image paths
     if flag is 'dry' or 'print':
          lines_dict = build_dict(file_path)
          to_dict_add_image_paths(file_path, lines_dict)
          if flag =='print':
               print 'Printing Dict\n', lines_dict

     # Export dictionary with pickle
     elif flag is 'pickle':
          lines_dict = build_dict(file_path)
          to_dict_add_image_paths(file_path, lines_dict)
          pickle.dump(lines_dict, open("%s/linesDict.p" % file_path, "wb"))

     # Import pickled dictionary and add values to MongoDB coll
     elif flag is 'update':
          lines_dict = pickle.load(open("%s/linesDict.p" % file_path, "rb"))
          coll = connect_to_db('enhancertrap', 'dataset')
          add_to_db(coll, lines_dict)
          #update_db(coll, lines_dict)
          print [x for x in coll.find()]

     else:
          print '"%s" not a valid flag (dry, print, pickle, update)' % flag

     return


# Run script with corresponding flag
main(file_path, flag)

