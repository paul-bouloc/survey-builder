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
    run: {
      path: '/s/[surveyId]/run',
      labelKey: 'survey.run',
      getHref: (surveyId: string) => `/s/${surveyId}/run`
    },
    edit: {
      path: '/s/[surveyId]/edit',
      labelKey: 'survey.edit',
      getHref: (surveyId: string) => `/s/${surveyId}/edit`
    },
    results: {
      path: '/s/[surveyId]/res',
      labelKey: 'survey.results',
      getHref: (surveyId: string) => `/s/${surveyId}/res`
    }
  }
} as const
