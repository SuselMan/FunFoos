/**
 * Created by pavluhin on 07.02.2017.
 */


import Marionette from 'backbone.marionette';

const routes = {
  'players(/)': 'playersWindow',
  'teams(/)': 'teamsWindow',
  'cities(/)': 'citiesWindow',
  'team(/:id)': 'teamWindow',
  'city(/:id)': 'cityWindow',
  'season(/:id)': 'seasonWindow',
  'subseason(/:id)': 'subseasonWindow',
  'user(/)': 'userWindow',
  'seasons(/)': 'seasonsWindow',
  // 'meetings(/)': 'meetingsWindow',
  'meeting(/:id)': 'meetingWindow',
  '(/)': 'index'
};

export default Marionette.AppRouter.extend({
  appRoutes: routes
});
