const { stat, createReadStream } = require('fs')
const { join, resolve } = require('path')
const { parse } = require('url')
const { promisify } = require('util')

const statAsync = promisify(stat)

module.exports = path => async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return

  path = join(path.replace(/^\/*/, ''))
  const url = req.serve ? req.serve : parse(req.url, false).pathname
  const filePath = resolve(path + url)

  return await statAsync(filePath)
    .then(async stat => {
      if (stat.isDirectory()) filePath = join(filePath, 'index.html')

      return await asyncStreamPipe(res, filePath)
        .then(result => {
          res.setHeader('Content-Length', stat.size)
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
    stream.pipe(res)

    stream
      .on('error', error => {
        reject(error)
      })
      .on('finish', () => {
        resolve(true)
      })
  })
}