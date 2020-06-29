let str = '213,456,111 likes';
let arr = str.split(" ", 1)[0].split(",");
let ans = "";
for (let i = 0; i < arr.length; i++) {
    ans = ans + arr[i];
}
console.log(ans - '0');
