const { user } = require("../Database/users");
const fetch = require("cross-fetch");
const getset = async (req, res, mode) => {
    const username = req.params.username;
    const User = await user.findOne({ login: username });

    if (User) {
        res.status(200).send(User);
    }
    else {
        let friends = [];
        let resp = await fetch(`https://api.github.com/users/${username}`);
        let data = await resp.json();

        let followers = await fetch(`https://api.github.com/users/${username}/followers`)
        let dat = await followers.json();

        let following = await fetch(`https://api.github.com/users/${username}/following`)
        let dt = await following.json()

        // console.log(data);


        const mutual = dat.filter((el) => {
            return dt.some((ele2) => {
                return el.login !== ele2.login;
            })
        })

        mutual.forEach((el) => {
            let payLoad = {
                login: el.login,
                url: el.url,
                repos: el.repos_url
            }
            friends.push(payLoad);
        })

        try {
            await user.create({
                login: data.login,
                id: data.id,
                node_id: data.node_id,
                avatar_url: data.avatar_url,
                gravatar_id: data.gravatar_id,
                url: data.url,
                html_url: data.html_url,
                followers_url: data.followers_url,
                following_url: data.following_url,
                gists_url: data.gists_url,
                starred_url: data.starred_url,
                subscriptions_url: data.subscriptions_url,
                organizations_url: data.organizations_url,
                repos_url: data.repos_url,
                events_url: data.events_url,
                received_events_url: data.received_events_url,
                type: data.type,
                site_admin: data.site_admin,
                name: data.name,
                blog: data.blog,
                location: data.location,
                email: data.email,
                hireable: data.hireable,
                bio: data.bio,
                twitter_username: data.twitter_username,
                public_repos: data.public_repos,
                public_gists: data.public_gists,
                followers: data.followers,
                following: data.following,
                created_at: data.created_at,
                updated_at: data.updated_at,
                friends: friends
            })
            data["friends"] = friends;
            if (mode === "mutual") {
                return res.status(200).send(data.friends);
            }
            return res.status(200).send(data);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send("internal server error");
        }

    }

}

const mutualfriends = async (req, res) => {
    const username = req.params.username;
    const User = await user.findOne({ login: username });
    if (!User) {
        getset(req, res, "mutual");
    }
    else {
        res.status(200).send(User.friends);
    }
}

const getAllUsers = async (req, res) => {
    const Data = await user.find();
    res.status(200).send(Data);
}


const userbynameloc = async (req, res) => {
    let { username, location } = req.query;
    if (username == undefined && location == undefined) {
        res.status(400).send("Not Enough Data Provided");
    }
    else if (username == undefined) {
        const Data = await user.find({ location: { $regex: `${location}` } });
        if (Data.length < 1) {
            res.status(400).send("No Users with this location exist");
        }
        res.status(200).send(Data);

    }
    else if (location == undefined) {
        // "username" : /.*son.*/i
        const User = await user.find({ login: { $regex: `${username}` } });
        if (!User) {
            res.status(400).send("Username Does not exist in Database");
        }
        res.status(200).send(User);
    }
    else if (username != undefined && location != undefined) {
        const Data = await user.find({ username: { $regex: `${username}` }, location: { $regex: `${location}` } });
        if (Data.length < 1) {
            res.status(400).send("No Users with this location exist");
        }
        res.status(200).send(Data);
    }
}

const userupdate = async (req, res) => {
    let username = req.params.username
    const User = await user.findOne({ login: username });
    if (!User) {
        res.status(400).send("User Does Not Exist in DataBase");
    }
    else {
        let payLoad = req.body;

        if (payLoad["id"] != undefined || payLoad["login"] != undefined || payLoad["node_id"] != undefined || payLoad["url"] != undefined || payLoad["repos_url"] != undefined || payLoad["organizations_url"] != undefined || payLoad["html_url"] != undefined || payLoad["followers_url"] != undefined || payLoad["following_url"] != undefined || payLoad["gists_url"] != undefined || payLoad["starred_url"] != undefined || payLoad["received_events_url"] != undefined || payLoad["type"] != undefined || payLoad["site_admin"] != undefined || payLoad["email"] != undefined || payLoad["hireable"] != undefined) {
            res.status(400).send("Cannot change Sensitive Data");
        }
        else {
            try {
                const Data = await user.updateMany({ login: username }, { $set: req.body })
                res.status(200).send(Data);
            }
            catch (err) {
                res.status(400).send(err);
            }
        }
    }

}

const deleteuser = async (req, res) => {
    const username = req.params.username
    const User = await user.find({ "login": username })
    if (!User) {
        res.status(200).send("User Dont Exist!!!");
    }
    else {
        try {
            let response = await user.deleteOne({ login: username })
            res.status(200).send(response);
        }
        catch (err) {
            res.status(200).send(err);
        }
    }
}

module.exports = {
    getset,
    mutualfriends,
    getAllUsers,
    userbynameloc,
    userupdate,
    deleteuser
}