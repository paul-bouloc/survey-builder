export const routes = {
  home: {
    path: '/',
    name: 'My Surveys',
    getHref: () => '/'
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
