const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  cachedViews: [],
  showTab: true
}

export default state
