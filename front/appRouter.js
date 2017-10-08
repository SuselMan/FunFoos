/**
 * Created by pavluhin on 07.02.2017.
 */

"use strict";

import Marionette from 'backbone.marionette';

var routes = {
    'players(/)': 'playersWindow',
    'teams(/)': 'teamsWindow',
    'cities(/)': 'citiesWindow',
    'team(/:id)': 'teamWindow',
    'season(/:id)': 'seasonWindow',
    'user(/)': 'userWindow',
    'seasons(/)': 'seasonsWindow',
    'meetings(/)': 'meetingsWindow',
    'meeting(/:id)': 'meetingWindow',
    'places(/)': 'placesWindow',
    'admin(/)': 'adminWindow',
    '(/)': 'index'
};

export default Marionette.AppRouter.extend({
    appRoutes: routes
});