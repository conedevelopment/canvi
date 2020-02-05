class Canvi {
    constructor(options = {})
    {
        this.options = Object.assign({
            speed: '0.3s',
            width: '300px',
            isDebug: false,
            position: 'left',
            pushContent: true,
            navbar: '.canvi-navbar',
            content: '.canvi-content',
            openButton: '.canvi-open-button',
        }, options);

        this.isOpen = false;
        this.body = document.querySelector('body');
        this.transitionEvent = this._whichTransitionEvent();
        this.navbar = document.querySelector(this.options.navbar);
        this.content = document.querySelector(this.options.content);
        this.openButton = document.querySelector(this.options.openButton);

        this.listeners = {
            open: () => this.open(),
            close: () => this.close(),
            responsiveWidth: () => this._responsiveWidth(),
            transitionOpenEnd: event => this._transitionOpenEnd(event),
            transitionCloseEnd: event => this._transitionCloseEnd(event),
        };

        this.init();
    }

    init()
    {
        if (this.options.isDebug) {
            console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Init is running...');
            this._objectLog();
        }

        this._buildMarkup();
        this._initializeMainEvents();
        this._triggerCanviEvent('canvi.init');

        this.navbar.setAttribute('inert', '');
        this.navbar.setAttribute('aria-hidden', 'true');
    }

    open()
    {
        if (this.isOpen) {
            return;
        }

        if (this.options.isDebug) {
            console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Open is running...');
        }

        this._triggerCanviEvent('canvi.before-open');
        this._buildOverlay();
        this._setZindex();

        this.content.classList.add('is-canvi-open');
        this.body.classList.add('is-canvi-open');
        this.navbar.classList.add('is-canvi-open');

        this._responsiveWidth();

        (this.options.pushContent ? this.content : this.navbar)
            .addEventListener(this.transitionEvent, this.listeners.transitionOpenEnd);

        this.navbar.removeAttribute('inert');
        this.navbar.removeAttribute('aria-hidden');

        this.isOpen = true;
    }

    close()
    {
        if (! this.isOpen) {
            return;
        }

        if (this.options.isDebug) {
            console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Close is running...');
        }

        this._triggerCanviEvent('canvi.before-close');

        this.overlay.classList.add('canvi-animate-out');
        this.content.style.transform = 'translateX(0)';
        this.body.classList.remove('is-canvi-open');
        this.navbar.classList.remove('is-canvi-open');

        (this.options.pushContent ? this.content : this.navbar)
            .addEventListener(this.transitionEvent, this.listeners.transitionCloseEnd);

        this.navbar.setAttribute('inert', '');
        this.navbar.setAttribute('aria-hidden', 'true');

        this.isOpen = false;
    }

    toggle()
    {
        if (this.options.isDebug) {
            console.log('%c %s', 'color: #e01a51; font-style: italic;', 'CANVI: Toggle is running...');
        }

        this.isOpen ? this.close() : this.open();
    }

    _buildMarkup()
    {
        if (this.options.isDebug) {
            console.log('%c %s', 'color: #ccc; font-style: italic;', 'CANVI: Build markup...');
        }

        if (this.options.position) {
            this.navbar.setAttribute('data-position', this.options.position);
            this.navbar.setAttribute('data-push-content', this.options.pushContent);
        }

        this.navbar.style.width = this.options.width;
        this.body.classList.add('is-canvi-ready');
    }

    _responsiveWidth()
    {
        if (this.navbar.classList.contains('is-canvi-open') && window.matchMedia('(min-width: 0px)').matches) {
            this.navbar.style.width = this.options.width;
            this._responsiveWidthHelper(this.options.width);
        }

        if (this.navbar.classList.contains('is-canvi-open') && Array.isArray(this.options.responsiveWidths) && this.options.responsiveWidths.length > -1) {
            this.options.responsiveWidths.forEach(element => {
                if (window.matchMedia(`(min-width: ${element.breakpoint})`).matches) {
                    this.navbar.style.width = element.width;
                    this._responsiveWidthHelper(element.width);
                }
            });
        }
    }

    _responsiveWidthHelper(width)
    {
        if (this.options.pushContent) {
            this.content.style.transform = this.options.position === 'left'
                ? `translateX(${width})`
                : `translateX(-${width})`;
        }
    }

    _buildOverlay()
    {
        if (this.options.isDebug) {
            console.log('%c %s', 'color: #32da94; font-style: italic;', 'CANVI: Build overlay...');
        }

        if (! this.content.querySelector('.canvi-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'canvi-overlay';
            this.content.appendChild(this.overlay);
        }

        this.overlay.addEventListener('click', this.listeners.close);

        this._setTransitionSpeed();
    }

    _removeOverlay()
    {
        if (this.options.isDebug) {
            console.log('%c %s', 'color: #32da94; font-style: italic;', 'CANVI: Remove overlay...');
        }

        if (this.overlay) {
            this.content.removeChild(this.overlay);
            this.overlay.removeEventListener('click', this.listeners.close);
        }
    }

    _initializeMainEvents()
    {
        if (this.options.isDebug) {
            console.log('%c %s', 'color: #ccc; font-style: italic;', 'CANVI: Init main events...');
            console.log('%c %s', 'color: #999; font-style: italic;', '---------');
        }

        this.body.addEventListener('keyup', event => {
            if (this.isOpen && event.keyCode == 27) {
                this.close();
            }
        });

        if (this.openButton) {
            this.openButton.addEventListener('click', this.listeners.open);
        }

        window.addEventListener('resize', this.listeners.responsiveWidth);
    }

    _transitionOpenEnd(event)
    {
        if (! this.isOpen || event.propertyName !== 'transform') {
            return;
        }

        if (this.options.isDebug) {
            console.log('%c %s', 'color: #ff7600; font-style: italic;', 'CANVI: Open transition end...');
            console.log('%c %s', 'color: #999; font-style: italic;', '---------');
        }

        this._triggerCanviEvent('canvi.after-open');

        (this.options.pushContent ? this.content : this.navbar)
            .removeEventListener(this.transitionEvent, this.listeners.transitionOpenEnd);
    }

    _transitionCloseEnd(event)
    {
        if (this.isOpen || event.propertyName !== 'transform') {
            return;
        }

        if (this.options.isDebug) {
            console.log('%c %s', 'color: #ff7600; font-style: italic;', 'CANVI: Close transition end...');
        }

        this._triggerCanviEvent('canvi.after-close');
        this._removeOverlay();
        this._resetZindex();

        (this.options.pushContent ? this.content : this.navbar)
            .removeEventListener(this.transitionEvent, this.listeners.transitionCloseEnd);

        this.content.classList.remove('is-canvi-open');
    }

    _setTransitionSpeed()
    {
        this.navbar.style.transitionDuration = this.options.speed;
        this.content.style.transitionDuration = this.options.speed;
        this.overlay.style.animationDuration = this.options.speed;
    }

    _setZindex()
    {
        this.navbar.style.zIndex = this.options.pushContent ? 20 : 10;
        this.content.style.zIndex = this.options.pushContent ? 40 : 5;
    }

    _resetZindex()
    {
        this.navbar.style.zIndex = 1;
        this.content.style.zIndex = 5;
    }

    _whichTransitionEvent()
    {
        let el = document.createElement('fakeelement'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

        for (let t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    _triggerCanviEvent(name)
    {
        this.body.dispatchEvent(new CustomEvent(name, {
            details: {
                navbar: this.navbar,
                openButton: this.openButton,
                content: this.content
            }
        }));
    }

    _objectLog()
    {
        console.groupCollapsed('Canvi Object');
        console.log('Open Button: ', this.openButton);
        console.log('Navbar: ', this.navbar);
        console.log('Content: ', this.content);
        console.groupEnd();
    }
}