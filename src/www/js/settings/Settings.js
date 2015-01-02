/* 
 *    This file is part of VisualDomo.

 *    VisualDomo is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.

 *    VisualDomo is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with VisualDomo.  If not, see <http://www.gnu.org/licenses/>.
 */

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