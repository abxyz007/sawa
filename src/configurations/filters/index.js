import Vue from 'vue';


Vue.filter('phone', (phone) => {
  return phone !== '' ? phone
    // .toString().replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "+$1 $2 $3-$2-$2") : '';
    .toString()
    .replace(/\D+/g, '')
    .replace(/(\d{3})(\d{2})(\d{3})/, '+$1$2 $3-') : '';
})