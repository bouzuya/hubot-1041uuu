# Description
#   A Hubot script that returns 1041uuu.tumblr.com images
#
# Configuration:
#   None
#
# Commands:
#   hubot 1041uuu - 1041uuu.tumblr.com images
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  request = require 'request-b'
  cheerio = require 'cheerio'

  loaded = false
  images = []

  robot.respond /1041uuu$/i, (res) ->
    image = res.random images
    res.send "#{image.img}\n#{image.url}"

  fetchAll = (images, page) ->
    baseUrl = 'http://1041uuu.tumblr.com'
    url = baseUrl + '/page/' + page
    request(url).then (r) ->
      $ = cheerio.load r.body
      hasNext = $('a.next').length > 0
      $('#content .post').each ->
        e = $ @
        url = e.find('.permalink').attr('href')
        img = e.find('img').attr('src')
        images.push { url, img }
      if hasNext then fetchAll(images, page + 1) else images

  fetchAll(images, 1).then (images) ->
    loaded = true
    robot.logger.info 'hubot-1041uuu: loaded ' + images.length
