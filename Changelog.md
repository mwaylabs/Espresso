** Version 0.0.8 - Date 08.02.2011 **

  * Added property: 'offlineManifest: true/false' in the config.json, to switch on/off the generation of the
    offline manifest.
  * Added property: 'environment: PhoneGap/Web' in the config.json, to switch on/off the usage of the phonegap.js.
    default is 'Web'
  * Added property: 'm_serverPort: "Port"' to run the built-in server on a custom port.
  * Added property: 'm_serverHostname: "Hostname"' to run the built-in server on a custom hostname.
  * Added property: 'htmlHeader' to customize the HEAD entries in the index.html.

  * Added detection of "circles" in the m_require chain.
  * Added command line arguments for m-server.js

** Version 0.0.7-1 - Date 01.02.2011 **

  * Added feature to use the refs attribute of the libraries property
    to sort the library entries in the index.html
  * Fixed a bug, which leads to a crash on Windows when addressing the file of a
    3rd Party lib, that is existing.

** Version 0.0.7 - Date 31.01.2011 **

  * Added support for 3rd Party Libs.
  * Deleted leading '/' in the cache.manifest
  * Fixed typo, where reference to 'task.js' is written in uppercase
