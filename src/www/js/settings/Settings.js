/*
 * Author:              Alfredo Oltra
 * email:               aoltra@gmail.com, alfredo@uhurulabs.com
 *
 * Start date:          22/11/2014
 *
 * Encapsula las configuración de la aplicación
 *
 * settings encapsulation.
 */

/* JSLint options */
/*global helpFile, $*/

// Constructor
function Settings(rT, lang, ooos) {
    "use strict";
    
    var db = window.localStorage,
        tableName = 'VDsettings';
    
    this.refreshTime = rT;
    this.language = lang;
    this.ooosURL = ooos;
    
    this.save = function () {
        db.setItem(tableName, JSON.stringify(this));
    };

    this.load = function () {
        return JSON.parse(db.getItem(tableName));
    };
}

Settings.getSettings = function () {
    "use strict";
    
    var settings = new Settings().load();
    
    return (settings === null) ? {} : new Settings(settings.refreshTime, settings.language, settings.ooosURL);
};