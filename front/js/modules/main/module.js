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
        this.layout = new Layout();
    }

    start() {
        console.log('start module');
        try{
        App.showView(this.layout);
        }
        catch(e){
            console.log('e',e);
        }
       // console.log('layout', new Layout());
       // Region.show(Layout);
    }

    setView(view){
        this.layout.start(view);
        console.log('setView module');
    }
}

var module = new MainWindow();

export default module