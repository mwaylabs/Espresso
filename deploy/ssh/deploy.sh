#! /bin/sh
#  Espresso SSH deployment module.
# 
#  Copyright(c) 2011 Panacoda GmbH. All rights reserved.
#  This file is licensed under the MIT license.
# 
#  Example usage:
#    #! /bin/sh
#    host=panacoda.com     # required
#    port=10022            # optional; default is 22
#    username=foo          # optional; default is $LOGNAME
#    targetPath=quux       # required
#    deleteTargetPath=true # optional; default is false
# 
#    export host port username password targetPath timeout
# 
#    # deploy $PWD/bar as to panacoda.com into ~foo/quux as user foo
#    exec sh deploy.sh bar
#
set -euf

host="${host}"
port="${port-22}"
username="${username-$LOGNAME}"
targetPath="${targetPath}"
sourcePath="${1-$sourcePath}"
deleteTargetPath="${deleteTargetPath-false}"

# TODO implement debugLevel

cd "$sourcePath" && find . -mindepth 1 -maxdepth 1 | tar -T - -c |
ssh -o BatchMode=yes -p "$port" "$username@$host" "
  set -euf
  echo # TODO remove this, when we handle debugLevel

  if test -e '$targetPath'; then
    if test '$deleteTargetPath' = true; then
      find '$targetPath' -mindepth 1 -maxdepth 1 2>/dev/null | xargs rm -vfR
    else
      exec >&2
      echo 'Error: targetPath already exists, use deleteTargetPath to remove it first'
      exit 23
    fi
  fi

  mkdir -pv '$targetPath'
  cd '$targetPath'
  tar -vx | sed 's|^\.|put $targetPath|'
"
