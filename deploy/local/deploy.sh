#! /bin/sh
#  Espresso local deployment module.
# 
#  Copyright(c) 2011 Panacoda GmbH. All rights reserved.
#  This file is licensed under the MIT license.
# 
#  Example usage:
#    #! /bin/sh
#    targetPath=quux        # name of the target directory to deploy to
#    deleteTargetPath=true  # optional; default is false
# 
#    export targetPath deleteTargetPath
# 
#    # deploy $PWD/bar into $PWD/quux
#    exec sh deploy.sh bar
#
set -euf

targetPath="${targetPath}"
deleteTargetPath="${deleteTargetPath-false}"
sourcePath="${1-$sourcePath}"
if test "${debugLevel-0}" -gt 0; then
  rm_flags=-v
  cp_flags=-v
  mkdir_flags=-v
fi

echo

# Remove targetPath path if it exists and we generated it
if test -e "$targetPath"; then
  if test "$deleteTargetPath" = true; then
    rm ${rm_flags-} -R "$targetPath"
  else
    exec >&2
    echo 'Error: targetPath already exists, use deleteTargetPath to remove it first'
    exit 23
  fi
fi

# Create targetPath
mkdir ${mkdir_flags-} -p "`dirname "$targetPath"`"
cp ${cp_flags-} -a "$sourcePath" "$targetPath"
