export const routes = {
  home: {
    path: '/',
    name: 'My Surveys',
    getHref: () => '/'
  },
  auth: {
    login: {
      path: '/auth/login',
      name: 'Login',
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
      name: 'New Survey',
      getHref: () => '/s/new'
    },
    run: {
      path: '/s/[surveyId]/run',
      name: 'Run Survey',
      getHref: (surveyId: string) => `/s/${surveyId}/run`
    },
    edit: {
      path: '/s/[surveyId]/edit',
      name: 'Edit Survey',
      getHref: (surveyId: string) => `/s/${surveyId}/edit`
    },
    results: {
      path: '/s/[surveyId]/res',
      name: 'Survey Results',
      getHref: (surveyId: string) => `/s/${surveyId}/res`
    }
  }
} as const
