# connect4

In order to run the app locally, go to httpd.conf

1. Find this:
```
<IfModule alias_module>
```
Within the IfModule add the following: 
```
Alias /connect4 "path/name/to/html/folder/for/connect4"
```

2. Find this:
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
