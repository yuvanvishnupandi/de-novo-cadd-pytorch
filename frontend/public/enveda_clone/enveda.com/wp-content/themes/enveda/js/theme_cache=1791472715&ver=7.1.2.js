$(document).ready(function () {

	$('.scrollto').on('click', function (event) {
		event.preventDefault();

		var target = $(this.getAttribute('href'));

		if (target.length) {
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 500); // Adjust the speed as needed
		}
	});



	$('.menu-opener').on('click', function (event) {

		$('#mobile-menu').fadeIn();

	});

	$('#mobile-menu .close-button').on('click', function (event) {

		$('#mobile-menu').fadeOut();

	});


	$(document).on('click', '.more-info', function (e) {
		e.preventDefault(); // Prevent the default link behavior

		// Find the closest parent with '.position-relative' and toggle 'active' class
		$(this).closest('.position-relative').toggleClass('active');
	});


	$('.js-year-filter').on('change', function () {
		var year = $(this).val();

		$('#list > .row > [data-year]').each(function () {
			$(this).toggle(!year || $(this).data('year').toString() === year);
		});
	});



	let sliderInitialized = false;

	// Function to check if the element is in view
	// function isElementInViewport($el) {
	//     const bounds = $el[0].getBoundingClientRect();
	//     const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	//     return bounds.top < viewportHeight && bounds.bottom > 0;
	// }

	function initSlider() {
		if (!sliderInitialized) {
			$('.logo-wrapper').slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 0,
				arrows: false,
				pauseOnFocus: false,
				pauseOnHover: false,
				cssEase: 'linear',
				infinite: true,
				centerMode: true,
				lazyLoad: false,
				speed: 5000,
				useTransform: false,
				// cssEase: 'linear',
				responsive: [
					{
						breakpoint: 768, // Mobile breakpoint (adjust as needed)
						settings: {
							slidesToShow: 2, // Show 2 logos on smaller screens
							slidesToScroll: 1
						}
					}
				]
			});
			sliderInitialized = true;

		}
	}

	gsap.from(".section2", {
		scrollTrigger: {
			trigger: "#investors",
			start: "top 100%", // When the top of the section hits 80% of the viewport
			onEnter: () => {
				initSlider();
				// const $slider = $('.logo-wrapper');
				// if (isElementInViewport($slider)) {
				//     initSlider();
				// }
			}
		},
	});





	// Affix actions
	// $(window).on('scroll', function(event) {
	// 	var scrollValue = $(window).scrollTop();
	// 	if (scrollValue > 0) {
	// 		$('#header').addClass('affix');
	// 	} else {
	// 		$('#header').removeClass('affix');
	// 	}
	// });


	// Slide Out Menu
	// $('#hamburger').click(function() {

	// 	$('#slide-out').toggleClass('active');
	// 	$('body').toggleClass('slide-out-open');
	// });

	// $('#slide-out ul li.menu-item-has-children > a').click(function() {
	// 	$(this).find('.sub-menu').slideUp();

	// 	if ( $(this).hasClass( "active" ) ) {
	// 		$(this).parent().find('.sub-menu').first().slideUp();
	// 		$(this).removeClass('active');
	// 	} else {
	// 		$(this).parent().find('.sub-menu').first().slideDown();
	// 		$(this).addClass('active');
	// 	}
	// 	return false;
	// });
	// End slide out menu



	var slickOpts = {
		easing: 'swing',
		speed: 700,
		centerMode: true,
		arrows: true,
		infinite: true,
		dots: true,
		fade: true,
	};
	$('#reviews').slick(slickOpts);



	// On clicking the overlay trigger
	$('.person.opens').on('click', function () {
		// Get the current ID
		var overlayId = $(this).attr('href');

		console.log(overlayId);

		// Fade in the specific overlay
		$(overlayId).fadeIn();

		// Add a class to prevent body scrolling
		$('body').addClass('no-scroll');

		return false;
	});

	// On clicking the close button
	$('.close-button').on('click', function () {
		// Fade out all overlays
		$('.person-overlay').fadeOut();

		// Remove the no-scroll class
		$('body').removeClass('no-scroll');
	});



	// Video slider (Swiper) - reusable module, see .video-slider styles in style.css
	if (typeof Swiper !== 'undefined') {
		$('.video-slider .swiper').each(function () {
			new Swiper(this, {
				slidesPerView: 1.15,
				spaceBetween: 16,
				loop: false,
				navigation: {
					nextEl: $(this).closest('.video-slider').find('.video-slider-next')[0],
					prevEl: $(this).closest('.video-slider').find('.video-slider-prev')[0],
				},
				breakpoints: {
					768: {
						slidesPerView: 1.6,
						spaceBetween: 24,
					},
					1200: {
						slidesPerView: 2.25,
						spaceBetween: 32,
					}
				}
			});
		});
	}







});











