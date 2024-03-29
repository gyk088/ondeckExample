import Vue from 'vue';
import 'quasar/dist/quasar.min.css';
import iconSet from 'quasar/dist/icon-set/mdi-v4.umd.min';
import Quasar, {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QFile,
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
  QTd,
  QSpace,
  QParallax,
} from 'quasar';

export default () => Vue.use(Quasar, {
  config: {},
  iconSet,
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
    QTd,
    QSpace,
    QParallax,
  },
});
