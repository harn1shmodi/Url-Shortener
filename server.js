const express = require("express")
const app = express()
const ShortUrl = require("./models/shortUrl")
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://harnish:harnish123@clusterurl.l9jfq.mongodb.net/UrlShortner?retryWrites=true&w=majority", {useNewUrlParser : true, useUnifiedTopology : true})

function isValidUrl(string) {
  try {
    // Use built-in URL constructor for validation
    // This handles international domains through punycode conversion
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

app.set("view engine","ejs")
app.use(express.urlencoded({extended : false}))

app.get("/", async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render("index", {shortUrls : shortUrls})
})

app.post("/shortUrls", async (req,res)=>{
    const fullUrl = req.body.fullUrl;
    
    if (!isValidUrl(fullUrl)) {
        return res.status(400).send("Invalid URL");
    }

    await ShortUrl.create({full: fullUrl})
    res.redirect("/")
})

app.get("/:shortUrl", async (req,res) => {
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 3000)





