import confirm from './index.vue'

const Confirm = {}
Confirm.install = function (Vue, options) {
  const ConfirmInstance = Vue.extend(confirm)
  let currentConfirm
  const initInstance = () => {
    currentConfirm = new ConfirmInstance()
    let ConfirmEl = currentConfirm.$mount().$el
    document.body.appendChild(ConfirmEl)
  }
  Vue.prototype.$confirm = {
    showConfirm (options) {
      if (!currentConfirm) {
        initInstance()
      }
      if (typeof options === 'string') {
        currentConfirm.content = options
      } else if (typeof options === 'object') {
        Object.assign(currentConfirm, options)
      }
      return currentConfirm.showConfirm()
        .then(val => {
          currentConfirm = null
          return Promise.resolve(val)
        })
        .catch(err => {
          currentConfirm = null
          return Promise.reject(err)
        })
    }
  }
}

export default Confirm
