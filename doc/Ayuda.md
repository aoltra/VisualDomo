#Ayuda VisualDomo

###Introducción 

El objetivo de *VisualDomo* es la creación de lo que denominamos localizaciones y de su posterior visualización/interacción de manera gráfica.

Una *localización* es una ubicación espacial de una o más plantas en la que existen uno o varios *ODControl* conectados que disponen, para al menos uno de sus puertos, de elementos distribuidos a lo largo de los diferentes espacios. Sobre estos puertos se permite interaccionar, ya sea para obtener información de ellos o para modificarlos. Una vivienda particular, una vivienda estacional, las oficinas de una empresa o un colegio pueden ser considerados ejemplos de posibles localizaciones.

###Modos de funcionamiento

*VisualDomo* posee dos modos de funcionamiento:

* *Modo edición*. Permite la creación y edición de las localizaciones. Añadir plantas, configurar *ODControl*s, ubicar puertos en cada planta, definir el tipo de información de cada puerto...

* *Modo visualización*. Es el modo de trabajo habitual. Permite visualizar el estado de los puertos ubicados en las plantas, así como (si el puerto es de salida) modificar su valor..

###Estados de *VisualDomo*. Operatividad
En función de la conectividad del dispositivo donde está funcionando VisualDomo puede encontrarse en tres posibles estados:

* *Sin conexión a red*. El dispositivo móvil no tiene conexión a ningún tipo de red. En este estado únicamente es posible acceder a la creación de nuevas localizaciones o a la configuración de las ya existentes. En este último caso no será posible añadir nuevos ODControl, pero si ubicar puertos (o reubicar los ya colocados) y/o cambiar su configuración.
* *Conexión a red 3G/4G*. El dispositivo únicamente se encuentra conectado a una red de datos. En este caso además de las opciones anteriores tendrá acceso a comunicarse con localizaciones remotas (opción no soportada en esta versión).
* *Conexión Wifi*. El dispositivo se encuentra conectado a un red Wifi. En este caso todas las opciones se encuentran disponibles de partida, aunque la opción de visualización sólo lo estará en el caso de que alguna de las localizaciones esté asignada a la red Wifi a la que se encuentra conectado el dispositivo.

###Estado de una localización
Teniendo en cuenta lo anterior, una localización puede encontrarse en tres posibles estados:

* *Desasignada*. La localización está creada pero no está enlazada a ninguna red.
* *Asignada*. La localización está creada y configurada, estando enlazada a una red wifi determinada.
* *Conectada*. La localización está asignada a la red wifi a la que el dispositivo móvil se encuentra conectado. En esta situación es posible acceder al modo de visualización.

###Creación de localizaciones
La creación de localizaciones permite la asignación de plantas, la asignación de *ODControls*, la ubicación de los puertos en las diferentes plantas y la personalización de esos puertos.

####Asignación de plantas

La gestión de las plantas se realiza en su totalidad desde el panel inferior de la ventana de creación. Este panel puede obtenerse mediante la pulsación del símbolo ^ que aparece ubicado en la parte inferior de la ventana.

######Añadir planta

Cada una de las plantas se apoya en una imagen que represente el plano de esa planta. Para añadirla es necesario pulsar sobre el + del último ítem del panel. Este botón abre una ventana que permite la configuración de la planta.

- *Nivel*. Nivel de la planta comenzando en 0. En caso de que no se defina, se asignará el nivel de la última planta definida más 1.
- *Nombre*. Nombre de la planta. Por ejemplo: sótano, planta baja. altillo...
- *Descripción*. Descripción de la planta.
- *Invertir colores*. Para una mejor visualización, invierte automáticamente los colores de la imagen.
- *Selecciona imagen*. Permite al carga de una de las imágenes almacenadas en la librería del dispositivo.

> Se aceptan varios formatos a la hora de seleccionar la imagen de la planta: jpg, bmp, gif, png... Para una mejor visualización es recomendable el uso de un formato con transparencias como PNG. 

######Edición de plantas. 

La edición de plantas se realiza desde la barra de herramientas de plantas que se puede obtener pulsando durante cierto tiempo sobre la planta en el panel inferior. Esta barra permite:

- *Borrar la planta*
- *Configurar planta*. Muestra el cuadro de diálogo de configuración (ver apartado [Añadir planta](#))
- *Cambiar de nivel*. Desplazando la planta a la derecha (bajar nivel) o izquierda (subir nivel)

######Selección de planta.

Para ubicar la planta en el panel central únicamente es necesario pulsar sobre ella.

####Asignación de ODControl

La gestión de los *ODControl* se realiza desde el panel izquierdo de la ventana de creación. Este panel puede obtenerse mediante la pulsación del botón *ODControl (n)* situado a la izquierda de la cabecera. En el botón, *(n)* indica el número de *ODControl* añadidos a la localización.

#####Añadir ODControl.

Para añadir un ODControl hay pulsar sobre el botón Añadir ODC situado en el panel izquierdo. Este botón abre una ventana que permite la configuración del *ODControl*. 

- *IP*. Dirección IP del *ODControl*.
- *Usuario*. Usuario con permisos de acceso al *ODControl*.
- *Contraseña*. Contraseña del usuario.
- *Nombre*. Nombre con el que será identificado el *ODControl*.

Una vez localizado, aparecerá un ítem en el panel izquierdo con el nombre del *ODControl* que dará acceso a un panel plegable con la lista de todos los puertos disponibles.

> Para la carga de los *ODControl* es necesario que *VisualDomo* esté en el estado *Conexión Wifi*. 

> El añadido de los *ODControl* no implica la asignación de la localización a la red Wifi de la que se está tomando datos.

#####Edición del ODControl 

La edición de los *ODControl* se realiza desde la barra de herramientas de *ODControl* que se puede obtener pulsando sobre el texto del nombre de *ODControl* en el panel izquierdo. Esta barra permite:

- Borrar el *ODControl*.
- *Configurar el ODControl*. Presenta el cuadro de dialogo de configuración (ver [Añadir ODControl](#Añadir ODControl)) pero únicamente da acceso a cambiar el nombre, usuario y contraseña.
- *Recargar ODControl*. Permite la actualización de los puertos, añadiendo nuevos y eliminado los deshabilitados (opción no soportada en esta versión).

####Ubicación de puertos

La ubicación de puertos se realiza desde el panel izquierdo. En su interior se encuentra la lista de *ODControl* configurados. Cada uno de estos *ODControl* permite abrir un panel desplegable  con una lista de todos aquellos puertos que el *ODControl* permite visualizar.

> Si desea que algún puerto desaparezca o aparezca en el listado debe realizar la correspondiente configuración desde el interfaz gráfico de configuración del ODControl.

Cada uno de los ítems de la lista define un puerto mediante el formato: 

(analógico/digital)  (entrada/salida)  nombre (ubicado/no ubicado)   (función)

#####Ubicación de puertos

Para ubicar un puerto en la planta actual únicamente hay que pulsar sobre el nombre del puerto. Este acción colocará el puerto en el centro de la planta. En ese instante el icono q aparecerá en la entrada del puerto en la lista del panel izquierdo

> La representación de un puerto es un icono especificando su funcionalidad. Ver apartado [Configuración de puertos](#Configuración de puertos).

Para ubicar el puerto en la posición deseada simplemente hay que pulsar sobre él y desplazarlo suavemente sobre la imagen de la planta.

#####Eliminación de puertos

Para eliminar un puerto de su ubicación en planta simplemente pulse sobre el icono q desde la lista de puertos en el panel izquierdo.

#####Configuración de puertos

La configuración de puertos permite la definición de la funcionalidad del puerto, así como del texto que acompaña a la representación visual. Se realiza desde un cuadro de diálogo al que se accede pulsando sobre el icono de funcionalidad (último icono) del puerto en la lista de puertos. Si no se ha definido ninguna funcionalidad se muestra el icono por defecto en función del tipo de puerto (analógico o digital). 

> No es necesario que el puerto esté ubicado para proceder a su configuración.

El cuadro de diálogo consta de:

- *Unidades*. En el caso de puerto analógico permite definir un texto que se situará detrás del valor del puerto a modo de unidades.
- *Factor*. Factor por el que se multiplica el valor del puerto a la hora de representarlo y/o modificar su valor (ver [Visualización](#Visualización))
- *Funcionalidad*. identifica mediante un icono la posible funcionalidad del puerto. En esta versión se encuentran disponibles iconos para representar Luces, Persianas, Temperatura y Audio.

###Configuración de la localización
La configuración de la localización permite la definición del nombre y la descripción de la misma. Se puede acceder a ella desde el menú situado en la parte derecha de la cabecera. 

El cuadro de diálogo de configuración consta de:

- *Nombre*. Nombre de la localización. Este nombre no puede estar vacío. Además, no permite la inclusión de espacios.
- *Descripción*. Descripción de la localización.

###Grabación de la localización

La grabación de la localización se desde el menú situado en la parte derecha de la cabecera. 

> En caso de que el usuario no haya definido un nombre de la localización a la hora de grabar, VisualDomo presentará automáticamente el cuadro de diálogo de configuración de la localización.

Las localizaciones se almacenan en el directorio *VisualDomo/locations*. Para cada localización se crea un fichero con extensión *.vdlt o .vdl* (en función de si la localización está asignada o no) y una carpeta que contiene una copia de las imágenes de las plantas.


###Configuración.

La opción de *Configuración* permite carga una de las localizaciones guardadas y trabajar con ella de la misma manera que se puede realizar desde la opción *Nueva localización*.

###Enlazar
La opción *Enlazar* del menú principal permite asignar a una localización la red wifi actual o desasignar una localización de la red wifi que tenga definida.

En caso de ser asignada *VisualDomo* pasa automáticamente al modo *Visualización*.

> La red wifi se identifica mediante su BSSID.

###Externa

Permite la conexión a localizaciones asignadas a redes diferentes a la red actual. Esta opción no soportada en esta versión.

###Visualización

La visualización es el modo habitual de trabajo de *VisualDomo*. Se puede acceder a él mediante la opción *Visualización* del menú principal, al enlazar una localización o directamente cuando el sistema detecta un que existe una localización para la wifi actual.

La ventana de visualización es muy similar a la ventana de creación de localizaciones, pero sin el panel izquierdo de gestión de los *ODControl*. 

La ventana de principal muestra cada una de las plantas con los puertos ubicados y su valor actual. Si el puerto es de salida será posible modificar su valor (en caso de que sea analógico) o su estado (en caso de que sea digital). Para ello, en ambos casos bastará con pulsar sobre el puerto para cambiar su estado o mostrar la ventana de configuración de los valores, desde donde podemos modificar el valor.

> Utilice valores dentro del rango admisible. Tenga en cuenta que estos valores se encuentran afectados del factor utilizado en la configuración del puerto.

###Configuración de la aplicación
Desde el menú situado a la derecha de la cabecera es posible acceder a la configuración de general de *VisualDomo*. Dicha configuración permite:

- *OpenDOomoOS*. URL (sin protocolo) de acceso a *OpenDomoOS* 
- *Tiempo entre actualizaciones de estado*. Define (en segundos) el tiempo entre conexión a los *ODControl* definidos en la localización para actualizar en pantalla el estado de los puertos.
- *Idioma*. Lenguaje en el que aparecerán los textos de la aplicación.