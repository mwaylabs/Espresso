#! /usr/bin/env python2
#
# deploy/ftp/deploy.py
#
# Espresso FTP deployment module.
#
# Copyright(c) 2011 Panacoda GmbH. All rights reserved.
# This file is licensed under the MIT license.
#
# Example usage:
#   #! /bin/sh
#   host=ftp.panacoda.com # required
#   port=10021            # optional; default is 21
#   username=foo          # required
#   password=bar          # required
#   targetPath=/foo       # optional; default is '/'
#   timeout=10000         # optional; default is 15000
#
#   export host port username password targetPath timeout
#
#   # deploy $PWD/bar as ftp://foo@bar:ftp.panacoda.com:10021/foo
#   exec python2 deploy.py bar
#

import ftplib, sys, re, os

source_directory_names = sys.argv[1:]

def main():
  # load mandatory configuration
  try:
    ftp_config = os.environ
    host = ftp_config['host']
    username = ftp_config['username']
    password = ftp_config['password']
  except KeyError as key:
    # TODO better error message
    raise EpicFail('require configuration: ' + str(key))

  # load optional configuration... or use default values
  port = int(ftp_config['port'] if 'port' in ftp_config else 21)
  timeout = int(ftp_config['timeout'] if 'timeout' in ftp_config else 15000)
  targetPath = ftp_config['targetPath'] if 'targetPath' in ftp_config else '/'

  # TODO? print configuration

  # instantiate fto client
  ftp = ftplib.FTP()
  ftp.connect(host, port, timeout)
  ftp.login(username, password)

  # clean target path
  delete(ftp, targetPath)

  # upload source paths
  for sourcePath in source_directory_names:
    put(ftp, sourcePath, targetPath)

  ftp.quit()

#### high level FTP operations

## delete a remote file or directory (recursive)
def delete(ftp, path):
  path = normalizePath(path)

  # if path isn't a basename then cwd and make path a basename first
  if not isBasename(path):
    try:
      targetDirectory = os.path.dirname(path)
      ftp.cwd(targetDirectory)
      print('cwd ' + ftp.pwd())
    except ftplib.error_perm:
      raise EpicFail('cannot change to remote directory: ' + targetDirectory)
    path = targetDirectory

  # try to delete a file... or a directory
  try:
    ftp.delete(path)
    print('delete ' + normalizePath(ftp.pwd() + '/' + path))
  except ftplib.error_perm:
    try:
      # to delete a directory kill it's children first
      ftp.cwd(path)
      for i in ftp.nlst():
        if not re.match('^\.\.?$', i):
          delete(ftp, i)
      ftp.cwd('..')
      ftp.rmd(path)
      print('rmd ' + normalizePath(ftp.pwd() + '/' + path))
    except ftplib.error_perm:
      # let's presume the target directory or file didn't exist...
      # that's just what we wanted -> yay, nothing to do! ^_^
      pass

## upload a file or directory (recursive)
def put(ftp, sourcePath, targetPath):
  sourcePath = normalizePath(sourcePath)
  targetPath = normalizePath(targetPath)

  # try to upload a file... or a directory
  try:
    source = open(sourcePath, 'rb')
    # TODO should we ftp.cwd(dirname of targetPath) first?
    ftp.storbinary('STOR ' + targetPath, source)
    source.close()
    print('put ' + targetPath)
  except Exception as x:
    try:
      print('mkd ' + targetPath)
      try:
        ftp.mkd(targetPath)
      except:
        pass
      for i in os.listdir(sourcePath):
        put(ftp, sourcePath + '/' + i, targetPath + '/' + i)
    except:
      pass

#### utility functions

def normalizePath(path):
  return re.sub('^$', '/', re.sub('/$', '', re.sub('//+', '/', path)))

def isBasename(path):
  return not re.match('/', path)

class EpicFail(Exception):
  def __init__(self, reason):
    self.reason = reason
  def __str__(self):
    return self.reason

#### launch!
try:
  main()
except EpicFail as x:
  sys.stderr.write(str(x) + '\n')
  sys.exit(23)
