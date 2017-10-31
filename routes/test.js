var sw = require('stopword')


var data = 'Inheritance is when a \'class\' derives from an existing \'class\'.So if you have a Person class, then you have a Student class that extends Person, Student inherits all the things that Person has.There are some details around the access modifiers you put on the fields/methods in Person, but that\'s the basic idea.For example, if you have a private field on Person, Student won\'t see it because its private, and private fields are not visible to subclasses.Polymorphism deals with how the program decides which methods it should use, depending on what type of thing it has.If you have a Person, which has a read method, and you have a Student which extends Person, which has its own implementation of read, which method gets called is determined for you by the runtime, depending if you have a Person or a Student.It gets a bit tricky, but if you do something likePerson p = new Student();p.read();the read method on Student gets called.Thats the polymorphism in action.You can do that assignment because a Student is a Person, but the runtime is smart enough to know that the actual type of p is Student.Note that details differ among languages.You can do inheritance in javascript for example, but its completely different than the way it works in Java.';

var tokens = data.match(/\w+/g);

var settokens = new Set(tokens);
var tokens = Array.from(settokens);
// console.log(tokens);
// console.log(tokens.length);
var newText = sw.removeStopwords(tokens);
console.log(newText);
console.log(newText.length);
var teja = 'Inheritance class derives existing So Person Student extends inherits things There details access modifiers put fields methods basic idea For private field won visible subclasses Polymorphism deals program decides depending type thing If read method implementation called determined runtime It bit tricky likePerson Thats polymorphism action You assignment smart actual Note differ languages inheritance javascript completely works Java'.split(' ');
teja.forEach(function (t) {
    if(newText.indexOf(t) < 0){
        console.log("1:" + t);
    }
})
