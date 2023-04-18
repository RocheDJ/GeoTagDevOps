
export const imageRoutes = [
    { method : "GET",
    path : "/images/{path*}",
    config : {
        auth: false
    },
    handler: {
        directory: { path: "./images", listing: false, index: false }
    }
}

];