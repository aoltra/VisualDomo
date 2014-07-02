#Instalación Phonegap/Cordova

>*Nota:* Los pasos se han realizado en un Linux Mint (pero debería se posible realizarlos sin problemas en cualquier distribución basada en Debian) y en un MacOS X Mavericks. Está centrada en el uso de plataformas Android y iOS (sólo en MacOS).

###1. Instalación del entorno de desarrollo 

En cada SO sólo podemos trabajar en las plataformas para las que hay soporte. Por ejemplo, para Linux disponemos de los SDK's de *Amazon Fire OS, Android, BB10 y Firefox OS*. 

 - En el caso de *VisualDomo (Android, iOS)*, si trabajamos en Linux sólo tenemos la acción de poder instalar el SDK de Android. En caso de ya tenerlo instalado es conveniente actualizar a la última versión del SDK y del SDK-tools.

- Desde *MacOS* tenemos tambien la opción de instalación del SDK de *iOS*, para lo cual es necesario instalar *Xcode*.

###2. Instalación de Node.js

En Linux, en principio puede ser instalado directamente desde el propio gestor de paquetes que la distribución tenga (*synaptic* o similar), pero es importante tener en cuenta dos cosas: 

- La primera es la versión a instalar. Normalmente en el gestor puede haber una versión antigua, por lo que es interesante incluir el [ppa nodejs] para estar al día. 

- Lo siguiente es que hay que tener en cuenta que el paquete npm (el instalador de paquetes de nodejs) se encuentra en un paquete distinto a *Nodejs*, por lo que hay que recordar instalarlo.

En *MacOS* la instalación simplemente consiste en descargar el paquete desde la web de [nodejs] e instalarlo.

###3. Instalación de phonegap

Simplemente:

    sudo npm install -g cordova

Podemos coprobar que la instalación se ha realizado con éxito mediante la ejecución de:

    cordova -v


>*Nota:* El resto de herramientas (con sus respectivas versiones) necesarias para trabajar aparecen en el documento *Herramientas.md*. Se omite el proceso de instalación ya está bastante bien detallado en sus respectivas instrucciones.


[ppa nodejs]:https://launchpad.net/~chris-lea/+archive/node.js
[nodejs]:http://nodejs.org