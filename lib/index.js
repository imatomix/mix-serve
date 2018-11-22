const { stat, createReadStream } = require('fs')
const { join, resolve } = require('path')
const { parse } = require('url')
const { promisify } = require('util')

const asyncStat = promisify(stat)
const defaults = {
  route: '/',
  public: './'
}

module.exports = (options = {}) => (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return
  options = Object.assign({}, defaults, options)
  if (req.url.indexOf(options.route) !== 0) return

  const url = parse(req.url).pathname.substr(options.route.length)
  const filePath = join(resolve(options.public), url)

  return sendStaticFile(res, filePath)
}

async function sendStaticFile(res, filePath) {
  return await asyncStat(filePath)
    .then(async stat => {
      if (stat.isDirectory()) {
        filePath = join(filePath, 'index.html')
        return sendStaticFile(res, filePath)
      }

      res.setHeader('Content-Length', stat.size)

      return await asyncStreamPipe(res, filePath)
        .then(result => result)
        .catch(error => {
          console.log(error)
          return
        })
    })
    .catch(error => {
    })
}

function asyncStreamPipe(res, filePath) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath)
    stream
      .pipe(res)
      .on('error', error => {
        reject(error)
      })
      .on('finish', () => {
        resolve(true)
      })
  })
}