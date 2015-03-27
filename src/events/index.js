module.exports = function( Microbe )
{

    /**
     * emit event
     *
     * emits a custom event to the HTMLElements of the current object
     *
     * @param   {str}               _event              HTMLEvent
     * @param   {obj}               _data               event data
     *
     * @return  Microbe
    */
    Microbe.prototype.emit = function ( _event, _data, _bubbles, _cancelable )
    {
        _bubbles    = _bubbles || false;
        _cancelable = _cancelable || false;
        var _emit = function( _elm )
        {
            var _evt = new CustomEvent( _event, {
                                                    detail      : _data,
                                                    cancelable  : _cancelable,
                                                    bubbles    : _bubbles
                                                } );
            _elm.dispatchEvent( _evt );
        };

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _emit( this[ i ] );
        }

        return this;
    };


    /**
     * Bind Events
     *
     * Binds an event to the HTMLElements of the current object or to the
     * given element.
     *
     * @param   {str}               _event              HTMLEvent
     * @param   {func}              _callback           callback function
     *
     * @return  Microbe
    */
    Microbe.prototype.on = function ( _event, _callback )
    {
        var _on = function( _elm )
        {
            var prop = '_' + _event + '-bound-function';

            _elm.data                    = _elm.data || {};
            _elm.data[ prop ]            = _elm.data[ prop ] || {};
            var _callbackArray           = _elm.data[ prop ][ prop ];

            var i, len, filterFunction = function( val ){ return val !== null; };

            if ( ! _callbackArray )
            {
                _callbackArray = [];
            }

            _elm.addEventListener( _event, _callback );
            _elm.data[ prop ][ prop ]    = _callback;
        };

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _on( this[ i ] );
        }

        return this;
    };


    /**
     * Unbind Events
     *
     * unbinds an/all events.
     *
     * @param   {str}           _event                  event name
     * @param   {func}          _callback               callback function
     * @param   {obj}           _el                     HTML element to modify (optional)
     *
     * @return  Microbe
    */
    Microbe.prototype.off = function( _event, _callback )
    {
        var i, len, filterFunction = function( val ){ return val !== null; };
        for ( i = 0, len = this.length; i < len; i++ )
        {
            var _elm = this[ i ];
            var prop = '_' + _event + '-bound-function';
            if ( ! _callback && _elm.data && _elm.data[ prop ] &&
                    _elm.data[ prop ][ prop ] )
            {
                _callback = _elm.data[ prop ][ prop ];
            }

            if ( _callback )
            {
                if ( Object.prototype.toString.call( _callback ) !== '[Object Array]' )
                {
                    _callback = [ _callback ];
                }

                for ( var j = 0, lenJ = _callback.length; j < lenJ; j++ )
                {
                    _elm.removeEventListener( _event, _callback[ j ] );
                    _callback[ j ] = null;
                }
                _callback.filter( filterFunction );


                _elm.data                   = _elm.data || {};
                _elm.data[ prop ]           = _elm.data[ prop ] || {};
                _elm.data[ prop ][ prop ]   = _callback;
            }

        }

        return this;
    };


    /**
     * CustomEvent pollyfill for IE >= 9
     *
     * @param   {str}               _event              HTMLEvent
     * @param   {obj}               _data               event data
     *
     * @return  {void}
     */
    if ( typeof CustomEvent !== 'function' )
    {
        ( function ()
        {
            function CustomEvent ( event, data )
            {
                data    = data || { bubbles: false, cancelable: false, detail: undefined };
                var evt = document.createEvent( 'CustomEvent' );
                evt.initCustomEvent( event, data.bubbles, data.cancelable, data.detail );
                return evt;
            }

            CustomEvent.prototype   = window.Event.prototype;
            window.CustomEvent      = CustomEvent;
        } )();
    }
};