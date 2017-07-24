//  ----------------------------------------------------------------------------------------------------------------- //
//                                                      Variables
//  ----------------------------------------------------------------------------------------------------------------- //

var aboutTrigger = $('.about__trigger'),
    aboutPage = $('.about__content'),
    workTrigger = $('.work__trigger'),
    workPage = $('.page__work'),
    workContainer = $('.work__container'),
    item = $('.item'),
    body = $('body'),
    logo = $('.header__logo'),
    projectNav = $('.project__navigation'),
    projectContainer = $('.page__project'),
    projectContent = $('.project__content'),
    close = $('.project__close');

//  ----------------------------------------------------------------------------------------------------------------- //
//                                                      Document
//  ----------------------------------------------------------------------------------------------------------------- //

$(document).ready(function() {
    ajaxProject();
    layoutClickEvent();
    projectClose();
    formToggle();
    contactForm();
    if (projectContainer.hasClass('page__project--active')){
        scrollFade();
    }
    if (window.location.href.indexOf('work') > -1) {
        History.replaceState({page: 'work'}, "Kubo at Work", '/work/');
    } else if (window.location.href.indexOf('contact') > -1) {
        History.replaceState({page: 'contact'}, "Contact Kubo", '/contact/');
        $('html, body').animate({
            scrollTop: $('#contact').offset().top - 120
        }, 500);
    } else if (location.pathname == '/') {
        History.replaceState({page: 'home'}, "Kubo.", '/');
    } else {
        var state = History.getState();
        History.replaceState({page: 'project'}, state.title, state.url);
    }
});

//  ----------------------------------------------------------------------------------------------------------------- //
//                                                      PopState
//  ----------------------------------------------------------------------------------------------------------------- //

window.onstatechange = function(e) {
    var state = History.getState();
    if (state.data.page == 'home') {
        projectInactive();
        aboutActive();
    }
    if (state.data.page === 'work') {
        projectInactive();
        workActive();
    }
    if (state.data.page === 'project') {
        var state = History.getState();
        loadContent(state.url);
    }
    if (state.data.page === 'contact') {
        projectInactive();
        aboutActive();
        setTimeout(function() {
            $('html, body').animate({
                scrollTop: $('#contact').offset().top - 120
            }, 500);
        }, 250);
    }
};

//  ----------------------------------------------------------------------------------------------------------------- //
//                                                      Loading
//  ----------------------------------------------------------------------------------------------------------------- //

window.onload = function() {
    $('#loading').addClass('loaded');
};

//  ----------------------------------------------------------------------------------------------------------------- //
//                                                      Mobile VH
//  ----------------------------------------------------------------------------------------------------------------- //

window.addEventListener("orientationchange", function() {
  if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
    document.documentElement.innerHTML = document.documentElement.innerHTML;
  }
}, false);

//  ----------------------------------------------------------------------------------------------------------------- //
//                                                      Functions
//  ----------------------------------------------------------------------------------------------------------------- //

//      Project Animations

function projectActive() {
    scrollFade();
    projectContainer.scrollTop(0).addClass('page__project--active');
    projectContent.fadeIn('slow');
    projectNav.addClass('project__navigation--active');
    body.css('overflow', 'hidden');
    $('.contact__link').click(function(e) {
        e.preventDefault();
        projectInactive();
        aboutActive();
        $('html, body').animate({
            scrollTop: $('#contact').offset().top - 120
        }, 500);
        History.pushState({page: 'contact'}, "Contact Kubo", '/contact/');
    });
}

function projectInactive() {
    projectContent.fadeOut('slow');
    projectContainer.removeClass('page__project--active');
    projectNav.removeClass('project__navigation--active');
}

//      About Animations

function aboutActive() {
    body.css('overflow', 'auto');
    workPage.css('overflow', 'hidden');
    aboutTrigger.addClass('about__trigger--disable');
    workContainer.addClass('work__container--inactive');
    aboutPage.addClass('about--active');
    workPage.addClass('page__work--inactive');
    workTrigger.addClass('work__trigger--enable');
    logo.removeClass('header__logo--small');
    $('.work__indicator--mobile').removeClass('hide');
    workPage.animate({
        scrollTop: 0
    });
}

//      Work Animations

function workActive() {
    workPage.css('overflow', 'auto');
    body.css('overflow', 'hidden');
    logo.addClass('header__logo--small');
    workTrigger.removeClass('work__trigger--enable');
    aboutTrigger.removeClass('about__trigger--disable');
    workPage.removeClass('page__work--inactive');
    aboutPage.removeClass('about--active');
    workContainer.removeClass('work__container--inactive');
    $('.work__indicator--mobile').addClass('hide');
}

//      About & Work Click Events

function layoutClickEvent() {
    aboutTrigger.on('click', function(e) {
        e.preventDefault();
        var state = $(this).attr('data-name');
        projectInactive();
        aboutActive();
        $('html, body').animate({
            scrollTop: 0
        });
        History.pushState({page: state}, "Kubo.", $(this).attr('href'));
    });
    workTrigger.on('click', function(e) {
        e.preventDefault();
        var state = $(this).attr('data-name');
        projectInactive();
        workActive();
        History.pushState({page: state}, "Kubo at Work", $(this).attr('href'));
    });
    logo.on('click', function(e) {
        e.preventDefault();
        var state = $(this).attr('data-name');
        projectInactive();
        aboutActive();
        $('html, body').animate({
            scrollTop: 0
        });
        History.pushState({page: 'home'}, "Kubo.", $(this).attr('href'));
    });
}

//      Form Toggles & Requires

function formToggle() {
    $('.require-business').prop('required', 'true');
    $('#form__toggle--general').click(function() {
        if ($(this).is(':checked')) {
            $('.business--visible').css('display', 'none');
            $('#message__field').css('display', 'block');
            $('#company__field').addClass('input__container--wide');
            $('.require-business').prop('required', 'false');
            $('.require-general').prop('required', 'true');
        }
    });
    $('#form__toggle--business').click(function() {
        if ($(this).is(':checked')) {
            $('.business--visible').css('display', 'block');
            $('#message__field').css('display', 'none');
            $('#company__field').removeClass('input__container--wide');
            $('.require-business').prop('required', 'true');
            $('.require-general').prop('required', 'false');
        }
    });
    if ($('.require-if-active').is(':visible')) {
        $(this).prop('required', 'true');
    } else {
        $(this).prop('required', 'false');
    }
}

//      Project Close Animations

function projectClose() {
    close.on('click', function(e) {
        e.preventDefault();
        var state = $(this).attr('data-name');
        projectInactive();
        workActive();
        History.pushState({page: state}, "Kubo at Work", $(this).attr('href'));
    });
}

//      Project AJAX

function loadContent(e) {
    $.ajax(e, {
        success: function(content) {
            projectContent.html($(content).find('.project__content'));
            workActive();
            projectActive();
            History.pushState({page: 'project'}, $(content).find('.project__title').text(), e);
        },
        error: function() {}
    });
}

function ajaxProject() {
    item.click(function(e) {
        e.preventDefault();
        var state = $(this).attr('data-name'),
            link = $(this).attr('href'),
            title = $(this).find('.item__meta--title').text();
        loadContent(link);
    });
}

//      Form Validation & AJAX

function contactForm(){
  $("#form__contact").validate({
    submitHandler: function(form) {
      $.ajax({
        url: "https://formspree.io/jeff@kubonyc.com",
        method: "POST",
        data: $('#form__contact').serialize(),
        dataType: "json",
        success: function() {
          $("#form__contact--submit").css('background-color','#00e676');
          $('#form__contact--submit').val("Thank You! We'll Be In Touch!");
          setTimeout(function(){
            $("#form__contact--submit").css('background-color','#F44A2E');
            $('#form__contact--submit').val("Submit");
          }, 3000);
        },
        error: function() {
          $("#form__contact--submit").css('background-color','#d32f2f');
          $('#form__contact--submit').val("Something Went Wrong...Try Again!");
          setTimeout(function(){
            $("#form__contact--submit").css('background-color','#F44A2E');
            $('#form__contact--submit').val("Submit");
          }, 1000);
        }
      });
    }
  });
}

//      Project Content Animations

function scrollFade(){
    $('.project__block').each(function(){
        var controller = new ScrollMagic.Controller();
        var scene = new ScrollMagic.Scene({
            triggerElement: this,
            triggerHook: 0.8,
            reverse: false
        })
        .setClassToggle(this, 'fade-in')
        .addTo(controller);
    });
}
