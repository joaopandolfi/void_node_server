const Constants = {
    Ports:{
        http:80,
        https:443
    },
    Debug: true,
    SSL:{
        Key: "/etc/letsencrypt/live/site.com/privkey.pem",
        Cert: "/etc/letsencrypt/live/site.com/fullchain.pem"
    }
}

module.exports = Constants