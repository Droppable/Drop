var Drop = function() {

  /*
  // Note
  Private variables must start with _ underscore

  // Features

  1) Register and unregister drops dynamically
  2) Render a specific [data-drop-container] into another container on the fly
  3) Access all the drops status through the public API
  4) Open and close specific drops dynamically
  5) Add multiple event handlers to specific drops to be triggered upon opening and closing
      A) Each event handler will be attached against its own drop
      B) There are two different event handlers (open, close), one to be triggered upon opening a drop and other upon closing
  6)
  7)
  8)
  9)
  10)

  */


  this.selector = $('.drop');
  
  // Data array, where we hold all of the drops details
  this.data = [];

  // To create the Drop DOM
  this.createDOM = function (selector, options) {
    var _self = this;
    // Template
    var _template = function (options) {
      var _onHover = options.onHover == true ? 'data-drop-onhover' : '';
      var _onMouseup = options.onMouseup == false ? 'data-drop-onmouseup="false"' : '';
      var _showClose = options.showClose == true ? '<span class="drop-close ' + _showClose + '">X</span>' : '';
      var _render = typeof options.render !== undefined && options.render.length > 0 ? 'data-drop-render="' + options.render + '"' : '';

      var _output = '<div class="drop" id="' + selector + '" ' + _onHover + ' ' + _render + ' ' + _onMouseup + '>';
      _output += '<button class="drop-button">' + options.triggerText + '</button>';
      _output += '<div class="drop-container">';
      // _output += '<span class="drop-close ' + _showClose + '" data-drop-close>X</span>';
      _output += _showClose;
      _output += options.html;
      _output += '</div>';
      _output += '</div>';
      return _output;
    };

    if (typeof selector !== undefined && typeof selector == 'string') {

      var _target = $(options.target);

      // If target exists
      if (_target.length) {      
        // Append the drop to the target
        _target.append(_template(options));
        // Update UI
        _self.selector = $('.drop');
        return true;
      }
      else {
        return false;
      }
    }
  };

  // To insert a row to data array
  this.insertDataRow = function (selector) {
    // Loop through to make sure there is not a row with matching id
    var _self = this;

    // To make sure the drop hasn't been registered before
    if (typeof selector !== undefined && !_self.isRegistered(selector)) {
      // console.log('Inserting row to data array object')
      var _drop = _self.DOM(selector);
      var _dropId = typeof _drop.attr('id') === undefined || _drop.attr('id') == '' ? undefined : _drop.attr('id');
      var _dropContainer = _drop.find('.drop-container').first();

      // Create an object to push properties into that later
      var _object = {};

      // If the drop has an id attribute, then use its id attribute
      if (typeof _dropId == 'undefined') {
        _dropId = _self.GUID(selector);
      }

      if (typeof _dropId != 'undefined' && typeof _dropId != 'object' && typeof _dropId == 'string') {

        // Add drop id to the drop as custom data attribute
        _drop.attr('data-drop-id', _dropId);
        _dropContainer.attr('data-drop-id', _dropId);

        // Add properties and values to data object
        _object['id'] = _dropId;
        _object['status'] = 0;
        _object['handlers'] = {
          'open': [],
          'close': []
        };
        _object['enable'] = 1;

        // Push this row to the main data object
        _self.data.push(_object);

      }
      // console.log(_object)
    }
    // Row already exists
    else {
      console.info('Drop: A data row already exists with that id.');
    }
  };

  // To return with a unique id to be used for registering a new drop
  this.GUID = function (selector) {
    var _self = this;
    var _count = _self.data.length + 1;
    var _id = 'drop-' + _count;
    if (!_self.isRegistered(selector)) {
      return _id;
    }
    // Count data array rows
    // Increment by 1 everytime this method is called
    // Return the new GUID
  };

  // DOM Status
  // Active = 1, inactive = 0
  this.DOMStatus = function (selector) {
    var _self = this;

    var _drop = _self.DOM(selector);
    var _hasClass = _drop.hasClass('active') ? true : false;
    var _hasAttribute = _drop.filter('[data-drop-active]').length ? true : false;

    if (_hasAttribute || _hasClass) {
      return 1;
    } else {
      return 0;
    }
  };

  // Check for data-drop-active, if exists then update the status
  // If no parameter passed, then it should loop through the DOM and update the data object
  this.updateDataStatus = function(selector) {
    var _self = this;
    if (typeof selector !== 'undefined' && _self.isRegistered(selector)) {
      if (_self.DOMStatus(selector) == 1 && _self.getDataRow(selector).status == 0) {
        _self.getDataRow(selector).status = 1;
      }
    }
    else {
      console.warn('Drop: This drop doesn\'t exists.')
    }
  };
  
  // Updating the UI based on each drop status
  // To show or hide a drop, it must not be processed directly
  this.renderDOM = function (selector) {
    var _self = this;

    // Update the UI only for the specific selector
    if (typeof selector !== undefined && typeof selector == 'string') {

      // If the drop specified to be rendered into another DOM element
      if (_self.isRendered(selector)) {
        
        var _selector = _self.children(selector);
        var _renderTo = $(_selector.drop.data('drop-render'));
        var _position = {
          'top' : 0,
          'left': 0
        };
        var _found = typeof _renderTo !== 'undefined' && _renderTo.length ? true : false;

        // If container wasn't specified
        if (!_found) {
          _renderTo = $('body');
        }
        _selector.dropContainer.appendTo(_renderTo);

        $('*').on('load resize scroll', function () {

          _position.top = _selector.drop.offset().top + _selector.dropTrigger.outerHeight() + 8;
          _position.left = _selector.drop.offset().left;
          _selector.dropContainer.css({
            'position': 'absolute',
            'top': _position.top,
            'left': _position.left
          });
        });
      }
    }
    _self.selector = $('.drop');
    // var _data = _self.getDataRow(selector);
    // _self.onChange({}, _data.id);
  };

  // Turn a selector to DOM object
  this.DOM = function(selector) {
    var _self = this;
    if (typeof selector !== 'undefined') {
      _drop = $(selector);
      // If selector still not found
      // Try finding the selctor using its data-drop-id
      if (!_drop.length) {
        _drop = $('[data-drop-id="' + selector + '"]');
      }
    }
    return _drop.length && typeof _drop !== 'undefined' ? _drop : 'undefined';
  };


  // To delete a row from data array
  this.deleteDataRow = function (property, value) {
    var _self = this;
    if (property && value && _self.data.length) {
      console.log('>> deleteDataRow()')
      var i = _self.data.length;
      while (i--) {
        console.log(arguments.length)
        if (_self.data[i] && _self.data[i].hasOwnProperty(property) && (arguments.length > 2 && _self.data[i][property] === value)) {
          _self.data.splice(i, 1);
        }
      }
      return _self.data;
    }
  };

  // To update a row property in data array based on drop id
  // drop = this is the drop id for that data row
  // property = this specifies which propery we want to update
  // value = the new value
  this.updateDataRow = function (drop, property, value) {
    var _self = this;
    if (typeof drop != 'undefined' && typeof property != 'undefined' && typeof value != 'undefined') {
      console.log('>> updateDataRow()')
    }
  };

  // To retrieve data row based on a drop id
  this.getDataRow = function (selector) {
    var _self = this;
    var _drop = _self.DOM(selector);
    // console.log(typeof selector, selector)
    if (typeof selector !== 'undefined' && _drop !== 'undefined') {
      // && typeof 
      
      
      var _dropId = _drop.filter('[data-drop-id]').length ? _drop.data('drop-id') : 'drop-';
      var _data;

      // Loop through data array object
      for (var i = 0; i < _self.data.length; i++) {
        if (_self.data[i].id == _dropId) {
          _data = _self.data[i];
          return _data;
        }
      }
    }
  };

  // To check if a drop is already registered based on their id and DOM
  this.isRegistered = function (selector) {
    // Check data array to make sure the selector exists
    // Check DOM to make sure selector actually exists
    // This method will be useful for when we want to register a drop dynamically and want to make sure it hasn't already registered
    var _self = this;
    if (typeof selector !== undefined && typeof selector == 'string') {

      // If selector it's a DOM object
      if ($(selector).length) {
        var _drop = $(selector);
        var _dropId = _drop.filter('[data-drop-id]').length ? _drop.data('drop-id') : _drop.attr('id');

        // Reassign drop id
        selector = typeof _dropId !== undefined ? _dropId : '';
      }

      var _data = _self.getDataRow(selector);
      if (_data !== undefined) {
        if (selector === _data.id && typeof _data !== undefined) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
  };

  // To check whether a drop is following the right DOM structure
  this.hasValidDOM = function(selector) {
    // Start with data attributes
    // A valid drop must have the following data attributes in order to be able to work properly:-
    // data-drop, data-drop-id, data-drop-button, data-drop-close, data-drop-container
    // Regardless of whether it's rendered into another DOM element or not as that's considered already by calling isRendered()
    var _self = this;
    if (typeof selector !== 'undefined' && typeof selector === 'string') {
      var _attribute = {
        'drop' : '.drop',
        'dropId' : '[data-drop-id]',
        'dropTrigger' : '.drop-button',
        'dropContainer' : '.drop-container',
        'dropClose' : '.drop-close'
      };

      var _drop = _self.DOM(selector);

      if (_drop.filter(_attribute.drop).length && _drop.filter(_attribute.dropId).length) {
        if (_drop.find('> ' + _attribute.dropTrigger).length) {
          // If the drop is rendered
          if (_self.isRendered(selector)) {
            console.log(selector + ' is rendered')
            var _dropContainer = $(_attribute.dropContainer).filter(_attribute.dropId);
            if (_dropContainer.length && _dropContainer.data('drop-id') == selector) {
              console.log(selector + ' has an id')
              return true;
            } else {
              console.log(selector + ' doesn\'t have an id')
              return false;
            }
          }
          // If the drop is not rendered and still in its original container
          else {
            console.log(selector + ' is not rendered')
          }
          // return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  };
  
  // To check if the passed selector is a valid drop DOM
  this.isValidDom = function (selector) {
    var _self = this;
    if (typeof selector !== undefined && typeof selector == 'string') {
      var _drop = _self.DOM(selector);
      if (_drop && _drop.length && typeof _drop !== undefined) {
        var _hasClass = _drop.hasClass('drop');
        var _hasAttribute = _drop.filter('.drop').length ? true : false;
        if (_hasAttribute || _hasClass) {
          return true;
        } else {
          return false;
        }
      }
      else {
        console.info('Drop: This drop ' + selector + ' was not found.');
      }
    }
  };
  
  // To check if specified drop is rendered outside of its original container
  this.isRendered = function (selector) {
    var _self = this;
    if (typeof selector != 'undefined' && _self.isValidDom(selector)) {
      var _drop = _self.DOM(selector);

      // If the drop was found
      if (_drop.length) {
        var _hasAttribute = _drop.filter('[data-drop-render]').length ? true : false;
        // If the drop has render attribute
        if (_hasAttribute) {
          return true;
        }
        // If the drop didn't have render attribute
        else {
          return false;
        }
      }
      // If the drop was not found
      else {
        console.warn('Drop: The ' + selector + ' drop was not found.');
        return false;
      }
    }
  };
  
  // This method returns all children of specified drop
  // This way we don't have to do it manually, it's also very useful when it comes to isRendered as structures would then varry one to another
  this.children = function (selector) {
    var _self = this;
    // If selector is valid
    if (typeof selector != 'undefined' && _self.isValidDom(selector)) {

      var _drop = _self.DOM(selector);
      var _dropId = _drop.data('drop-id');
      var _dropTrigger = _drop.find('.drop-button'),
          _dropClose,
          _dropContainer,
          _onMouseup = _drop.filter('[data-drop-onmouseup]').length ? _drop.data('drop-onmouseup') : true;

      // If drop is rendered in another container
      if (_self.isRendered(selector)) {
        _dropContainer = $('.drop-container').filter('[data-drop-id="' + _dropId + '"]');
      }
      // If dropContainer it's in original container and hasn't been moved
      else {
        _dropContainer = _drop.find('.drop-container').first();
      }
      
      // To make sure other drop elements load right after drop container is found
      if (_dropTrigger.length && _dropContainer.length) {

        _dropClose = _dropContainer.find('> .drop-close');
        return {
          drop: _drop,
          dropId: _dropId,
          dropTrigger: _dropTrigger,
          dropClose: _dropClose,
          dropContainer: _dropContainer,
          onMouseup: _onMouseup
        };
      }
    } else {
      console.warn('Drop: Problem with children() for selector ' + selector);
    }
  };
  
  // This method checks the drop status and then either shows or hides the drop
  // Both parameters are required
  this.toggleDom = function (data, selector) {
    var _self = this;
    // If data and selector are both valid
    if (typeof data != 'undefined' && typeof selector != 'undefined') {
      // Check status
      // If inactive, then show/open the drop
      if (data.status == 0) {
        _self.open(selector);
      }
      // If active, then hide/close the drop
      else if (data.status == 1) {
        _self.close(selector);
      }
    }
  };
  
  // onChange
  this.onChange = function (handler, selector) {
    var _self = this;

    if (typeof handler != 'undefined' && typeof selector != 'undefined' && _self.isValidDom(selector)) {

      var _drop = _self.DOM(selector);
      var _dropId = _drop.filter('[data-drop-id]').length ? _drop.data('drop-id') : '';

      var _data = _self.getDataRow(selector);

      if (typeof _data != 'undefined') {

        var _selector = _self.children(selector);
        
        // If selector was found
        // So if the was a problem with one of the drops then not all stop working
        if (typeof _selector !== 'undefined') {

          // onHover
          if (_selector.drop.filter('[data-drop-onhover]').length) {
            _selector.drop.unbind('hover').hover(function () {
              _self.toggleDom(_data, selector);
            });
          }
          // onClick
          else {
            _selector.dropTrigger.unbind('click').click(function () {
              _self.toggleDom(_data, selector);
            });
          }
          // onClose
          if (_selector.dropClose.length) {
            _selector.dropClose.unbind('click').click(function () {
              _self.toggleDom(_data, selector);
            });
          }
        }
      }
    }
  };
  
  // Initialise the Drop
  this.init();

};

/*  ****************************************
    Method: init
    ****************************************  */
// To initialise the Drop
Drop.prototype.init = function() {
  var _self = this;

  // Generate unique id for each drop
  // Only for the drops that don't have an id
  // If it has an id # then we add that to its data-drop-id for its internal use
  if (_self.selector.length) {
    for (var i = 0; i < _self.selector.length; i++) {

      var _drop = _self.selector[i];

      // Create data row from DOM
      _self.insertDataRow(_drop);

      // Get the drop id from DOM once we have registered all of the drops
      var _dropId = $(_self.selector[i]).data('drop-id');

      // Update data status from DOM
      _self.updateDataStatus(_dropId);

      // Update UI
      _self.renderDOM(_dropId);
      
    }
  }
  

  // Loop through data object
  // Find registered drops using their unique ids
  // Run the toggleDom method for each one of them
  if (_self.data.length) {
    for (var i = 0; i < _self.data.length; i++) {
      // _self.onChange({}, _self.data[i].id);
      _self.onChange({}, _self.data[i].id);
    }
  }

};


/*  ****************************************
    Method: status
    ****************************************  */
// To get the status of a particular drop
Drop.prototype.status = function() {
  var _self = this;
};


/*  ****************************************
    Method: open
    ****************************************  */
// To open a particular drop
Drop.prototype.open = function(selector) {
  var _self = this;
  // Grab its id using data-drop-id and not the id attribute
  // Check for its current status in the data object
  // Check if selector is a valid drop containing the data-drop attribute
  if (typeof selector != 'undefined' && typeof selector != 'object' && _self.isValidDom(selector)) {

    var _selector = _self.children(selector);

    // Return data row with matching drop id
    var _data = _self.getDataRow(selector);

    // If data row was found
    if (typeof _data != 'undefined' && (_data.status == 0 || _data.status == 1) && _data.enable == 1) {

      // If drop DOM is already active
      if (_self.DOMStatus(selector) == 1 && _data.status == 1) {

        // Add active class and attribute
        _selector.drop.addClass('active').attr('data-drop-active', 1);
        _selector.dropContainer.addClass('active').attr('data-drop-active', 1);

        console.warn('The ' + selector + ' is already open');

      }
      // If both DOM and status are inactive, then drop should become active
      else if (_self.DOMStatus(selector) == 0 && _data.status == 0) {
        // Update its status in data object
        _data.status = 1;

        // Add active class and attribute
        _selector.drop.addClass('active').attr('data-drop-active', 1);
        _selector.dropContainer.addClass('active').attr('data-drop-active', 1);

        // For afterOpen events
        if (_data.handlers.open.length) {

          // Call last event
          _data.handlers.open[_data.handlers.open.length - 1]();

          // Remove the last event that was displayed
          _data.handlers.open.splice(-1, 1);

        }
        // If onMouseup event is set to false
        if (_selector.onMouseup == true) {
          $(document).mouseup(function (event) {
            if (!_selector.drop.is(event.target) && _selector.drop.has(event.target).length === 0 && _data.status == 1) {
              _self.close(selector);
            }
          });
        }
      }

    }
  }
};

/*  ****************************************
    Method: close
    ****************************************  */
// To close a particular drop
Drop.prototype.close = function(selector) {
  var _self = this;

  if (typeof selector != 'undefined' && typeof selector != 'object' && _self.isValidDom(selector)) {
    
    var _selector = _self.children(selector);

    // Return the data row status that's matching
    var _data = _self.getDataRow(selector);

    // If data row was found
    // Drop must be active
    if (typeof _data != 'undefined' && _self.DOMStatus(selector) == 1 && _data.status == 1 && _data.enable == 1) {

      // Update its status in data object
      _data.status = 0;

      // Remove active class and attribute
      _selector.drop.removeClass('active').removeAttr('data-drop-active');
      _selector.dropContainer.removeClass('active').removeAttr('data-drop-active');

      if (_data.handlers.close.length) {

        // Call last event
        _data.handlers.close[_data.handlers.close.length - 1]();

        // Remove the last event that was displayed
        _data.handlers.close.splice(-1, 1);
      }

    }
  }
};


// These two methods will probably change to something like; onChange
// as we are doing the same thing for both of them except minor things

/*  ****************************************
    Method: onOpen
    ****************************************  */
// To fire events upon opening a particular Drop
Drop.prototype.onOpen = function(handler, selector) {
  var _self = this;
  // If both selector and handler are valid
  if (handler && typeof selector != 'undefined' && _self.isValidDom(selector)) {

    var _data = _self.getDataRow(selector);

    if (typeof _data != 'undefined') {
      // Add, push events to the specified data row
      _data.handlers.open.push(handler);
      
      // Listen for events
      _self.onChange(_data.handlers.open, selector);
    }
    else {
      console.warn('Drop: There is a problem with onOpen(), no data was found.')
    }
  } 
};


/*  ****************************************
    Method: onClose
    ****************************************  */
// To fire events upon closing a particular Drop
Drop.prototype.onClose = function(handler, selector) {
  var _self = this;
  
  // If both selector and handler are valid
  if (handler && typeof selector != 'undefined' && _self.isValidDom(selector)) {
    
    // var _drop = _self.DOM(selector);
    // var _dropId = _drop.filter('[data-drop-id]') ? _drop.data('drop-id') : '';
    
    // Loop through data object to add this event to
    var _data = _self.getDataRow(selector);

    if (typeof _data != 'undefined') {
      // Add, push events to the specified data row
      _data.handlers.close.push(handler);
      
      // Listen for events
      _self.onChange(_data.handlers.close, selector);
    }

  }
};

/*  ****************************************
    Method: register
    ****************************************  */
// This method is to help registering new drops based on their id, e.g. drop-1
Drop.prototype.register = function (selector, options) {
  var _self = this;

  var _hasProperty = function (_object, property) {
    var _property = property.split(/[,]+/);
    if (_property.length) {
      var _count = 0;
      for (var i = 0; i < _property.length; i++) {
        var _p = _property[i].trim();
        if (!_object.hasOwnProperty(_p)) {
          _count++;
        }
      }
      return _count > 0 ? false : true;
    } else {
      return false;
    }
  };

  // Selector must always exists
  if (typeof selector !== undefined && typeof selector == 'string') {

    // Register Drop through API
    if (typeof options === 'object') {
      // console.info('Drop: Register Drop through API');

      // If it has the mandatory properties
      if (_hasProperty(options, 'target, triggerText, html')) {
        // If its id is unique
        if (!_self.isRegistered(selector)) {
          // console.log('Mandatory properties are there :)')
          var _default = {
            'target': 'body',
            'triggerText': 'My Dropdown',
            'showClose': true,
            'onHover': false,
            'onMouseup': true,
            'html': '<p>This is ' + selector + ' container.</p>',
            'render': ''
          };
          // Get the values of each property
          for (var key in options) {
            var _property = key;
            var _value = options[key];
            // Pass the custom values to _default object if they are not undefined or empty string
            if (typeof _value !== undefined && typeof _value !== 'undefined' && _value !== '') {
              // console.log(typeof _value !== undefined ? _property + ':' + _value : 'No result')
              _default[_property] = _value;
            }
          }
          // console.log('%c' + JSON.stringify(_default), 'background: #222;color: #fff;padding: 4px;line-height: 20px;font-size: 14px;');

          // Create the Drop DOM
          var _createDOM = _self.createDOM(selector, _default);
          // console.log(_createDOM)
          if (_createDOM === true) {
            // Insert the Drop details into Data object
            _self.insertDataRow($('#' + selector));
            // Check if Data object now holds the details we passed it to
            var _data = _self.getDataRow(selector);
            if (typeof _data !== undefined) {
              // If delclared to be rendered to a valid container
              // console.log(typeof options.render)
              if (typeof options.render != 'undefined' && typeof options.render != undefined) {
                if (options.render.length > 0 && $(options.render).length) {
                  _self.renderDOM(selector);
                }
              }
              // Register the onChange() Event
              _self.onChange({}, _data.id);
            }
          }

        } else {
          console.warn('Drop: Another drop is already registered with an id of "' + selector + '".');
        }
      }
      else {
        console.warn('Drop: Mandatory properties don\'t exists.');
      }
    }

    // Register Drop through the markup in the DOM
    else if (typeof options === 'undefined' || typeof options === undefined) {
      // console.info('Drop: Register Drop through the markup in the DOM');
      // Make sure this drop hasn't already been registered
      // The selector must a valid Drop DOM
      var _selector = _self.DOM(selector) != 'undefined' ? selector : '#' + selector;

      if (_self.isValidDom(_selector) && !_self.isRegistered(_selector)) {
        // console.log('Normal register')
        _self.insertDataRow(_selector);

        var _data = _self.getDataRow(_selector);
        if (typeof _data !== undefined) {
          // Register the onChange() Event
          _self.onChange({}, _data.id);
        }
      }
      // The drop already exists and valid but it's been unregistered
      else if (_self.isValidDom(_selector) && _self.isRegistered(_selector)) {
        // console.log('Re-register')
        var _data = _self.getDataRow(_selector);
        if (typeof _data !== undefined) {
          _data.enable = 1;
        }
      }
      // If none of above is true
      else {
        console.info('Drop: This drop is either registered or not a valid selector.');
      }
    }


  }
};


/*  ****************************************
    Method: unregister
    ****************************************  */
Drop.prototype.unregister = function (selector) {
  var _self = this;

  // The selector drop must a be an existing drop
  if (typeof selector !== undefined && _self.isValidDom(selector)) {

    // Return data row with matching Drop id
    var _data = _self.getDataRow(selector);

    console.log(_data)
    // If data row was found
    if (typeof _data !== undefined) {
      // Remove this data row object from data array and then refresh
      // console.log('Remove ' + _data.id)
      // _self.deleteDataRow('id', _dropId);
      _data.enable = 0;
    }
    else {
      console.info('Drop: In order to be able to unregister a drop, that drop must be registered already.');
    }
  }
  else {
    console.info('Drop: The selector was not found in the DOM.');
  }
};