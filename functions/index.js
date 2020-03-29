const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
admin.initializeApp(functions.config().firebase);
const app = express();

const cors = require('cors');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors({
    origin: true
}));



app.get('/:url', (req, res) => {
    const url = req.params.url;
    if(url === ''){
        res.status(200).redirect('http://pramana.gitam.edu');
    }
    else{
        const db = admin.firestore();
        const increment = admin.firestore.FieldValue.increment(1);
        db.collection('urls').doc(url)
        .get()
        .then(doc => {
            // eslint-disable-next-line promise/always-return
            if(!doc.exists){
                res.status(404).redirect('http://pramana.gitam.edu/errors/404.html');
            }
            else{
                // eslint-disable-next-line promise/always-return
                db.collection('urls').doc(url).update({count: increment}).then(() => {
                    res.status(301).redirect(doc.data().original_url)
                    return null;
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
});

exports.shorten = functions.https.onRequest(app)