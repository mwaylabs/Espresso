{
    "name" : "{{appName}}",
    "version": "v0.0.1",
    "minify": false,
    "proxies":[
                { "host":"your.server.com", "proxyAlias": "myServer", "requestMethod": "GET", "hostPort": "80" }
              ],
    "htmlHeader":[
                  "<meta name=\\"apple-mobile-web-app-capable\\" content=\\"yes\\">",
                  "<meta name=\\"apple-mobile-web-app-status-bar-style\\" content=\\"default\\">",
                  "<link rel=\\"apple-touch-icon\\" href=\\"/theme/images/apple-touch-icon.png\\"/>"
                 ]
             
}