export const getValueByKey = (obj1, obj2) => {
  let obj = {}
  Object.keys(obj1).forEach(p => {
    if(obj2[p]) {
      obj[p] = obj2[p]
    } else {
      obj[p] = obj1[p]
    }
  })
  return obj
}

export function debounce(fn, delay) {
  let timeout = null
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}


const ID = ((id) => {
  return () => id++
})


export const UID = ID(1)