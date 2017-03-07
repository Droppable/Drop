var Person = (function(){
  var age = 10;

  function person(){


  }

  person.prototype.getAge = function(){
      return age;
  }

  person.prototype.setAge = function(value){
       age = value;
  }

  return person;
}());



var person = new Person();






var Drop = (function () {
  var _this = this;

  
}());