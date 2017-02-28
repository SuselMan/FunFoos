/**
 * Created by pavluhin on 28.02.2017.
 */

import Marionette from 'backbone.marionette';

var Preloader = Marionette.Behavior.extend({

    onFetchComplete:function(){
        this.el.querySelector('.preloader').style.display = 'none'
    }

});

export default Preloader;