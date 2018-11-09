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
      .then(stat => {
        if (stat.isDirectory()) {
          url = join(url, 'index.html')
          res.setHeader('Content-Type', 'text/html; charset=uft-8')
        }

        res.setHeader('Content-Length', stat.size)
        const stream = createReadStream(url)
        stream.on('error', error => {
          console.log(error)
          return
        })
        return stream.pipe(res)
      })
      .catch(error => {
        console.log(error)
        return
      })
  }
}