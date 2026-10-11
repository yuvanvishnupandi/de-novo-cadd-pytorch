document.addEventListener("DOMContentLoaded", (event) => {

	gsap.registerPlugin(ScrollTrigger,ScrollSmoother)


	// Function to detect Android devices
	function isAndroid() {
		return /Android/i.test(navigator.userAgent);
	}

	// Now you can use GSAP directly without the need for `import`
	if (!isAndroid() && !document.body.classList.contains('page-template-page-clinical-trial') && !document.body.classList.contains('page-template-page-clinical-trial-follow-up') && !document.body.classList.contains('page-template-page-clinical-trial-asthma')  && !document.body.classList.contains('page-template-page-env308')) {
		ScrollSmoother.create({
			wrapper: '.wrapper',
			content: '.smooth-content',
			smooth: 1,
			smoothTouch: 0,
			effects: true,
		});
	}





	// Hero
	gsap.timeline({ repeat: -1 })
        .to(".molecule-1", { opacity: 1, duration: 1,  delay: 0.5,}) 
        .to(".molecule-1", { opacity: 0, duration: 2,  delay: 0.5, scale:1.1 }) 
        .to(".graph-1", { opacity: 1, duration: 1, delay: -3.4,})
        .to(".graph-1", { opacity: 0, duration: 2, delay: -2, scale:1.1 })
        .to(".molecule-2", { opacity: 1, duration: 1,  delay: -1,}) 
        .to(".molecule-2", { opacity: 0, duration: 2,  delay: 0.5, scale:1.1 }) 
        .to(".graph-2", { opacity: 1, duration: 1, delay: -3.2,})
        .to(".graph-2", { opacity: 0, duration: 2, delay: -2, scale:1.1 })
		.to(".molecule-3", { opacity: 1, duration: 1,  delay: -1,}) 
        .to(".molecule-3", { opacity: 0, duration: 2,  delay: 0.5, scale:1.1 }) 
        .to(".graph-3", { opacity: 1, duration: 1, delay: -3.2,})
        .to(".graph-3", { opacity: 0, duration: 2, delay: -2, scale:1.1 });
       	

       	// .to(".mol-grid", { opacity: 1, duration: 2, delay: -1})
       	// .to(".mol-grid", { opacity: 0, duration: 2, delay: 0.5})
        // .to(".molecule-3", { opacity: 1, duration: 1, delay: -1}) 
        // .to(".molecule-3", { opacity: 0, duration: 3, delay: 0.5, scale:1.1});


    // gsap.timeline({ repeat: -1 })
    // 	.to(".mol-grid", { opacity: 1, duration: 2, delay: 2.5})
    // 	.to(".mol-grid", { opacity: 0, duration: 2, delay: 0.5});


	// gsap.timeline({ repeat: -1 })
    //     .to(".molecule-3", { opacity: 1, duration: 1, delay: 4 }) // Fade in the first image
    //     .to(".molecule-3", { opacity: 0, duration: 3, delay: 0.1, scale:1.1});
        
        

    
    // gsap.timeline({ repeat: -1 }).to(".mol-grid-dots", { opacity: 1, duration: 1, delay: 3});





    // Enable Enveda Animation

		// Pin the section and set up the scroll trigger
        // ScrollTrigger.create({
        // 	trigger: '#enable',
        // 	start: 'top top',
		// 	// Adjust based on how long you want the section to be pinned
        // 	end: '+=200%', 
        // 	pin: true,
        // 	scrub: true,
        // });

        // Create a GSAP timeline
        const enableTimeline = gsap.timeline({
        	scrollTrigger: {
        		// scroller: '#enable',
        		trigger: '#enable',
        		start: 'top top',
				end: '+=200%', // Adjust based on desired scroll duration
				// smooth: ,
				pin: true, // Pin the section during the animation
				scrub: true, // Smoothly scrubs the animation with scroll
				// markers: true, // Uncomment for debugging
			}
		});

		ScrollTrigger.normalizeScroll({allowNestedScroll: true, type: "touch"  });

        enableTimeline.to('.en', {
        	// opacity: 0,
        	x: '-18vw',
        	duration: 1,
        	ease: 'power2.out',
        });

        enableTimeline.to('.veda', {
        	// opacity: 0,
        	x: '18vw',
        	duration: 0.7,
        	ease: 'power2.out',
        }, 0);

        enableTimeline.from('.content-left', {
        	opacity: 0,
        	y: '5vh',
        	duration: 0.5,
        	ease: 'power2.out',
        }, 0.4);

        enableTimeline.from('.content-right', {
        	opacity: 0,
        	y: '5vh',
        	duration: 0.5,
        	ease: 'power2.out',
        }, 0.5);


        enableTimeline.from('.en span', {
        	opacity: 0,
        	y: '-10vh',
        	duration: 0.7,
        	ease: 'power2.out',
        },'-=0.2');

        enableTimeline.to('.veda', {
        	opacity: 0,
        	y: '10vh',
        	duration: 0.7,
        	ease: 'power2.out',
        },'-=0.7');


        enableTimeline.from('.knowledge', {
        	opacity: 0,
        	y: '7vh',
        	duration: 0.7,
        	ease: 'power2.out',
        },'-=0.2');


        enableTimeline.to('.en', {
        	y: '-3vh',
        	duration: 0.7,
        	ease: 'power2.out',
        },'-=0.7');


        enableTimeline.to('.blur-1', {
        	// opacity: 0,
        	scale: 1.1,
        	duration: 1,
        	ease: 'power2.out',
        },0);

        enableTimeline.from('.leaf', {
        	opacity: 0,
        	scale: 1.3,
        	duration: 1.5,
        	ease: 'power2.out',
        },0);

        //   // Fade in and move up .line-2
        // enableTimeline.from('.line-2', {
        // 	opacity: 0,
        // 	y: 50,
        // 	duration: 1,
        // 	ease: 'power2.out',
  		// }, '-=0.8'); // Overlap animations by 0.8 seconds



    gsap.utils.toArray(".zoom").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play reverse play reverse", // Play the animation once
	            },
	            opacity: 1,
	            scale: 1.06,
	            duration: 7.1,
	        });
	});


	gsap.utils.toArray(".fade-in-from-left").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play reverse play reverse", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.1,
	        });
	});


	gsap.utils.toArray(".fade-in-from-right").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play reverse play reverse", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.1,
	        });
	});


	gsap.utils.toArray(".fade-in-up").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play reverse play reverse", // Play the animation once
	            },
	            opacity: 1,
	            y: 0,
	            duration: 1.1,
	        });
	});

	gsap.utils.toArray(".fade-in-up-delay").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play reverse play reverse", // Play the animation once
	            },
	            opacity: 1,
	            y: 0,
	            duration: 1.1,
	            delay: 0.3
	        });
	});


	gsap.utils.toArray(".fade-in-from-right-delay").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play reverse play reverse", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.1,
	            delay: 0.5,
	        });
	});


	gsap.utils.toArray(".fade-in-delay").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
                toggleActions: "play reverse play reverse", // Play the animation once
            },
            opacity: 1,
            delay: 0.5,
            duration: 0.8,
            // ease: "power3.out" // Add easing here
        });
	});

	gsap.utils.toArray(".fade-in-delay-2").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
                toggleActions: "play reverse play reverse", // Play the animation once
            },
            opacity: 1,
            delay: 0.8,
            duration: 0.8,
            // ease: "power3.out" // Add easing here
        });
	});


	gsap.utils.toArray(".fade-in-delay-3").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
                toggleActions: "play reverse play reverse", // Play the animation once
            },
            opacity: 1,
            delay: 1.1,
            duration: 0.8,
            // ease: "power3.out" // Add easing here
        });
	});


	gsap.utils.toArray(".fade-in").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
                toggleActions: "play reverse play reverse", // Play the animation once
            },
            opacity: 1,
            duration: 1.5,
        });
	});

	gsap.utils.toArray(".fade-in-static").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
                toggleActions: "play none none none", // Play the animation once
            },
            opacity: 1,
            duration: 1.5,
        });
	});




	gsap.utils.toArray(".slide-in-from-right").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 0.7,
	            delay: 0,
	            ease: "power3.out" // Add easing here
	        });
	});

	gsap.utils.toArray(".slide-in-from-right-delay-1").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 100%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.4,
	            delay: 0.4,
	            ease: "power3.out" // Add easing here
	        });
	});

	gsap.utils.toArray(".slide-in-from-right-delay-2").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 100%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 0.7,
	            delay: 0.5,
	            ease: "power3.out" // Add easing here
	        });
	});


	gsap.utils.toArray(".slide-in-from-left").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.8,
	            delay: 0,
	            ease: "power3.out" // Add easing here
	        });
	});

	gsap.utils.toArray(".slide-in-from-left-delay-1").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 85%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.5,
	            delay: 0.2,
	            ease: "power3.out" // Add easing here
	        });
	});

	gsap.utils.toArray(".slide-in-from-left-delay-2").forEach((element) => {
		gsap.to(element, {
			scrollTrigger: {
				trigger: element,
	                start: "top 100%", // Start when the top of fade-in div reaches 75% of the viewport
	                toggleActions: "play", // Play the animation once
	            },
	            opacity: 1,
	            x: 0,
	            duration: 1.7,
	            delay: 0.1,
	            ease: "power3.out" // Add easing here
	        });
	});

	// // Perspective box
	// let constrain = 2000;
	// let mouseOverContainer = document.getElementById("ex1");
	// let ex1Layer = document.getElementById("ex1-layer");

	// function transforms(x, y, el) {
	// 	let box = el.getBoundingClientRect();
	// 	let calcX = -(y - box.y - (box.height / 500)) / constrain;
	// 	let calcY = (x - box.x - (box.width / 500 	)) / constrain;

	// 	return "perspective(100px) "
	// 	+ "   rotateX("+ calcX +"deg) "
	// 	+ "   rotateY("+ calcY +"deg) ";
	// };

	// function transformElement(el, xyEl) {
	// 	el.style.transform  = transforms.apply(null, xyEl);
	// }

	// mouseOverContainer.onmousemove = function(e) {
	// 	let xy = [e.clientX, e.clientY];
	// 	let position = xy.concat([ex1Layer]);

	// 	window.requestAnimationFrame(function(){
	// 		transformElement(ex1Layer, position);
	// 	});
	// };


	
	gsap.to(".table-header .head", {
		scrollTrigger: {
			trigger: ".table-header",
			start: "top top",
			end: "bottom 15%",
			pin: true,
			scrub: 2.5,
			onEnter: () => document.querySelector(".table-header .head").classList.add("is-sticky"),
			onLeaveBack: () => document.querySelector(".table-header .head").classList.remove("is-sticky"),
		}
	});



		ScrollTrigger.create({
			trigger: "#scroll-wrapper",
			start: "top top",
			end: "bottom bottom",
			pin: ".scroll-controller",
			scrub: 2.5,
		    // markers: true, // Enable markers for debugging
		    pinSpacing: false, // Toggle to see if it resolves the issue
		});


		if (document.querySelector("#scroll-wrapper")) {
			gsap.to(".scroll-controller .mask", {
			  left: "130%", // Fully reveal the SVG by expanding the mask width
			  ease: "none", // Linear scroll effect
			  scrollTrigger: {
			    trigger: ".scroll-controller", // The element to watch
			    start: "top top", // When the scroll-controller reaches the top of the viewport
			    end: () => document.querySelector("#scroll-wrapper").offsetHeight + "px",
			    scrub: true, // Smoothly follow the scroll
			    // markers: true // Debug markers (optional, remove in production)
			  }
			});
		}



	gsap.to(".sticky-library", {
		scrollTrigger: {
			trigger: ".sticky-library-wrapper",
			start: "top top",
			end: "bottom bottom-=30%",
			pin: true,
			scrub: 2.5,
			pinSpacing: false,
			// markers: true,
		}
	});

	gsap.to(".sticky-ai", {
		scrollTrigger: {
			trigger: ".sticky-ai-wrapper",
			start: "top top",
			end: "bottom bottom-=30%",
			pin: true,
			scrub: 2.5,
			pinSpacing: false,
			// markers: true,
		}
	});

	gsap.to(".sticky-more", {
		scrollTrigger: {
			trigger: ".sticky-more-wrapper",
			start: "top top",
			end: "bottom bottom-=30%",
			pin: true,
			scrub: 2.5,
			pinSpacing: false,
			// markers: true,
		}
	});



});






// Type in

// set up text to print, each item in array is new line
		// var aText = new Array(
		// "There are only 10 types of people in the world:", 
		// "Those who understand binary, and those who don't"
		// );
		// var iSpeed = 100; // time delay of print out
		// var iIndex = 0; // start printing array at this posision
		// var iArrLength = aText[0].length; // the length of the text array
		// var iScrollAt = 20; // start scrolling up at this many lines
		 
		// var iTextPos = 0; // initialise text position
		// var sContents = ''; // initialise contents variable
		// var iRow; // initialise current row
		 
		// function typewriter()
		// {
		//  sContents =  ' ';
		//  iRow = Math.max(0, iIndex-iScrollAt);
		//  var destination = document.getElementById("type-in");
		 
		//  while ( iRow < iIndex ) {
		//   sContents += aText[iRow++] + '<br />';
		//  }
		 
		//  destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
		//  if ( iTextPos++ == iArrLength ) {
		//   iTextPos = 0;
		//   iIndex++;
		//   if ( iIndex != aText.length ) {
		//    iArrLength = aText[iIndex].length;
		//    setTimeout("typewriter()", 500);
		//   }
		//  } else {
		//   setTimeout("typewriter()", iSpeed);
		//  }
		// }


		// typewriter();