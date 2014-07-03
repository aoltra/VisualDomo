#Ejecución
###Compilación


####*(Android)* 
Desde la consola:


    cordova build android
    
####*(iOS)* Desde la consola 


    cordova build ios
  
  
 ###Ejecución
 
####*(Android)* 

Tenemos la opción de ejecutarlo en un emulador o directamente en un dispositivo físico (recomendado). 
             
* En el primero caso, una vez tengamos creado el dispositivo virtual:
    
         
    cordova emulate android

* En caso de querer probarlo sobre un dispositivo físico

    cordova run android

* Por último, siempre queda la opción de distribuir a otros dispositivos el .apk generado. Se puede encontrar en *plataforms/android/bin/*
