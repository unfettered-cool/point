require 'sinatra'
require 'sinatra/cross_origin'
require 'mysql2'
require 'json'
require 'slim'
require 'logger'

def highlight(text,search_string)
  keywords = search_string.squeeze.strip.split(" ").compact.uniq
  matcher = Regexp.new( '(' + keywords.join("|") + ')' )
  highlighted = text.gsub(matcher) { |match| "<strong>#{match}</strong>" }
  return highlighted
end
  
def search_quiz(search_key_array)
  client = Mysql2::Client.new( host: 'dbhost', username: 'dbuser', database: 'dbname', password: 'dbpassword')
  
  sql = 'SELECT * FROM itempool WHERE id > 0 '
  resultSet = Hash.new
  resultArray = Array.new
  logger.info search_key_array
  search_key_array.each do |skey|
    if !skey.strip.empty?
      sql += " AND items LIKE '%" + client.escape(skey) + "%'"
    end
  end

  logger.info sql
  results = client.query(sql)
  results.each do |row|
    tmp = Hash.new
    search_key_array.each do | mkey |
      tmp['contents'] = highlight(row['items'],mkey)
    end
    tmp['answer'] = row['answer']
    resultArray.push(tmp)
  end
  resultSet["keyword"] = search_key_array.join(",")
  resultSet["count"] = resultArray.length
  resultSet["data"] = resultArray
  return resultSet.to_json
end

class App < Sinatra::Base
  configure do
    enable :sessions, :cross_origin, :logging
    disable :static
    set :session_secret, 'point'
    set :bind, '0.0.0.0'
    set :port, '8500'
    set :server, :puma
    set :public_folder, File.dirname(__FILE__) + '/public'
  end

  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
    env['rack.logger'] = Logger.new "var/log/point.log"
  end

  get '/' do
    redirect '/index.html'
  end

  get '/search' do
    content_type :json
    search_key_array = params[:skey].split(',')
    search_quiz(search_key_array)
  end
end