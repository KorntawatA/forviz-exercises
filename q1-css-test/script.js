const imagesContainer = document.querySelector("#images-container");

async function getImages() {
    const imagesResponse = await fetch("https://picsum.photos/v2/list");
    const imagesJSON = await imagesResponse.json();
    
    let imgElement = null;
    imagesJSON.forEach(image => {
        imgElement = document.createElement("img");
        imgElement.setAttribute("src", image.download_url);
        imgElement.setAttribute("class", "image");
        imagesContainer.append(imgElement);
    })
}

getImages();