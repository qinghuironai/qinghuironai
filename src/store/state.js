const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  cachedViews: []
}

export default state
