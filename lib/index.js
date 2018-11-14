const { stat, createReadStream } = require('fs')
const { join, resolve } = require('path')
const { parse } = require('url')
const { promisify } = require('util')

const statAsync = promisify(stat)

module.exports = path => async (req, res) => {
  path = join(path.replace(/^\/*/, ''))
  const reg = new RegExp('^\/' + path)
  let url = req.serve ? req.serve : parse(req.url, false).pathname

  if (req.method !== 'GET' && req.method !== 'HEAD') return

  if (req.serve || url.match(reg)) {
    url = req.serve ? resolve(path + url) : resolve('.' + url)
    return await statAsync(url)
      .then(async stat => {
        if (stat.isDirectory()) {
          console.log('directory')
          url = join(url, 'index.html')
          res.setHeader('Content-Type', 'text/html; charset=uft-8')
        }

        return await asyncStreamPipe(res, url)
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
}

function asyncStreamPipe(res, filePath) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath)
    stream.pipe(res)

    stream.on('error', error => {
      reject(error)
    })

    stream.on('finish', () => {
      resolve(true)
    })
  })
}