#Errores instalación

Al añadir el proyecto en *Android* es posible que aparezca algún error. Es muy probable que la razón sea o que no se ha instalado el SDK o no está en el path. En este último caso la solución es:

    export ANDROID_HOME=/carpeta/donde/esta/instalado/sdk
    export PATH=$ANDROID_HOME/tools:$PATH
    export PATH=$ANDROID_HOME/platform-tools:$PATH
