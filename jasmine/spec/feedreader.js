/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
	/* This is our first test suite - a test suite just contains
	 * a related set of tests. This suite is all about the RSS
	 * feeds definitions, the allFeeds variable in our application.
	 */
    	describe('RSS Feeds', function() {
	    	/* This is our first test - it tests to make sure that the
	     	* allFeeds variable has been defined and that it is not
	     	* empty. Experiment with this before you get started on
	     	* the rest of this project. What happens when you change
	     	* allFeeds in app.js to be an empty array and refresh the
	     	* page?
	     	* 
	     	* When I modified allFeeds in app.js I recieved an error:
	     	* Expected 0 not to be 0;
	     	*/
	        it('are defined', function() {
	        	expect(allFeeds).toBeDefined();
	        	expect(allFeeds.length).not.toBe(0);
	        });
	
	        /* Write a test that loops through each feed
	         * in the allFeeds object and ensures it has a 
	         * URL defined and that the URL is not empty.
	         */
	        it('urls are defined', function() {
	        	allFeeds.forEach(function(feed) {
	        		expect(feed.url).toBeDefined();
	        		expect(feed.url.length).not.toBe(0);
	        	});
	        });
	
	        /* Check that all URLs are valid.  This is not part of
	         * the original test suite.
	         */
	        it('urls are valid', function() {
	        	allFeeds.forEach(function(feed) {
	        		expect(feed.url).toMatch(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
	        	});
	        });
	
	        /* Write a test that loops through each feed
	         * in the allFeeds object and ensures it has
	         * a name defined and that the name is not empty.
	         */
	        it('names are defined', function() {
	        	allFeeds.forEach(function(feed) {
	        		expect(feed.name).toBeDefined();
	        		expect(feed.name.length).not.toBe(0);       		
	        	});
	        });
    	});

    	/* This is the testing suite for the menu functionality */
    	describe('The menu', function() {
	        var $menuElement, $menuLink;
	        
	    	beforeAll(function() {
	    		$menuElement = $('.slide-menu');
	    		$menuLink = $('.menu-icon-link');
	        });
	    	
	    	/* Test that the menu is hidden by default.
	         */
	    	it('menu is hidden', function() {
	    		expect($menuElement.offset().left).toBeLessThan(0);
	    	});
	         
	    	 /* Test that the menu changes visibility when the menu icon
	    	  * is clicked. This test has two expectations: does the menu
	    	  * display when clicked and does it hide when clicked again.
	          *
	          * After reading various posts in the forum, I decided to check
	          * for both the class on the body and the position of the div.
	          * For showing the menu, I'm checking to see if the left corner of
	          * the div is >= 0.  For hiding the menu, I am checking if the
	          * right corner of the div is <= 0;
	          * 
	          * Window.setTimeout is used to account for the menu animation.
	          * It is currently set to 1 second, but long load times will
	          * cause a false reading.
	          */
	    	it('menu changes visibility when icon clicked', function (done) {
	    		$menuLink.click(); 	// Click to show the menu		
	    		window.setTimeout(function() {
	    			expect($menuElement.offset().left).not.toBeLessThan(0);
	    			expect($('body').hasClass('menu-hidden')).toBe(false);
	    			
	    			$menuLink.click();	// Click to hide the menu
	    			window.setTimeout(function() {
	    					var menuRight = $menuElement.offset().left + $menuElement.outerWidth();
	    					expect(menuRight).not.toBeGreaterThan(0);
	    					expect($('body').hasClass('menu-hidden')).toBe(true);
	    					done();
	    			}, 1000);
	    		}, 1000);
	    	});
    	});
    
    	/* This is the test suite to test the initial state of the default feed. */
    	describe('Initial Entries', function() {
	        /* After the loadFeed function is called and completes its work, 
	         * check that there is at least a single .entry element within
	         * the .feed container.
	         * 
	         * loadFeed() is asynchronous so this test will require the use
	         * of Jasmine's beforeEach and asynchronous done() function.
	         */
		beforeEach(function(done) {
			loadFeed(0, done);
		});
		
		it('there is at least one entry element in the container', function() {
			var $entries = $('.feed').find('.entry');
			expect($entries.length).toBeGreaterThan(0);
		});
    	});
    
    	/* This is the test suite to test selecting a new feed */
	describe('New Feed Selection', function() {
		var $entryTitles, $feedHeader;
		
        	/* When a new feed is loaded by the loadFeed function, test
        	 * that the content actually changes.
		 */
		
		/* Before any tests, load the default feed, and then load another feed */
		beforeAll(function(done) {
			loadFeed(0, function() {
				$feedHeader = $('.header-title');
				$entryTitles = $('.entry').find('h2');
				loadFeed(1, done);
			});
		});
		
		/* Test if the header has changed */
		it('has a new header', function() {
			expect($('.header-title').html() != $feedHeader).toBe(true);
		});
		
		/* Test if the entries have changed by testing their headers */
		it('has new content', function() {
			expect($('.entry').find('h2').html() != $entryTitles).toBe(true);
		});
		
		// Restore the page to its initial state
		afterAll(function(done) {
			loadFeed(0, done);
		});
	});
}());
