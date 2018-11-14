const { stat, createReadStream } = require('fs')
const { join, resolve } = require('path')
const { parse } = require('url')
const { promisify } = require('util')

const statAsync = promisify(stat)

module.exports = path => (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return

  path = join(path.replace(/^\/*/, ''))
  const url = req.serve ? req.serve : parse(req.url, false).pathname
  const filePath = resolve(path + url)

  return sendStaticFile(res, filePath)
}

async function sendStaticFile(res, filePath) {
  return await statAsync(filePath)
    .then(async stat => {
      if (stat.isDirectory()) {
        filePath = join(filePath, 'index.html')
        return sendStaticFile(res, filePath)
      }

      res.setHeader('Content-Length', stat.size)

      return await asyncStreamPipe(res, filePath)
        .then(result => {
          return result
        })
        .catch(error => {
          console.log(error)
          return
        })
    })
    .catch(error => {
      console.log(error)
      return
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