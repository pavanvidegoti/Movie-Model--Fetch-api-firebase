let cl = console.log;

const showModalBtn = document.getElementById("showModalBtn");
const backDrop = document.getElementById("backDrop");
const myModal = document.getElementById("myModal");
const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const overviewControl = document.getElementById("overview");
const ratingControl = document.getElementById("rating");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const movieClose =[...document.querySelectorAll(".movieClose")];
const movieForm = document.getElementById("movieForm");
const MovieBody = document.getElementById("MovieBody");
const loader = document.getElementById("loader");
const cancelBtn = document.getElementById("cancelBtn");

const baseUrl = `https://batch-12-fetch-posts-c8153-default-rtdb.asia-southeast1.firebasedatabase.app`;

const postUrl = `${baseUrl}/posts.json`;

const sanckBarMsg = (msg,iconName,time) => {
    Swal.fire({
        title : msg,
        icon : iconName,
        timer:time
    })
}

const objToArr = (obj) => {
    let Array =[];
    for (const key in obj) {
        Array.push({...obj[key], id : key})
    }
    return Array
}

const templating = (ele) =>{
    MovieBody.innerHTML = ele.map(obj=>{
        return `
        <div class="col-md-4">
            <div class="card mb-4" >
                <figure class="movieContainer" id="${obj.id}">
                    <img src="${obj.imgUrl}" alt="${obj.title}" target="${obj.title}">
                    <figcaption>
                        <div class="heading">
                            <div class="row">
                               <div class="col-sm-10">
                                <h4>
                                ${obj.title}
                                </h4>
                               </div>
                               <div class="col-sm-2">
                                  ${obj.rating >=4 ?`<span class="badge badge-success">${obj.rating}</span>`:
                                  obj.rating < 4 && obj.rating >= 2 ? `<span class="badge badge-warning">${obj.rating}</span>`:
                                  `<span class="badge badge-danger">${obj.rating}</span>`}
                               </div>
                            </div>
                        </div>
                        <div class="overviewSection">
                            <h5>
                                Overview :
                            </h5>
                            <p>
                            ${obj.overview}
                            </p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onMovieEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onMovieDelete(this)">Delete</button>
                            </div>
                            
                        </div>
                    </figcaption>
                </figure>
            </div>
        </div>
        
        `
    }).join("");
}

const addCard = (ele) => {
    let card = document.createElement("div");
    card.id = ele.id;
    card.className = "col-md-4";
    card.innerHTML = `
    <div class="card mb-4" >
                <figure class="movieContainer" id="${ele.id}">
                    <img src="${ele.imgUrl}" alt="${ele.title}" target="${ele.title}">
                    <figcaption>
                        <div class="heading">
                            <div class="row">
                               <div class="col-sm-10">
                                <h4>
                                ${ele.title}
                                </h4>
                               </div>
                               <div class="col-sm-2">
                                  ${ele.rating >=4 ?`<span class="badge badge-success">${ele.rating}</span>`:
                                  ele.rating < 4 && ele.rating >= 2 ? `<span class="badge badge-warning">${ele.rating}</span>`:
                                  `<span class="badge badge-danger">${ele.rating}</span>`}
                               </div>
                            </div>
                        </div>
                        <div class="overviewSection">
                            <h5>
                                Overview :
                            </h5>
                            <p>
                            ${ele.overview}
                            </p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onMovieEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onMovieDelete(this)">Delete</button>
                            </div>
                            
                        </div>
                    </figcaption>
                </figure>
            </div>
    
    `
    MovieBody.prepend(card);

}

const makeApiCall = (apiUrl,methodName,msgBody = null)=>{
    if(msgBody){
        msgBody = JSON.stringify(msgBody)
    }
    loader.classList.remove("d-none")
    return fetch(apiUrl,{
        method:methodName,
        body:msgBody
    })
    .then(res=>{
        return res.json()
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        loader.classList.add("d-none")
    })
}

makeApiCall(postUrl,"GET")
.then(res=>{
    cl(res)
    let Array = objToArr(res)
    templating(Array.reverse())
})
.catch(err=>{
    cl(err)
})



const onShowHideHnadler = () => {
    myModal.classList.toggle("active");
    backDrop.classList.toggle("active");
    movieForm.reset();
    updateBtn.classList.add("d-none")
    submitBtn.classList.remove("d-none")
}

const onAddMovie = (ele) => {
    ele.preventDefault();
    let newMovie = {
        title:titleControl.value,
        imgUrl:imgUrlControl.value,
        overview:overviewControl.value,
        rating:ratingControl.value
    }
    cl(newMovie)
   
    makeApiCall(postUrl,"POST",newMovie)
    .then(res=>{
        newMovie.id = res.name
        addCard(newMovie)
        sanckBarMsg(`The Movie ${newMovie.title} is Added Successfully..!!`,`success`,2000)
    })
    .catch(err=>{
        cl(err)
        sanckBarMsg(`Something went wrong while Adding Post..!!`,`error`,2000)
    })
    .finally(()=>{
        movieForm.reset()
        onShowHideHnadler()
    })
}

const onMovieEdit = (ele) => {
    let editId = ele.closest(`.movieContainer`).id;
    cl(editId)
    localStorage.setItem("editId",editId);
    let editUrl = `${baseUrl}/posts/${editId}.json`;
    cl(editUrl)
    makeApiCall(editUrl,"GET")
    .then(res=>{
        onShowHideHnadler()
        titleControl.value = res.title
        imgUrlControl.value = res.imgUrl
        overviewControl.value = res.overview
        ratingControl.value = res.rating
        updateBtn.classList.remove("d-none")
        submitBtn.classList.add("d-none")
    })
    .catch(err=>{
        cl(err)
    })
}

const onUpdateMovie = (ele) => {
    let updatedId = localStorage.getItem("editId");
    cl(updatedId)
    let updatedUrl = `${baseUrl}/posts/${updatedId}.json`;
    cl(updatedUrl)
    let updatedObj = {
        title:titleControl.value,
        imgUrl:imgUrlControl.value,
        overview:overviewControl.value,
        rating:ratingControl.value,
        id:updatedId
    }
    cl(updatedObj);
    makeApiCall(updatedUrl,"PATCH",updatedObj)
    .then(res=>{
        cl(res)
        let card = document.getElementById(updatedId)
        cl(card)
        card.innerHTML = `
        <div class="card mb-4" >
                <figure class="movieContainer" id="${updatedObj.id}">
                    <img src="${updatedObj.imgUrl}" alt="${updatedObj.title}" target="${updatedObj.title}">
                    <figcaption>
                        <div class="heading">
                            <div class="row">
                               <div class="col-sm-10">
                                <h4>
                                ${updatedObj.title}
                                </h4>
                               </div>
                               <div class="col-sm-2">
                                  ${updatedObj.rating >=4 ?`<span class="badge badge-success">${updatedObj.rating}</span>`:
                                  updatedObj.rating < 4 && updatedObj.rating >= 2 ? `<span class="badge badge-warning">${updatedObj.rating}</span>`:
                                  `<span class="badge badge-danger">${updatedObj.rating}</span>`}
                               </div>
                            </div>
                        </div>
                        <div class="overviewSection">
                            <h5>
                                Overview :
                            </h5>
                            <p>
                            ${updatedObj.overview}
                            </p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary" onclick="onMovieEdit(this)">Edit</button>
                                <button class="btn btn-danger" onclick="onMovieDelete(this)">Delete</button>
                            </div>
                            
                        </div>
                    </figcaption>
                </figure>
            </div>
    
        
        ` 
        onShowHideHnadler()
        movieForm.reset()
        updateBtn.classList.add("d-none")
        submitBtn.classList.remove("d-none")
        sanckBarMsg(`The Movie ${updatedObj.title} is Updated Successfully`,`success`,2000)
    })
    .catch(err=>{
        cl(err)
        movieForm.reset()
        sanckBarMsg(`Something went wrong while updating`,`error`,2000)
    })
    .finally(()=>{
       
       
       
    })
}

const onMovieDelete = (ele) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let deleteId = ele.closest(`.movieContainer`).id;
            cl(deleteId);
            let deleteUrl = `${baseUrl}/posts/${deleteId}.json`;
            cl(deleteUrl);
            makeApiCall(deleteUrl,"DELETE")
            .then(res=>{
                ele.closest(".col-md-4").remove()
                // document.getElementById(deleteId).remove()
                sanckBarMsg(`The Movie is Deleted Successfully..!!`,`success`,2000)
            })
            .catch(err=>{
                cl(err)
            })
        }
      });
   
}

showModalBtn.addEventListener("click",onShowHideHnadler);
movieClose.forEach(obj=>obj.addEventListener("click",onShowHideHnadler));
movieForm.addEventListener("submit",onAddMovie);
updateBtn.addEventListener("click",onUpdateMovie);
