/*
 * @Author: Arius
 * @Date:   2019-10-05 05:32:08
 * @Last Modified by:   Arius
 * @Last Modified time: 2019-10-05 05:33:39
 */

function isInViewPortOfOne (el, pad = 100) {
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  const offsetTop = el.offsetTop
  const scrollTop = document.documentElement.scrollTop
  const top = offsetTop - scrollTop
  return top <= viewPortHeight + pad
}

export {
  isInViewPortOfOne
}
