import Vue from 'vue';
import Router from 'vue-router';
import MedalTable from '../components/MedalTable.vue';
import CountryDetail from '../components/CountryDetail.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MedalTable',
      component: MedalTable
    },
    {
      path: '/country/:id',
      name: 'CountryDetail',
      component: CountryDetail,
      props: true
    }
  ]
});
