//jshint esversion:6
const express=require("express");
const https=require("https");
const app=express();
const bodyParser=require("body-parser")
const request=require("request");
app.use(bodyParser.urlencoded({extended:true}));
//to use css and other static files we have to specify static folder
app.use(express.static("public"));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
})
app.post("/failure",function(req,res) {
  res.redirect("/") //redirect to root page
});
app.post("/",function(req,res) {
  const firstName=req.body.firstName;
  const lastName= req.body.lastName;
  const emailadd=req.body.emailadd;
  console.log(firstName,lastName,emailadd);
  const data = {
    members : [
      {
        email_address:emailadd,
        status:"subscribed",
        merge_field:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data);

  const url="https://us5.api.mailchimp.com/3.0/lists/eda33274e8";
    const options={
      method:"POST",
      auth:"vishal:93a05f23772fc94d0f0f39dff1dc95ce-us5",
    }
    const request=https.request(url,options,function(response){
      if (response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
      }
      else {
        res.sendFile(__dirname+"/failure.html");
      }
      response.on("data",function(data){
        console.log(JSON.parse(data));
      })
  })
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000,function() {
  console.log("server is running on port 3000");
});
