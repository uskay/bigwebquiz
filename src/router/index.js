import Vue from 'vue'
import Router from 'vue-router'
import Quiz from '@/components/Quiz'
import Top from '@/components/Top'
import Odds from '@/components/Odds'
import Rank from '@/components/Rank'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Top',
      component: Top
    }, 
    {
      path: '/quiz/:id',
      name: 'Quiz',
      component: Quiz
    }, 
    {
      path: '/odds/:id',
      name: 'Odds',
      component: Odds
    }, 
    {
      path: '/rank',
      name: 'Rank',
      component: Rank
    }
  ]
})
