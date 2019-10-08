/*
 * @Author: Arius
 * @Date:   2019-10-05 05:32:08
 * @Last Modified by:   Arius
 * @Last Modified time: 2019-10-08 16:43:18
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

function download (href) {
  const eleLink = document.createElement('a')
  eleLink.download = ''
  eleLink.href = href
  eleLink.click()
  eleLink.remove()
}

function downloadByData (url) {
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    // const ext = image.src.substring(image.src.lastIndexOf('.')+1).toLowerCase()
    const ext = 'png'
    const dataURL = canvas.toDataURL('image/' + ext)
    console.log(ext, image.width, image.height)
    download(dataURL)
  }
}

function downloadByBlob (url) {
  let image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob)
      download(url)
      // 用完释放URL对象
      URL.revokeObjectURL(url)
    })
  }
}

export {
  downloadByBlob,
  downloadByData,
  download,
  isInViewPortOfOne
}
