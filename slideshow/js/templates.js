;(function() {
  if (typeof Templates !== 'object') {
    Templates = {};
  }

  var elementStart = '<div class="slideWrapper <%= type %>Element">';
  var elementEnd = '</div>';

  Templates = {
    videoWithSource : _.template([elementStart,
      '<iframe id="player" width="100%" height="100%" src="<%= videoSrc %>" frameborder="0"></iframe>',
      '<aside class="attribution">',
        '<p>',
          '<% if(caption)  { %> <%= caption %> <span>(video by <a href="<%= permalink %>" target="_blank"><%= attrName %></a>)</span><% } %>',
          '<% if(!caption) { %><span>Video by <a href="<%= permalink %>" target="_blank"><%= attrName %></a></span><% } %>',
        '</p>',
      '</aside>',
      elementEnd].join('')),
    
    videoNoSource : _.template(elementStart + '<%= videoHTML %>' + elementEnd),

    image: _.template([elementStart,
      '<img class="photoSlide" src="<%= imgUrl %>" />',
      '<aside class="attribution">',
        '<p class="<%= srcName %>">',
          '<% if(caption)  { %><%= caption %> <span>(photo by <a href="<%= permalink %>" target="_blank"><%= attrName %></a>)</span><% } %>',
          '<% if(!caption) { %><span>Photo by <a href="<%= permalink %>" target="_blank"><%= attrName %></a></span><% } %>',
        '</p>',
      '</aside>',
      elementEnd].join('')),

    text : _.template([elementStart,
      '<p class="textP">',
        '<span><%= text %></span>',
      '</p>',
      elementEnd].join('')),

    link : _.template([elementStart,
      '<div class="link_container">',
        '<div class="link_container_inner">',
          '<div class="link">',
            '<p><img src="<%= linkThumb %>" /><%= linkDesc %></p>',
            '<aside>',
              '<div class="username_container">',
                '<div class="username">',
                  '<a href="<%= permalink %>" target="_blank"><%= attrName %></a>',
                '</div>',
              '</div>',
              '<div class="date_actions">',
                '<div class="date">',
                  '<a href="<%= permalink %>" target="_blank"><%= timestamp %></a>',
                '</div>',
              '</div>',
            '</aside>',
          '</div>',
        '</div>',
      '</div>',
      elementEnd].join('')),

    quote : {
      twitterImage : _.template([elementStart,
        '<div class="quote_container twitter-image" style="<%= background %>">',
          '<div class="quote_container_inner">',
            '<img class="photoSlide" src="<%= imageUrl %>" />',
              '<aside class="attribution">',
                '<div class="user-block"><a href="//twitter.com/<%= username %>" target="_blank" class="avatar">',
                  '<img src="<%= thumbnail %>" /></a>',
                  '<span class="full-name"><%= name %></span>',
                  '<span><a href="//twitter.com/<%= username %>" target="_blank" class="handle">@<%= username %></a></span>',
                '</a></div>',
                '<div class="content"><%= text %>',
                '<div class="meta"><a href="<%= permalink %>" target="_blank"><%= timestamp %></a>',
                  '<div class="actions">',
                    '<a href="//twitter.com/intent/tweet?in_reply_to=<%= tweet_id %>&related=<%= username %>" class="reply" target="_blank">',
                      '<i></i><span>Reply</span>',
                    '</a>',
                    '<a href="//twitter.com/intent/retweet?tweet_id=<%= tweet_id %>&related=<%= username %>" class="retweet" target="_blank">',
                      '<i></i><span>Retweet</span>',
                    '</a>',
                    '<a href="//twitter.com/intent/favorite?tweet_id=<%= tweet_id %>&related=<%= username %>" class="favorite" target="_blank">',
                      '<i></i><span>Favorite</span>',
                    '</a>',
                  '</div>',
                '</div>',
              '</div></aside>',
          '</div>',
        '</div>',
        elementEnd].join('')),

      twitter : _.template([elementStart,
        '<div class="quote_container" style="<%= background %>">',
          '<div class="quote_container_inner">',
            '<div class="quote">',
              '<aside>',
                '<div class="avatar_container">',
                  '<a href="//twitter.com/<%= username %>" target="_blank">',
                    '<img src="<%= thumbnail %>" />',
                  '</a>',
                '</div>',
                '<div class="username_container">',
                  '<div class="username">',
                    '<a href="//twitter.com/<%= username %>" target="_blank">@<%= username %></a>',
                  '</div>',
                  '<div class="name"><%= name %>',
                  '</div>',
                '</div>',
              '</aside>',
              '<p><%= text %></p>',
              '<div class="date_actions">',
                  '<div class="date">',
                    '<a href="<%= permalink %>" target="_blank"><%= timestamp %></a>',
                  '</div>',
                  '<div class="actions">',
                    '<a href="//twitter.com/intent/tweet?in_reply_to=<%= tweet_id %>&related=<%= username %>" class="reply" target="_blank">',
                      '<i></i><span>Reply</span>',
                    '</a>',
                    '<a href="//twitter.com/intent/retweet?tweet_id=<%= tweet_id %>&related=<%= username %>" class="retweet" target="_blank">',
                      '<i></i><span>Retweet</span>',
                    '</a>',
                    '<a href="//twitter.com/intent/favorite?tweet_id=<%= tweet_id %>&related=<%= username %>" class="favorite" target="_blank">',
                      '<i></i><span>Favorite</span>',
                    '</a>',
                  '</div>',
                '</div>',
            '</div>',
          '</div>',
        '</div>',
        elementEnd].join('')),

      other : _.template([elementStart,
        '<div class="quote">',
          '<p><%= text %></p>',
          '<aside>',
            '<div class="username_container">',
              '<div class="username">',
                '<a href="<%= permalink %>" target="_blank"><%= name %></a>',
              '</div>',
            '</div>',
            '<div class="date_actions">',
              '<div class="date">',
                '<a href="<%= permalink %>" target="_blank"><%= timestamp %></a>',
              '</div>',
            '</div>',
          '</aside>',
        '</div>',
        elementEnd].join(''))
    },

    title : _.template([
      '<div>',
        '<div class="user">',
          '<a class="avatar" href="http://storify.com/<%= story.author.username %>" target="_blank"><img src="<%= Storify.utils.proxy_image(story.author.avatar,48) %>" /></a>',
          '<a class="permalink" href="http://storify.com/<%= story.author.username %>" target="_blank"><%= story.author.username %></a>',
        '</div>',
        '<h1 class="title"><a href="<%= story.permalink %>" target="_blank" title="View the story on Storify"><%= story.title %></a></h1>',
      '</div>'].join('')),

    lastSlide : _.template([
      '<div class="slideWrapper lastElement">',
        '<div class="lastElementInner">',
          '<h2>Share this story</h2>',
          '<div class="buttons">',
            '<a href="#" class="facebook"><span>Share on Facebook</span></a>',
            '<a href="#" class="twitter"><span>Share on Twitter</span></a>',
          '</div>',
          '<h2>Embed this slideshow</h2>',
          '<div class="field">',
            '<input type="text" name="script" value="<script src="<%= storyurl %>.js?template=slideshow"></script><noscript><a href="<%= storyurl %>" target="_blank">View "<%= title %>" on Storify</a></noscript>" readonly="readonly"/>',
            '<a href="#" class="copy">Copy</a>',
            '<div class="copied">Copied!</div>',
          '</div>',
          '<h3>Create your own stories at <a href="http://www.storify.com" target="_blank">storify.com</a> &rarr;</h3>',
        '</div>',
      '</div>'].join(''))
  };
})();

