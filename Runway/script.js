const model = new rw.HostedModel({
    url: "https://attngan-63a75f28.hosted-models.runwayml.cloud/v1/",
    token: "s0c3OdfZu6sxaZ8D88J6Eg==",
});

function generate() {
    console.log("generate image");
    const caption = document.getElementById('memory').value;
    const inputs = {
        "caption": caption
    };
    model.query(inputs).then(outputs => {
        const { result } = outputs;
        // use the outputs in your project
        const img = document.createElement('img');
        img.src = result;
        document.getElementById('results').prepend(img);
    });
}


  //// You can use the info() method to see what type of input object the model expects
  // model.info().then(info => console.log(info));

