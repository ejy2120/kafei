function display_cafes(){
    $.ajax({
        type: "GET",
        url: "/get_cafes",
        success: function(data){
            data.forEach(function(cafe){
                var newCafeDiv = $("<div>");
                newCafeDiv.addClass("cafe");
                newCafeDiv.addClass("large");
                newCafeDiv.addClass("col-md-12");
                newCafeDiv.addClass("col-sm-12");

                newCafeDiv.data("id", cafe.id);

                var img = $("<img>");
                img.attr("src", cafe.image1);
                img.attr("alt", cafe.image1alt);
                newCafeDiv.append(img);

                var nameDiv = $("<div>");
                nameDiv.addClass("cafe_name");
                nameDiv.text(cafe.name);
                newCafeDiv.append(nameDiv);

                var boroughDiv = $("<div>");
                boroughDiv.addClass("cafe_borough");
                boroughDiv.text(cafe.borough);
                newCafeDiv.append(boroughDiv);

                var miniBlurb = $("<div>");
                miniBlurb.addClass("mini_blurb");
                miniBlurb.text(cafe.miniblurb);
                newCafeDiv.append(miniBlurb);

                $("#cafe-list").before(newCafeDiv);
            });

            $(".cafe").click(function() {
                var cafeId = $(this).data("id").toString();
                console.log(cafeId);
                console.log(typeof(cafeId));
                window.location.href = "/view/" + cafeId.toString();
            });
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
    
}

function searchFunction(event){
    event.preventDefault();
  
    var query = $("#search_input").val().trim();
    if(query === ""){
        $("#search_input").val("");
        $("#search_input").focus();
        return;
    }

    $.ajax({
        type: "GET",
        url: "/search",
        contentType: "application/json",
        data: {query: query},
        success: function(data){
            //redirect to the search results page
            window.location.href = "/search?query=" + encodeURIComponent(query);
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function addWarnings(event){
    event.preventDefault();
    $(".error").empty();
    var error = false;

    var name = $("#name").val().trim();
    if(name === ""){
        $("#nameError").text("Name cannot be blank.");
        error = true;
    } 

    var image1 = $("#image1").val().trim();
    var image2 = $("#image2").val().trim();
    var image3 = $("#image3").val().trim();
    var image4 = $("#image4").val().trim();
    if(image1 === ""){
        $("#image1Error").text("Image URL cannot be blank.");
        error = true;
    }
    if(image2 === ""){
        $("#image2Error").text("Image URL cannot be blank.");
        error = true;
    }
    if(image3 === ""){
        $("#image3Error").text("Image URL cannot be blank.");
        error = true;
    }
    if(image4 === ""){
        $("#image4Error").text("Image URL cannot be blank.");
        error = true;
    }
    
    var address = $("#address").val().trim();
    if(address === ""){
        $("#addressError").text("Address cannot be blank.");
        error = true;
    }

    var borough = $("#borough").val().trim();
    if(borough === ""){
        $("#boroughError").text("Borough cannot be blank.");
        error = true;
    }

    var rating = parseFloat($("#google_rating").val().trim());
    if(rating === ""){
        $("#ratingError").text("Rating cannot be blank.");
        error = true;
    }
    if(isNaN(rating)){
        $("#ratingError").text("Please enter a number for the rating.");
        error = true;
    }

    var amenities = $("#amenities").val().trim();
    if(amenities === ""){
        $("#amenitiesError").text("Amenities list cannot be blank. If there are no amenities, please specify so.");
        error = true;
    }

    var hours = $("#open_hours").val().trim();
    if(hours === ""){
        $("#hoursError").text("Name cannot be blank.");
        error = true;
    }
    var hours_split = hours.split(",");
    if(hours_split.length != 7){
        $("#hoursError").text("Please enter hours for each day of the week.");
        error = true;
    }

    var about = $("#about").val().trim();
    if(about === ""){
        $("#aboutError").text("Please enter a description about the cafe.");
        error = true;
    }

    var miniblurb = $("#miniblurb").val().trim();
    if(miniblurb === ""){
        $("#miniblurbError").text("Please enter a mini-blurb about the cafe.");
        error = true;
    }
    var miniblurb_split = miniblurb.split(".");
    if(miniblurb_split.length > 2){
        $("#miniblurbError").text("Please only enter one sentence for the mini-blurb.");
        error = true;
    }

    var insiderTips = $("#insiderTips").val().trim();
    if(insiderTips === ""){
        $("#insiderTipsError").text("Please enter a few tips about seating, ambience, etc.");
        error = true;
    }

    if(error === false){
        $.ajax({
            type: "POST",
            url: "/submit_data",
            data: $("#addForm").serialize(),
            success: function(data){
                if(!data.redirect){
                    // alert: new cafe added
                    $("#newCafeAdded").css("display", "flex");
                    setTimeout(function() {
                        $("#newCafeAdded").css("display", "none");
                    }, 10000);
                    // user clicks on viewCafe button, redirect to /view/<id>
                    $("#viewCafe").click(function() {
                        window.location.href = "/view/" + data.id;
                    });
                    // clear form and focus cursor
                    $("#addForm")[0].reset();
                    $("#name").focus();
                } else {
                    window.location.href = data.redirect;
                }
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        })
    }
}



$(document).ready(function(){
    display_cafes();

    $("#search-form").submit(searchFunction);

    $("#addForm").submit(addWarnings);

    $("#edit_cafe").click(function() {
        // get the cafe id from the current URL
        var id = window.location.pathname.split('/').pop();
        // redirect to the edit page
        window.location.href = "/edit/" + id;
    });

    $("#discard_changes").click(function(){
        $("#warning_box").css("display", "block");
    });
    
    $("#no_discard").click(function(){
        $("#warning_box").css("display", "none");
    })

    $("#yes_discard").click(function(){
        $("#warning_box").css("display", "none");
        var id = window.location.pathname.split('/').pop();
        window.location.href = "/view/" + id;
    })

});