#Ejecución
###Compilación

####Plugins

Es necesario añadir los plugins indicados en el documentos [Plugins.md](https://github.com/aoltra/VisualDomo/blob/master/doc/Plugins.md)

File

    cordova plugin add org.apache.cordova.file

Network-information

    cordova plugin add org.apache.cordova.network-information

WifiInformation

    cordova plugin add https://github.com/aoltra/WifiInformation

Camera

    cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git 


####*(Android)* 
Desde la consola (carpeta src):

	En primer lugar crear la plataforma:

	cordova platform add android

	(si ya estuviera creada es conveniente borrarla con  *cordova platform rm android*)

	Crear el ejecutable:
    
    cordova build android
    
####*(iOS)* Desde la consola (carpeta src)

	En primer lugar crear la plataforma:

	cordova platform add ios

	(si ya estuviera creada es conveniente borrarla con  *cordova platform rm ios*)

	Crear el ejecutable:

    cordova build ios
  
###Ejecución
 
####*(Android)* 

Tenemos la opción de ejecutarlo en un emulador o directamente en un dispositivo físico (recomendado). 
             
* En el primero caso, una vez tengamos creado el dispositivo virtual:
         
    cordova emulate android

* En caso de querer probarlo sobre un dispositivo físico

    cordova run android

* Por último, siempre queda la opción de distribuir a otros dispositivos el .apk generado. Se puede encontrar en *plataforms/android/ant-build/*