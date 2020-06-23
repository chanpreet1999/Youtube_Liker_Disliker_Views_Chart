let arrObj = [ {
    likes : 213,
    dislikes : 321, 
    views : 100,
    order : 0
}, {
    likes : 88713,
    dislikes : 321, 
    views : 200,
    order : 1 
}, {
    likes : 72213,
    dislikes : 321, 
    views : 300,
    order : 2
} ];

let likes  = [];
let dislikes = [];
let views = [];
for(  let i = 0; i < arrObj.length; i++ )
{
    likes.push( arrObj[i].likes );
    dislikes.push( arrObj[i].dislikes );
    views.push( arrObj[i].views );
}
console.log(likes);
console.log(dislikes);
console.log(views);


