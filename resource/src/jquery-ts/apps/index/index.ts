import * as $ from "jquery";


let a:number = 5;
const b:string = "typescript is ok";
console.log(a);
$(() => {
    $("#app").html(b);
});
