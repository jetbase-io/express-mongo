db.createUser(
    {
        user: "admin",
        pwd: "jetbase",
        roles:[
            {
                role: "readWrite",
                db:   "jetbase"
            }
        ]
    }
);