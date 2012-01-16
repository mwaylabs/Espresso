#! /usr/bin/env python2
"""Espresso FTP deployment module.

 Copyright(c) 2011 Panacoda GmbH. All rights reserved.
 This file is licensed under the MIT license.

 Example usage:
   #! /bin/sh
   host=ftp.panacoda.com # required
   port=10021            # optional; default is 21
   username=foo          # required
   password=bar          # required
   targetPath=/foo       # required
   deleteTargetPath=true # optional; default is false
   timeout=10000         # optional; default is 15000

   export host port username password targetPath timeout deleteTargetPath

   # deploy $PWD/bar as ftp://foo@bar:ftp.panacoda.com:10021/foo
   exec python2 deploy.py bar
"""
import ftplib, sys, re, os
from os.path import basename, dirname, isdir, join, normpath

debugLevel = 0
workingDirectory = False

def cwd(ftp, path):
  """change remote working directory if it has changed"""
  global workingDirectory
  if (workingDirectory != path):
    step(ftp.cwd(path))
    workingDirectory = ftp.pwd()

def delete(ftp, path):
  """delete a remote file or directory (recursive)"""

  global workingDirectory
  path = normpath(path)

  # if path isn't a basename then cwd and make path a basename first
  if basename(path) != path:
    cwd(ftp, dirname(path))
    path = basename(path)

  targetPath = join(workingDirectory, path);

  try:
    cwd(ftp, dirname(targetPath))
    step(ftp.delete(basename(targetPath)))
  except ftplib.error_perm:
    # targetPath was no deletable file. maybe it's a directory...
    try:
      cwd(ftp, targetPath)
      for i in ftp.nlst():
        if not re.match('^\.\.?$', i):
          delete(ftp, i)
      cwd(ftp, '..')
      step(ftp.rmd(targetPath))
    except ftplib.error_perm:
      # let's presume the target directory or file didn't exist...
      # that's just what we wanted -> yay, nothing to do! ^_^
      pass

def exists(ftp, path):
  """check if a remote file or directory exists"""

  path = normpath(path)
  try:
    ftp.sendcmd('MLst ' + path)
    result = True
  except ftplib.error_perm:
    result = False

  return result

def put(ftp, sourcePath, targetPath):
  """upload a file or directory (recursive)"""

  sourcePath = normpath(sourcePath)
  targetPath = normpath(targetPath)

  # try to upload a file... or a directory
  if (isdir(sourcePath)):
    cwd(ftp, dirname(targetPath))
    step(ftp.mkd(basename(targetPath)))
    for i in os.listdir(sourcePath):
      put(ftp, join(sourcePath, i), join(targetPath, i))
  else:
    cwd(ftp, dirname(targetPath))
    step(ftp.storbinary('STOR ' + basename(targetPath), open(sourcePath, 'rb')))

def step(x):
  """indicate progress"""
  global debugLevel
  if (debugLevel == 0):
    sys.stderr.write('.')

if __name__ == '__main__':
  try:
    source_directory_names = sys.argv[1:]

    # load mandatory configuration
    try:
      config = os.environ
      host = config['host']
      username = config['username']
      password = config['password']
    except KeyError as key:
      # TODO better error message
      raise Exception('require configuration: ' + str(key))

    # load optional configuration... or use default values
    port = int(config['port'] if 'port' in config else 21)
    timeout = int(config['timeout'] if 'timeout' in config else 15000)
    targetPath = config['targetPath'] if 'targetPath' in config else '/'
    if 'debugLevel' in config:
      debugLevel = int(config['debugLevel'])

    # TODO? print configuration

    ftp = ftplib.FTP()
    ftp.set_debuglevel(debugLevel)

    step(ftp.connect(host, port, timeout))
    step(ftp.login(username, password))

    if exists(ftp, targetPath):
      if 'deleteTargetPath' in config and config['deleteTargetPath'] == 'true':
        delete(ftp, targetPath)
      else:
        raise Exception('targetPath already exists, use deleteTargetPath to remove it first');

    for sourcePath in source_directory_names:
      put(ftp, sourcePath, targetPath)

    step(ftp.quit())

    if (debugLevel == 0):
      sys.stderr.write('ok\n')
    sys.exit(0)

  except Exception as x:
    sys.stderr.write('\nError: ' + str(x) + '\n')
    sys.exit(23)
