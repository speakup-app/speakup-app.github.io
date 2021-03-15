(function () {
  var cache = {};
  var supportedPaths = [
    '/',
    '/features',
    '/publications',
    '/team',
    '/terms'
  ];

  var get = function (url, cb) {
    if (cache[url]) return cb(cache[url]);

    var request = ajax().get(url)
      .then(function (data) {
        cache[url] = data;
        cb(data);
      })
      .catch(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      });
  };

  var setupHome = function () {
    // intro video
    var playButtonEl = document.getElementsByClassName('intro__play');
    var screenshotEl = document.getElementsByClassName('intro__screenshot');
    var videoEl = document.getElementsByClassName('intro__video');

    var showVideo = function () {
      if (playButtonEl.length !== 1 && videoEl.length !== 1) return;

      screenshotEl[0].style.visibility = 'hidden';
      playButtonEl[0].style.visibility = 'hidden';
      videoEl[0].style.display = 'block';
      videoEl[0].src = 'https://www.youtube.com/embed/oxPw5GhAOuU?rel=0&showinfo=0&autoplay=1';
    };

    if (playButtonEl.length === 1) {
      playButtonEl[0].addEventListener('click', showVideo);
    }

    if (screenshotEl.length === 1) {
      screenshotEl[0].addEventListener('click', showVideo);
    }
  };

  window.init = {
    ctx: function (ctx, next) {
      ctx.data = {};
      ctx.partials = {};
      next();
    }
  };

  window.route = {
    home: function (ctx, next) {
      get('/views/home.html', function (html) {
        ctx.data.index = 'home';
        ctx.partials.title = 'SpeakUp';
        ctx.partials.content = html;
        setupHome();
        next();
      });
    },
    features: function (ctx, next) {
      get('/views/features.html', function (html) {
        ctx.data.index = 'features';
        ctx.partials.title = 'Features';
        ctx.partials.content = html;
        next();
      });
    },
    publications: function (ctx, next) {
      get('/views/publications.html', function (html) {
        ctx.data.index = 'publications';
        ctx.partials.title = 'Publications';
        ctx.partials.content = html;
        next();
      });
    },
    team: function (ctx, next) {
      get('/views/team.html', function (html) {
        ctx.data.index = 'team';
        ctx.partials.title = 'Team';
        ctx.partials.content = html;
        next();
      });
    },
    terms: function (ctx, next) {
      get('/views/terms.html', function (html) {
        ctx.data.index = 'terms';
        ctx.partials.title = 'Terms';
        ctx.partials.content = html;
        next();
      });
    }
  };

  window.render = {
    content: function (ctx, next) {
      if (supportedPaths.indexOf(ctx.params[0]) < 0) return next();

      document.getElementById('title').innerHTML = ctx.partials.title;
      document.getElementById('content').innerHTML = ctx.partials.content;

      if (typeof done === 'function') done(ctx.data.index);
    }
  };

  window.done = function (index) {
    switch (index) {
      case 'home': {
        setupHome();
        break;
      }
    }

    window.scrollTo(0, 0);
  };
}());

// legacy route redirects
page('/box', '/features');

// current routes
page('*', init.ctx);
page('/', route.home);
page('/features', route.features);
page('/publications', route.publications);
page('/team', route.team);
page('/terms', route.terms);
page('*', render.content);
page();
