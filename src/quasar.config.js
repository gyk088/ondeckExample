import Vue from "vue"
import "quasar/dist/quasar.min.css"
import iconSet from "quasar/dist/icon-set/mdi-v4.umd.min.js"
import Quasar from "quasar"
import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QLayout,
  QPageContainer,
  QPage,
  QHeader,
  QFooter,
  QDrawer,
  QPageSticky,
  QPageScroller,
  QAvatar,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QTable,
  QTh,
  QTr,
  QTd
} from "quasar"

export default () =>
  Vue.use(Quasar, {
    config: {},
    iconSet: iconSet,
    components: {
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      QLayout,
      QPageContainer,
      QPage,
      QHeader,
      QFooter,
      QDrawer,
      QPageSticky,
      QPageScroller,
      QAvatar,
      QList,
      QItem,
      QItemSection,
      QItemLabel,
      QTable,
      QTh,
      QTr,
      QTd
    }
  })
