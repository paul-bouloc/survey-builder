type RouteLeaf = {
  path: string
  labelKey: string
  getHref: (...args: any[]) => string
}

type RoutesTree = {
  [key: string]: RouteLeaf | RoutesTree
}

export const routes = {
  home: {
    path: '/',
    labelKey: 'home',
    getHref: () => '/'
  },

  auth: {
    login: {
      path: '/auth/login',
      labelKey: 'auth.login',
      getHref: (redirect?: string) => {
        const baseUrl = '/auth/login'
        return redirect
          ? `${baseUrl}?redirect=${encodeURIComponent(redirect)}`
          : baseUrl
      }
    }
  },

  survey: {
    new: {
      path: '/s/new',
      labelKey: 'survey.new',
      getHref: () => '/s/new'
    },

    overview: {
      path: '/s/[surveyShortId]',
      labelKey: 'survey.overview',
      getHref: (surveyShortId: string) => `/s/${surveyShortId}`
    },

    edit: {
      path: '/s/[surveyShortId]/edit',
      labelKey: 'survey.edit',
      getHref: (surveyShortId: string) => `/s/${surveyShortId}/edit`
    },

    results: {
      path: '/s/[surveyShortId]/results',
      labelKey: 'survey.results.page',
      getHref: (surveyShortId: string) => `/s/${surveyShortId}/results`
    },

    resultDetail: {
      path: '/s/[surveyShortId]/results/[responseShortId]',
      labelKey: 'survey.results.detail',
      getHref: (surveyShortId: string, responseShortId: string) =>
        `/s/${surveyShortId}/results/${responseShortId}`
    },

    analytics: {
      path: '/s/[surveyShortId]/analytics',
      labelKey: 'survey.analytics',
      getHref: (surveyShortId: string) => `/s/${surveyShortId}/analytics`
    }
  },

  run: {
    index: {
      path: '/r/[surveyShortId]',
      labelKey: 'run.page',
      getHref: (surveyShortId: string) => `/r/${surveyShortId}`
    },
    done: {
      path: '/r/[surveyShortId]/done',
      labelKey: 'run.done',
      getHref: (surveyShortId: string) => `/r/${surveyShortId}/done`
    }
  },

  answer: {
    path: '/a/[surveyShortId]',
    labelKey: 'answer',
    getHref: (surveyShortId: string) => `/a/${surveyShortId}`
  }
} as const satisfies RoutesTree
