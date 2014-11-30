// Description
//   A Hubot script that returns 1041uuu.tumblr.com images
//
// Configuration:
//   None
//
// Commands:
//   hubot 1041uuu - 1041uuu.tumblr.com images
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var cheerio, fetchAll, images, loaded, request;
  request = require('request-b');
  cheerio = require('cheerio');
  loaded = false;
  images = [];
  robot.respond(/1041uuu$/i, function(res) {
    var image;
    image = res.random(images);
    return res.send("" + image.img + "\n" + image.url);
  });
  fetchAll = function(images, page) {
    var baseUrl, url;
    baseUrl = 'http://1041uuu.tumblr.com';
    url = baseUrl + '/page/' + page;
    return request(url).then(function(r) {
      var $, hasNext;
      $ = cheerio.load(r.body);
      hasNext = $('a.next').length > 0;
      $('#content .post').each(function() {
        var e, img;
        e = $(this);
        url = e.find('.permalink').attr('href');
        img = e.find('img').attr('src');
        return images.push({
          url: url,
          img: img
        });
      });
      if (hasNext) {
        return fetchAll(images, page + 1);
      } else {
        return images;
      }
    });
  };
  return fetchAll(images, 1).then(function(images) {
    loaded = true;
    return robot.logger.info('hubot-1041uuu: loaded ' + images.length);
  });
};
