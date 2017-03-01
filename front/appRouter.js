/**
 * Created by pavluhin on 07.02.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';

var routes = {
    'players(/)': 'playersWindow',
    'teams(/)': 'teamsWindow',
    'seasons(/)': 'seasonsWindow',
    '(/)': 'index'
};

export default Marionette.AppRouter.extend({
    appRoutes: routes
});