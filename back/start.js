/**
 * Created by ilya on 20.02.2017.
 */

require('babel-register');
require('./app.js');

document.querySelector('.bg3').addEventListener("animationend", function () {
  document.querySelector('.horiz').classList.remove('animationClass');
  document.querySelector('.horiz').classList.add('animationClass');
});
