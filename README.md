# connect4

In order to run the app locally, go to Apache24/conf

1. Find this in **httpd.conf**:
```
<IfModule alias_module>
```
Within the IfModule add the following: 
```
Alias /connect4 "path/name/to/html/folder/for/connect4"
```

2. Find this in **httpd.conf**:
```
<Directory />
    AllowOverride none
    Require all denied
</Directory>
```

Type the following under it:
```
<Directory "path/name/to/html/folder/for/connect4" >
    AllowOverride none
    Require all granted
</Directory>
```

3. Scroll to the bottom of **proxy-html.conf** and add the following:
```
ProxyPass /api http://127.0.0.1:3000
```
