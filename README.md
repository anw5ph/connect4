# connect4

In order to run the app locally, go to httpd.conf and under:
```
<IfModule alias_module>
```
type the following: 
```
Alias /connect4 "path/name/to/html/folder/for/connect4"
```

And under the following: 
```
<Directory />
    AllowOverride none
    Require all denied
</Directory>
```

Add: 
```
<Directory "path/name/to/html/folder/for/connect4" >
    AllowOverride none
    Require all granted
</Directory>
```
