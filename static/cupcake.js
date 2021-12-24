async function getCupcakes() {
    const response = await axios.get('http://127.0.0.1:5000/api/cupcakes');
    return response.data.cupcakes;
}

async function getCupcake(evt) {
    const response = await axios.get(`http://127.0.0.1:5000/api/cupcakes/${evt.target.id}`);
    return response.data.cupcake;
}

async function addCupcake(evt) {
    //evt.preventDefault();
    const cupcake = { flavor: $("#flavor").val(), size: $("#size").val(), rating: $("#rating").val() };

    if ($("#image").val()) {
        cupcake = { image: $("#image").val() }
    }

    const response = await axios.post('http://127.0.0.1:5000/api/cupcakes', cupcake);

    console.log(response.data)
}

async function removeCupcake(evt) {
    //evt.preventDefault();
    const response = await axios.delete(`http://127.0.0.1:5000/api/cupcakes/${evt.target.className}`);
    $(evt.target).parent().remove();

    console.log(response.data)
}

async function cupcakeList() {
    let cupcakes = [];
    const resp = await getCupcakes();
    cupcakes.push(...resp);

    $("body").append("<section id='cupcake-list'></section>");
    for (let cupcake of cupcakes) {
        $("#cupcake-list").append(`<div>
                                    <img class=${cupcake.id} src='${cupcake.image}'>
                                    <p class=${cupcake.id}>Flavor: ${cupcake.flavor}</p>
                                    <p class=${cupcake.id}>Size: ${cupcake.size}</p>
                                    <p class=${cupcake.id}>Rating: ${cupcake.rating}</p>ƒ
                                    </div>`);
    }

    $("#cupcake-list").on("click", removeCupcake);
}

function AddForm() {
    $("body").append(`____________________________________________________
                    <form id='Add-Form'>
                    <h2>Add a New Cupcake</h2>
                    <label for='flavor'>Flavor: </label>
                    <input id='flavor' placeholder='Cupcake Flavor' required><br><br>
                    <label for='size'>Size: </label>
                    <select id='size' required>
                        <option value='small'>Small</option>
                        <option value='medium'>Medium</option>
                        <option value='large'>Large</option>
                        <option value='x-large'>X-Large</option>
                    </select><br><br>
                    <label for='rating'>Rating: </label>
                    <input id='rating' type='number' min=0 max=10 step=0.1 required><br><br>
                    <label for='image'>Image: </label>
                    <input id='image' placeholder='Image URL'><br><br>
                    <button id='add'>ADD</button>
                    </form>`);
    $("#add").on("click", addCupcake);
}


async function setupAndStart() {
    await cupcakeList();
    AddForm();
}

setupAndStart();