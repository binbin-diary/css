function getCurrentTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 > 10 ? date.getMonth() : '0' + (date.getMonth() + 1)
  const day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`
  const hour = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`
  const min = date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`
  const seconds = date.getSeconds() > 10 ? date.getSeconds() : `0${date.getSeconds()}`
  const time = `${year}-${month}-${day} ${hour}:${min}:${seconds}`
  return time
}

module.exports = {
  getCurrentTime
}