function activeMenuOption(href) {
    $(".app-menu .nav-link")
    .removeClass("active")
    .removeAttr('aria-current')

    $(`[href="${(href ? href : "#/")}"]`)
    .addClass("active")
    .attr("aria-current", "page")
}

const app = angular.module("angularjsApp", ["ngRoute"])
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("")

    $routeProvider
    .when("/", {
        templateUrl: "/app",
        controller: "appCtrl"
    })
     .when("/categorias", {
        templateUrl: "/categorias",
        controller: "categoriasCtrl"
    })
    .when("/lugares", {
        templateUrl: "/lugares",
        controller: "lugaresCtrl"
    })
    .when("/clientes", {
        templateUrl: "/clientes",
        controller: "clientesCtrl"
    })
    .when("/eventos", {
        templateUrl: "/eventos",
        controller: "eventosCtrl"
    })
    .otherwise({
        redirectTo: "/"
    })
})
app.run(["$rootScope", "$location", "$timeout", function($rootScope, $location, $timeout) {
    function actualizarFechaHora() {
        lxFechaHora = DateTime
        .now()
        .setLocale("es")

        $rootScope.angularjsHora = lxFechaHora.toFormat("hh:mm:ss a")
        $timeout(actualizarFechaHora, 1000)
    }

    $rootScope.slide = ""

    actualizarFechaHora()

    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
        $("html").css("overflow-x", "hidden")

        const path = current.$$route.originalPath

        if (path.indexOf("splash") == -1) {
            const active = $(".app-menu .nav-link.active").parent().index()
            const click  = $(`[href^="#${path}"]`).parent().index()

            if (active != click) {
                $rootScope.slide  = "animate__animated animate__faster animate__slideIn"
                $rootScope.slide += ((active > click) ? "Left" : "Right")
            }

            $timeout(function () {
                $("html").css("overflow-x", "auto")

                $rootScope.slide = ""
            }, 1000)

            activeMenuOption(`#${path}`)
        }
    })
}])

app.controller("appCtrl", function ($scope, $http) {
})
app.controller("productosCtrl", function ($scope, $http) {
    $(document).on("click", ".btn-ingredientes", function (event) {
        const id = $(this).data("id")

        $.get(`/productos/ingredientes/${id}`, function (html) {
            modal(html, "Ingredientes", [
                {html: "Aceptar", class: "btn btn-secondary", fun: function (event) {
                    closeModal()
                }}
            ])
        })
    })
})
app.controller("eventosCtrl", function ($scope, $http) {
    $scope.eventos = []
    $scope.lugares = []
    $scope.clientes = []
    $scope.categorias = []

    function cargarDatos() {
        $http.get("/eventos/json").then(res => $scope.eventos = res.data);
        $http.get("/lugares/json").then(res => $scope.lugares = res.data);
        $http.get("/clientes/json").then(res => $scope.clientes = res.data);
        $http.get("/categorias/json").then(res => $scope.categorias = res.data);
    }

    cargarDatos();

    // Guardar evento
    $scope.guardar = function (evento) {
        $http.post("/evento", evento).then(function () {
            alert("Evento guardado")
            location.reload()
        })
    }

})

app.controller("categoriasCtrl", function ($scope, $http) {
    $scope.categorias = []

    // Obtener lista de categorías
    $.get("/categorias").then(function (res) {
        $scope.categorias = res.data
    })

    // Guardar categoría
    $scope.guardar = function (categoria) {
        $http.post("/categoria", categoria).then(function () {
            alert("Categoría guardada")
            location.reload()
        })
    }

    // Eliminar categoría
    $scope.eliminar = function (id) {
        $http.post("/categoria/eliminar", {id: id}).then(function () {
            alert("Categoría eliminada")
            location.reload()
        })
    }
})

app.controller("clientesCtrl", function ($scope, $http) {
    $scope.clientes = []

    // Obtener lista de clientes
    $.get("/clientes").then(function (res) {
        $scope.clientes = res.data
    })

    // Guardar cliente
    $scope.guardar = function (cliente) {
        $http.post("/cliente", cliente).then(function () {
            alert("Cliente guardado")
            location.reload()
        })
    }
})

app.controller("lugaresCtrl", function ($scope, $http) {
    $scope.lugares = []

    // Obtener lista de lugares
    $.get("/lugares").then(function (res) {
        $scope.lugares = res.data
    })

    // Guardar lugar
    $scope.guardar = function (lugar) {
        $http.post("/lugar", lugar).then(function () {
            alert("Lugar guardado")
            location.reload()
        })
    }

})


const DateTime = luxon.DateTime
let lxFechaHora

document.addEventListener("DOMContentLoaded", function (event) {
    const configFechaHora = {
        locale: "es",
        weekNumbers: true,
        // enableTime: true,
        minuteIncrement: 15,
        altInput: true,
        altFormat: "d/F/Y",
        dateFormat: "Y-m-d",
        // time_24hr: false
    }

    activeMenuOption(location.hash)
})



