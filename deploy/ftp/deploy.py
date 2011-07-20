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
   targetPath=/foo       # optional; default is '/'
   timeout=10000         # optional; default is 15000

   export host port username password targetPath timeout

   # deploy $PWD/bar as ftp://foo@bar:ftp.panacoda.com:10021/foo
   exec python2 deploy.py bar
"""
import ftplib, sys, re, os

def delete(ftp, path):
  """delete a remote file or directory (recursive)"""

  path = os.path.normpath(path)

  # if path isn't a basename then cwd and make path a basename first
  if os.path.basename(path) != path:
    try:
      targetDirectory = os.path.dirname(path)
      ftp.cwd(targetDirectory)
      print('cwd ' + ftp.pwd())
    except ftplib.error_perm:
      raise Exception('cannot change to remote directory: ' + targetDirectory)
    path = targetDirectory

  # try to delete a file... or a directory
  try:
    ftp.delete(path)
    print('delete ' + os.path.normpath(os.path.join(ftp.pwd(), path)))
  except ftplib.error_perm:
    try:
      # to delete a directory kill it's children first
      ftp.cwd(path)
      for i in ftp.nlst():
        if not re.match('^\.\.?$', i):
          delete(ftp, i)
      ftp.cwd('..')
      ftp.rmd(path)
      print('rmd ' + os.path.normpath(os.path.join(ftp.pwd(), path)))
    except ftplib.error_perm:
      # let's presume the target directory or file didn't exist...
      # that's just what we wanted -> yay, nothing to do! ^_^
      pass

def put(ftp, sourcePath, targetPath):
  """upload a file or directory (recursive)"""

  sourcePath = os.path.normpath(sourcePath)
  targetPath = os.path.normpath(targetPath)

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
        put(ftp, os.path.join(sourcePath, i), os.path.join(targetPath, i))
    except:
      pass

if __name__ == '__main__':
  try:
    source_directory_names = sys.argv[1:]

    # load mandatory configuration
    try:
      ftp_config = os.environ
      host = ftp_config['host']
      username = ftp_config['username']
      password = ftp_config['password']
    except KeyError as key:
      # TODO better error message
      raise Exception('require configuration: ' + str(key))

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

  except Exception as x:
    sys.stderr.write('Error: ' + str(x) + '\n')
    sys.exit(23)
