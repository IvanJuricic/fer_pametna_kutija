const express = require('express')
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/login',(req,res)=>{
    const user_name = req.body.user;
    const password = req.body.password;
    console.log("User name = "+user_name+", password is "+password);
    res.end("yes");
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
