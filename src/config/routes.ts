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
      path: '/survey/new',
      labelKey: 'survey.new',
      getHref: () => '/survey/new'
    },

    overview: {
      path: '/survey/[surveyShortId]',
      labelKey: 'survey.overview',
      getHref: (surveyShortId: string) => `/survey/${surveyShortId}`
    },

    edit: {
      path: '/survey/[surveyShortId]/edit',
      labelKey: 'survey.edit',
      getHref: (surveyShortId: string) => `/survey/${surveyShortId}/edit`
    },

    preview: {
      path: '/survey/[surveyShortId]/preview',
      labelKey: 'survey.preview',
      getHref: (surveyShortId: string) => `/survey/${surveyShortId}/preview`
    },

    results: {
      path: '/survey/[surveyShortId]/runesults',
      labelKey: 'survey.results.page',
      getHref: (surveyShortId: string) => `/survey/${surveyShortId}/results`
    },

    resultDetail: {
      path: '/survey/[surveyShortId]/results/[responseShortId]',
      labelKey: 'survey.results.detail',
      getHref: (surveyShortId: string, responseShortId: string) =>
        `/survey/${surveyShortId}/results/${responseShortId}`
    },

    analytics: {
      path: '/survey/[surveyShortId]/analytics',
      labelKey: 'survey.analytics',
      getHref: (surveyShortId: string) => `/survey/${surveyShortId}/analytics`
    }
  },

  run: {
    index: {
      path: '/run/[surveyShortId]',
      labelKey: 'run.page',
      getHref: (surveyShortId: string) => `/run/${surveyShortId}`
    },
    done: {
      path: '/run/[surveyShortId]/done',
      labelKey: 'run.done',
      getHref: (surveyShortId: string) => `/run/${surveyShortId}/done`
    }
  },

  answer: {
    path: '/answer/[surveyShortId]',
    labelKey: 'answer',
    getHref: (surveyShortId: string) => `/answer/${surveyShortId}`
  }
} as const satisfies RoutesTree
