/**
 * Created by pavluhin on 28.02.2017.
 */

import Marionette from 'backbone.marionette';

var Preloader = Marionette.Behavior.extend({

    ui: {
        destroy: '.preloader'
    },

    // Behaviors have events that are bound to the views DOM.
    events: {
        'load:comlete': 'hidePreloader'
    },

    hidePreloader: function() {
        this.el.querySelector('.preloader').style.display = 'none'
    }
});

export default Preloader;