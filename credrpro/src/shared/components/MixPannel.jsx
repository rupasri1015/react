import mixpanel from 'mixpanel-browser'

mixpanel.init('61b35f121613a195d83c85c9795f690e')

const isProduction = process.env.NODE_ENV === 'production'

const Mixpanel = {
  identify: (id) => {
    if (isProduction) mixpanel.identify(id)
  },
  alias: (id) => {
    if (isProduction) mixpanel.alias(id)
  },
  track: (name, props) => {
    if (isProduction) mixpanel.track(name, props)
  },
  people: {
    set: (props) => {
      if (isProduction) mixpanel.people.set(props)
    }
  }
}

export default Mixpanel