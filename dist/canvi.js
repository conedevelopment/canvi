'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! Canvi - v1.0.0 - 2017-7-20
* Canvi is a simple, but customizable, responsive off-canvas navigation.
* GITHUB repo link
* by Adam Laki / Pine */

var Canvi = '';

(function () {

    /*
     * Canvi constructor
     */

    Canvi = function Canvi() {

        'use strict';

        /*
         * Set the defaults
         */

        // Global element references

        var pushContent = '',
            body = document.querySelector('body'),
            content = '',
            options = {},
            defaults = {},
            openButton = '',
            overlay = '',
            navbar = '',
            transitionEvent = _whichTransitionEvent(),
            isOpen = false;

        // Default values
        defaults = {
            content: '.canvi-content',
            isDebug: false,
            navbar: '.canvi-navbar',
            speed: '0.3s',
            openButton: '.canvi-open-button',
            position: 'left',
            pushContent: true,
            width: '300px'

            // Create our options from the defaults and the given values from the constructor
        };if (arguments[0] && _typeof(arguments[0]) === "object") {
            options = _extendDefaults(defaults, arguments[0]);
        }

        // Select default elements from the options
        openButton = document.querySelector(options.openButton);
        navbar = document.querySelector(options.navbar);
        content = document.querySelector(options.content);

        /*
         * Call the init of Canvi and start the fun
         */

        initCanvi();

        function initCanvi() {
            if (options.isDebug) console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Init is running...');
            if (options.isDebug) _objectLog();

            _buildMarkup();
            _initializeMainEvents();

            // Trigger Custom Event
            _triggerCanviEvent('canvi.init');

            navbar.setAttribute('inert', '');
            navbar.setAttribute('aria-hidden', 'true');
        }

        /********************************
         * Public methods
         ********************************/

        /*
         * Open of Canvi function
         */

        function openCanvi() {
            if (options.isDebug) console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Open is running...');

            // Trigger Custom Event
            _triggerCanviEvent('canvi.before-open');

            _buildOverlay();
            _setZindex();

            // Add open classes
            content.classList.add('is-canvi-open');
            body.classList.add('is-canvi-open');
            navbar.classList.add('is-canvi-open');

            _responsiveWidth();

            if (options.pushContent === true) {
                content.addEventListener(transitionEvent, _transtionOpenEnd);
            } else {
                navbar.addEventListener(transitionEvent, _transtionOpenEnd);
            }

            navbar.removeAttribute('inert');
            navbar.removeAttribute('aria-hidden');

            isOpen = true;
        }

        /*
         * Close of Canvi function
         */

        function closeCanvi() {
            if (options.isDebug) console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Close is running...');

            if (isOpen === true) {
                // Trigger Custom Event
                _triggerCanviEvent('canvi.before-close');

                overlay.classList.add('canvi-animate-out');

                // Remove open classes
                content.style.transform = 'translateX(0)';
                body.classList.remove('is-canvi-open');
                navbar.classList.remove('is-canvi-open');

                if (options.pushContent === true) {
                    content.addEventListener(transitionEvent, _transitionCloseEnd);
                } else {
                    navbar.addEventListener(transitionEvent, _transitionCloseEnd);
                }

                navbar.setAttribute('inert', '');
                navbar.setAttribute('aria-hidden', 'true');

                isOpen = false;
            }
        }

        /*
         * Toggle of Canvi function
         */

        function toggleCanvi() {
            if (options.isDebug) console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Toggle is running...');

            if (navbar.classList.contains('is-canvi-open') && content.classList.contains('is-canvi-open')) {
                closeCanvi();
            } else {
                openCanvi();
            }
        }

        /********************************
         * Private methods
         ********************************/

        /*
         * Extend the default markup with some specific values
         */

        function _buildMarkup() {
            if (options.isDebug) console.log('%c %s', 'color: #ccc; font-style: italic;', 'CANVI: Build markup...');

            // Set position value, from options 
            if (options.position) {
                navbar.setAttribute('data-position', options.position);
                navbar.setAttribute('data-push-content', options.pushContent);
            }

            // Set the width of the navbar
            navbar.style.width = options.width;

            // Set ready class to the body
            body.classList.add('is-canvi-ready');
        }

        /*
         * Extend the default markup with some specific values
         */

        function _responsiveWidth() {
            if (navbar.classList.contains('is-canvi-open') && window.matchMedia('(min-width: 0px)').matches) {
                navbar.style.width = options.width;
                _responsiveWidthHelper(options.width);
            }

            if (navbar.classList.contains('is-canvi-open') && Array.isArray(options.responsiveWidths) && options.responsiveWidths.length > -1) {
                options.responsiveWidths.forEach(function (element) {
                    if (window.matchMedia('(min-width: ' + element.breakpoint + ')').matches) {
                        navbar.style.width = element.width;

                        _responsiveWidthHelper(element.width);
                    }
                });
            }
        }

        /*
         * Simple helper for the _responsiveWidth function
         */

        function _responsiveWidthHelper(width) {
            if (options.pushContent === true && options.position === 'left') {
                content.style.transform = 'translateX(' + width + ')';
            }

            if (options.pushContent === true && options.position === 'right') {
                content.style.transform = 'translateX(-' + width + ')';
            }
        }

        /*
         * Build the overlay when the menu is opened
         */

        function _buildOverlay() {
            if (options.isDebug) console.log('%c %s', 'color: #32da94; font-style: italic;', 'CANVI: Build overlay...');

            // If overlay is true, add
            if (!content.querySelector('.canvi-overlay')) {
                overlay = document.createElement('div');
                overlay.className = 'canvi-overlay';
                content.appendChild(overlay);
            }

            // Add close event to the overlay
            overlay.addEventListener('click', closeCanvi);

            _setTransitionSpeed();
        }

        /*
         * Destroy the overlay when the menu is closed
         */

        function _removeOverlay() {
            if (options.isDebug) console.log('%c %s', 'color: #32da94; font-style: italic;', 'CANVI: Remove overlay...');
            if (options.isDebug) console.log('%c %s', 'color: #999; font-style: italic;', '---------');

            // If overlay is true, remove
            if (overlay) {
                content.removeChild(overlay);

                // Destroy the overlay event
                overlay.removeEventListener('click', closeCanvi);
            }
        }

        /*
         * Init main events
         */

        function _initializeMainEvents() {
            if (options.isDebug) console.log('%c %s', 'color: #ccc; font-style: italic;', 'CANVI: Init main events...');
            if (options.isDebug) console.log('%c %s', 'color: #999; font-style: italic;', '---------');

            if (openButton) {
                openButton.addEventListener('click', openCanvi);
            }

            window.addEventListener('resize', _responsiveWidth);
        }

        /*
         * Trantions, animation ends
         */

        function _transtionOpenEnd(e) {
            if (e.propertyName !== 'transform') return;

            if (options.isDebug) console.log('%c %s', 'color: #ff7600; font-style: italic;', 'CANVI: Open transition end...');
            if (options.isDebug) console.log('%c %s', 'color: #999; font-style: italic;', '---------');

            // Trigger Custom Event
            _triggerCanviEvent('canvi.after-open');

            if (options.pushContent === true) {
                content.removeEventListener(transitionEvent, _transtionOpenEnd);
            } else {
                navbar.removeEventListener(transitionEvent, _transtionOpenEnd);
            }
        }

        function _transitionCloseEnd(e) {
            if (e.propertyName !== 'transform') return;

            if (options.isDebug) console.log('%c %s', 'color: #ff7600; font-style: italic;', 'CANVI: Close transition end...');

            _triggerCanviEvent('canvi.after-close');
            _removeOverlay();

            if (options.pushContent === true) {
                content.removeEventListener(transitionEvent, _transitionCloseEnd);
            } else {
                navbar.removeEventListener(transitionEvent, _transitionCloseEnd);
            }

            _resetZindex();

            content.classList.remove('is-canvi-open');
        }

        /*
         * Modify transition speed
         */

        function _setTransitionSpeed() {
            navbar.style.transitionDuration = options.speed;
            content.style.transitionDuration = options.speed;
            overlay.style.animationDuration = options.speed;
        }

        /*
         * Modify z-index values when navigation is pushed
         */

        function _setZindex() {
            if (options.pushContent === true) {
                navbar.style.zIndex = 20;
                content.style.zIndex = 40;
            } else {
                navbar.style.zIndex = 10;
                content.style.zIndex = 5;
            }
        }

        function _resetZindex() {
            if (options.pushContent === true) {
                navbar.style.zIndex = 1;
                content.style.zIndex = 5;
            } else {
                navbar.style.zIndex = 1;
                content.style.zIndex = 5;
            }
        }

        /*
         * Close on keyup
         */

        body.addEventListener('keyup', function (e) {
            if (e.keyCode == 27) {
                closeCanvi();
            }
        });

        /********************************
         * Utilities
         ********************************/

        /*
         * Extend the defaults with the option
         */

        function _extendDefaults(source, properties) {
            var property;

            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }

            return source;
        }

        /*
         * Catch transtion end
         */

        function _whichTransitionEvent() {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }

        /*
         * Custom event helper
         */

        function _triggerCanviEvent(name) {
            var canviEvent = new CustomEvent(name, {
                detail: {
                    navbar: navbar,
                    openButton: openButton,
                    content: content
                }
            });

            body.dispatchEvent(canviEvent);
        }

        /*
         * Log Canvi object
         */

        function _objectLog() {
            console.groupCollapsed('Canvi Object');
            console.log('Open Button: ', openButton);
            console.log('Navbar: ', navbar);
            console.log('Content: ', content);
            console.groupEnd();
        }

        /********************************
         * Return public functions
         ********************************/

        return {
            open: openCanvi,
            close: closeCanvi,
            toggle: toggleCanvi
        };
    };
})();