


// Let's initialse an instance of drop
// Drop is based on data attribute and not class
// The only class that uses is .active and that's for displaying
var myDrop = new Drop();

// Let's add an event to a particular drop so it fires whenever it opens

myDrop.onOpen(function () {
  console.log('Event #1 upon open for Dropdown 1');
}, 'drop-1');

myDrop.onOpen(function () {
  console.log('Event #2 upon open for Dropdown 1');
}, 'drop-1');



myDrop.onOpen(function () {
  console.log('Event #1 upon open for Dropdown 2');
}, 'drop-2');


/****************************************** */




myDrop.onClose(function () {
  console.log('Event #1 upon close for Dropdown 1');
}, 'drop-1');

myDrop.onClose(function () {
  console.log('Event #1 upon close for Dropdown 2');
}, 'drop-2');



// myDrop.open('drop-1');

/******************************************** */



/* Open Dropdown 2 dynamically */
$('#open-drop-2').click(function () {
myDrop.open('drop-1');
});


/* Attach handler to Dropdown 3 */
$('#attach-handler-3').click(function () {
var _a = $(this);
setTimeout(function () {
  _a.text('.');
}, 1000);

setTimeout(function () {
  _a.text('..');
}, 1500);

setTimeout(function () {
  _a.text('...');
}, 2000);

setTimeout(function () {
  myDrop.onOpen(function () {
    alert('Event #1 upon open for Dropdown 3 (added dynamically through another button)');
  }, 'dropdown-3');
}, 2500);

setTimeout(function () {
  _a.text('.');
}, 3000);

setTimeout(function () {
  _a.text('..');
}, 3500);

setTimeout(function () {
  _a.text('...');
}, 4000);

setTimeout(function () {
  _a.text('Attached the event!');
}, 4500);

});



/************************ */
// add a dynamic drop markup and then register it
$('#create-drop').click(function () {
  $('#dynamic').append('\
  <div class="drop" id="dropdown-4" data-drop>\
      <button class="drop-button" data-drop-button>Dropdown 4</button>\
      <div class="drop-container" data-drop-container>\
      <span class="drop-close" data-drop-close>X</span>\
      <p>This is Dropdown 4 container.</p>\
      <ul class="nav">\
          <li><a href="javascript:{}">Link #1</a></li>\
          <li><a href="javascript:{}">Link #2</a></li>\
          <li><a href="javascript:{}">Link #3</a></li>\
      </ul>\
      </div>\
  </div>\
  ');
  myDrop.register('dropdown-4');
});





/**
 * Create a dynamic dropdown on the fly through the API
 */
$('.dynamic-drop').click(function () {

  // Calling the register method
  myDrop.register('dropdown-4', {
    'target': '#dynamic',
    'triggerText': 'My Dropdown',
    // 'showClose': false,
    // 'onHover': true,
    'onMouseup': false,
    'html': '<p>Hello and thank you for using the Drop! One of most complex JavaScript plugins out there!</p>',
    // 'render': '#root'
  });


});