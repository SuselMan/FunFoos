/**
 * Created by pavluhin on 07.02.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';

var routes = {
    'players(/)': 'playersWindow',
    'main(/)': 'mainWindow',
    'teams(/)': 'teamsWindow',
    '(/)': 'index'
};

export default Marionette.AppRouter.extend({
    appRoutes: routes
});