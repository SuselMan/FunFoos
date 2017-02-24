/**
 * Created by ilya on 24.02.2017.
 */
'use strict';

import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import App from '../../../app';

import Layout from './layout';

class MainWindow {
    constructor(name) {
        this.name = name;
    }

    start() {
        try{
        App.showView(new Layout());
        }
        catch(e){
            console.log('e',e);
        }
       // console.log('layout', new Layout());
       // Region.show(Layout);
    }
}

var module = new MainWindow();

export default module