var particles = [];

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    return false;
});

$(document).ready(function () {
    loadNavbarOpacityOnScroll();
    loadParticlesJS();
    loadTypedJS();
    loadWowJS();
    startLogoParallax();
    startProjectsFilters();
    loadProjects();
    $(".project-container, .projects-filters li").on("keydown", function(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });
    $(".projects-filters li.active").trigger("click");
    startProjectImageScaleOnHover();

    window.addEventListener("orientationchange", loadParticlesJS);
});

function loadNavbarOpacityOnScroll() {
    var isCollapsed = true;

    function addScrolledClass() {
        $('.navbar').toggleClass('scrolled', $(document).scrollTop() > 0 || !isCollapsed);
    }
    
    addScrolledClass();

    $(window).scroll(addScrolledClass);
    $(".navbar-collapse").on('show.bs.collapse', function() {isCollapsed = false; addScrolledClass();});
    $(".navbar-collapse").on('hide.bs.collapse', function() {isCollapsed = true; addScrolledClass();});
}

function loadParticlesJS() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    particles[0] = particlesJS.load("header-particles-bg", "assets/config/particles-bg.json");
    particles[1] = particlesJS.load("contact-particles-bg", "assets/config/particles-bg.json");
}

function loadTypedJS() {
    var options = {
        strings: ["Ingénieur ESIGELEC", "Dominance Ingénierie des Systèmes Médicaux", "Électronique", "Robotique"],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        $(".header-overlay-typed").text(options.strings[0]);
        return;
    }
    new Typed(".header-overlay-typed", options);
}

function loadWowJS() {
    var wow = new WOW();
    wow.init();
}

function startLogoParallax() {
    var parallaxElements = [
        {"scene": ".header-scene", "input": "header"}, 
        {"scene": ".contact-scene", "input": "#contact"}, 
    ];

    parallaxElements.forEach(function(parallaxElement) {
        new Parallax($(parallaxElement.scene)[0], {
            hoverOnly: true,
            inputElement: $(parallaxElement.input)[0],
            invertX: false,
            invertY: false
        });
    });
}

function startProjectsFilters() {
    $(".projects-filters li").click(async function() {
        $(".projects-filters li.active").removeClass("active");
        $(this).addClass("active");

        let filter = $(this).data("filterName");
        $(".project-container").each(function() {
            let categories = $(this).data("projectCategories");
            if (typeof categories === "string") {
                categories = categories.replace(/'/g, '"'); // Remplacement des quotes simples pour un JSON valide
                categories = JSON.parse(categories);
            }
            let show = filter === "selection" 
                ? categories.includes("selection") // Si on filtre sur selection, on montre uniquement ceux-là
                : categories.includes(filter);
            $(this).toggle(show);
        });
    });
}

function loadProjects() {
    $(".project-container").click(function() {
        let projectName = $(this).data("projectName");

        $("#project").addClass("project-loading");

        $(".loading-body .spinner-border").show();
        $(".loading-body span").text("Veuillez patienter...")

        var request = new XMLHttpRequest();
        request.open("GET", "assets/projects_data/fr/" + projectName + ".json?v=20261003-audit", true);
        request.onerror = function() {
            $(".loading-body .spinner-border").hide();
            $(".loading-body span").text("Impossible de charger ce projet. Réessayez.")
        }
        request.onload = async function() {
            if (this.status >= 200 && this.status < 400) {
                let data;
                try { data = JSON.parse(this.response); }
                catch (error) { request.onerror(); return; }

                // Title
                $("#project .modal-project-title").text(data.title);

                // Carousel and Images
                $("#project-carousel").find("video").each(function() { this.pause(); });
                $("#project-carousel").carousel("pause");
                $("#project-carousel > .carousel-inner").html("");

                $("#project .project-images").html("");

                // Explicit media lists avoid empty slides and support video demonstrations.
                if (Array.isArray(data.media)) {
                    data.media.forEach(function(media, index) {
                        let item = $("<div></div>").addClass("carousel-item");
                        if (index === 0) item.addClass("active");
                        let content;
                        if (media.type === "video") {
                            item.css("transform", "none");
                            content = $("<video></video>").attr({
                                src: media.src, poster: media.poster, controls: true,
                                preload: "metadata", playsinline: true, "aria-label": media.alt
                            }).css({width: "100%", height: "100%", objectFit: "contain", background: "#f2f4f5"});
                        } else {
                            content = $("<img>").attr({src: media.src, alt: media.alt}).addClass("d-block w-100");
                        }
                        item.append(content);
                        $("#project-carousel > .carousel-inner").append(item);
                        let button = $("<button></button>").attr({type: "button", "aria-label": media.alt})
                            .css({border: 0, padding: 0, background: "transparent", width: "100%", cursor: "pointer"})
                            .append($("<img>").attr({src: media.poster || media.src, alt: media.alt}));
                        if (media.type === "video") button.append($("<span></span>").text("▶ " + media.alt));
                        button.click(function() { $("#project-carousel").carousel(index); });
                        $("#project .project-images").append($("<li></li>").addClass("col-4 col-sm-3").append(button));
                    });
                }

                for(let i=1; !Array.isArray(data.media) && i<=data.images; i++) {
                    let div = $("<div></div>").addClass("carousel-item").append(
                        $("<img>")
                            .attr("src", "assets/animations/loading.svg")
                            .attr("data-img", projectName + "_" + i)
                            .addClass("d-block w-100")
                            .attr("alt", projectName + " image " + i)
                    );

                    if(i == 1) div.addClass("active");
                    $("#project-carousel > .carousel-inner").append(div);

                    let li = $("<li></li>").addClass("col-4 col-sm-3")
                        .data("imageIndex", i)
                        .click(function() {
                            $("#project-carousel").carousel($(this).data("imageIndex")-1);
                        })
                        .append(
                            $("<img>")
                                .attr("src", "assets/animations/loading.svg")
                                .attr("data-img", projectName + "_" + i)
                        );

                    let img = new Image;
                    img.onload = function() {
                        $("#project img[data-img='"+ projectName + "_" + i + "']")
                            .attr("src", img.src)
                            .attr("srcset", img.srcset);
                    }
                    let projectImg = "assets/projects/" + projectName + "/" + projectName + "_" + i;
                    img.srcset = projectImg + ".webp";
                    img.src = projectImg + ".webp"; // Priorité au .jpg

                    console.log("Chargement de :", img.src);
                    $("#project .project-images").append(li);
                }
                $("#project-carousel").off(".projectMedia")
                    .on("slide.bs.carousel.projectMedia", function() {
                        $(this).find("video").each(function() { this.pause(); });
                    });
                $("#project").off("hide.bs.modal.projectMedia").on("hide.bs.modal.projectMedia", function() {
                    $(this).find("video").each(function() { this.pause(); });
                });
                $("#project-carousel").carousel();
                if (Array.isArray(data.media)) $("#project-carousel").carousel("pause");

                // Information
                $("#project .project-info table").html("");
                data.information.forEach(function(info) {
                    let row = $("<tr></tr>");
                    row.append(
                        $("<td></td>").text(info.header),
                        $("<td></td>").html(info.value)
                    );
                    $("#project .project-info table").append(row);
                });

                // Description
                $("#project .project-description > div").html("");
                data.description.forEach(function(paragraph) {
                    let p = $("<p></p>").html(paragraph);
                    $("#project .project-description div").append(p);
                });

                // Resources
                $("#project .project-resources > div").html("");
                $("#project .project-resources").toggle(data.resources.length > 0);
                data.resources.forEach(function(resource) {
                    let a = $("<a></a>").addClass("resource-container d-flex flex-column align-items-center")
                        .attr("target", "_blank")
                        .attr("href", resource.link)
                        .append(
                            $("<img>").attr("src", resource.image.endsWith(".svg") ? resource.image : resource.image + ".webp").attr("alt", resource.name),
                            $("<span>").text(resource.name)
                        );
                    if (!resource.link) {
                        a.attr({"aria-disabled": "true", "tabindex": "-1"})
                            .removeAttr("target").addClass("resource-disabled");
                    } else {
                        a.attr("rel", "noopener noreferrer");
                    }
                    $("#project .project-resources > div").append(a);
                });

                $("#project").removeClass("project-loading");
            } else {
                request.onerror();
            }
        };
        request.timeout = 15000;
        request.ontimeout = request.onerror;
        request.send();
        $("#project").modal();
    });
}

function startProjectImageScaleOnHover() {
    $("#project-carousel").on("touchend", function(event) {
        if ($(event.target).closest("img").length) event.preventDefault();
    });

    $("#project-carousel").mousemove(function(event) {
        var relX = event.pageX - $(this).offset().left - $(this).width()/2;
        var relY = event.pageY - $(this).offset().top - $(this).height()/2;

        relX = relX*1.3 + $(this).width()/2;
        relY = relY*1.3 + $(this).height()/2;

        $(".carousel-item").css("transform-origin", relX + "px " + relY + "px");
    });
}
