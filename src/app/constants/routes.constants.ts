
// Routes constants of the app
export const ROUTES = {
  HOME: {
    path: '',
    filePath: './modules/+home/home.module',
  },
  LISTS: {
    path: 'lists',
    filePath: './modules/+lists/lists.module',
  },
  RECIPES: {
    path: 'lists/recipes',
    filePath: './modules/+lists/recipes.component',
  },
  COMUNITY: {
    path: 'comunity',
    filePath: './modules/+comunity/comunity.module',

    DETAIL: {
      path: 'comunity/detail/:id',
      fullPath: 'comunity/detail',
      filePath: './modules/+comunity/containers/comunity-detail/comunity-detail.component',
    },
  },
  USER: {
    path: 'user',
    filePath: './modules/+user/user.module',
  },
  UNKNOW: {
    path: 'unknown',
    filePath: './shared/components/unknown/unknown.component',
  },
  FORBIDDEN: {
    path: 'forbidden',
    filePath: './shared/components/forbidden/forbidden.component',
  }
};
