const mysql = require('mysql2/promise');
const fastify = require('fastify')({
  logger: {
    // log test
    file: 'var/point.log'
  }
})
 
const path = require('path')
const fileUpload = require('fastify-file-upload')
const fSession = require('fastify-session')
const fCookie = require('fastify-cookie')
const fFormbody = require('fastify-formbody')

fastify.register(fileUpload)
fastify.register(fFormbody)
fastify.register(fCookie)
fastify.register(fSession, {
  cookieName: 'sessionId',
  secret: 'test',
  cookie: { secure: false },
  expires: 1800000
})

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

const dbpool = mysql.createPool({
  host: 'localhost',
  user: 'example',
  password: 'example',
  database: 'example',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


const highlight = async(text,search_keyword) => {  
  let regex = new RegExp(search_keyword);
  let highlighted = `<strong>${search_keyword}</strong>`  
  let parsedText = text.replace(regex, highlighted);
  return parsedText
}

const searchQuiz = async(search_key_array) => {
    let sql = 'SELECT * FROM itempool WHERE id > 0 '
    let resultSet = {}
    let resultArray = []
    for(const skey of search_key_array) {
      let keyLen = Buffer.byteLength(skey.trim(), 'utf8')
      if (keyLen > 0) {
        sql += " AND items LIKE '%"+skey+"%'"
      }
    }
    // Log Test
    fastify.log.info("search func Search SQL : "+sql)
    const conn = await dbpool.getConnection(async conn => conn)
    const [rows]  = await conn.execute(sql)
    for(const row of rows) {
      let tmp = {}
      for(const mkey of search_key_array) {
        tmp.contents = await highlight(row.items,mkey)
      }
      tmp.answer = row.answer
      resultArray.push(tmp)
    }
    resultSet.keyword = search_key_array.join(",")
    resultSet.count = resultArray.length
    resultSet.data = resultArray
    conn.release();
    return resultSet
};

 
fastify.get('/', async (request, reply) => {
  reply.sendFile('index.html')
})

fastify.get('/about', async (request, reply) => {
  reply.sendFile('about.html')
})

fastify.get('/init.js', async (request, reply) => {
  reply.sendFile('init.js')
})

fastify.get('/main.css', async (request, reply) => {
  reply.sendFile('main.css')
})



fastify.post('/login', (request, reply) => {
  const { email, password } = request.body
  if (password === 'abcdef') {
    request.session.authenticated = true
    reply.redirect('/upload')
  } else {
    reply.redirect(401, '/login')
  }
});

// Need Auth Process
fastify.get('/upload', async (request, reply) => {
  reply.sendFile('upload.html')
})

fastify.post('/upload', async (request, reply) => {
  const files = req.raw.files
  console.log(files)
  let fileArr = []
  for(let key in files){
    fileArr.push({
      name: files[key].name,
      mimetype: files[key].mimetype
    })
  }
  reply.send(fileArr)
})

fastify.get('/search', async (request, reply) => {
  reply.type('application/json').code(200)
  let searchKey = request.query.skey
  let resultSet = await searchQuiz(searchKey.split(","))
  return { resultSet }
})

fastify.listen(3000,'0.0.0.0', function (err, address) {
  if (err) {
    console.log("Err? : ",err)
    // log test
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
