const { user } = require("../Database/users");
const fetch = require("cross-fetch");
const getset = async (req, res) => {
    const username = req.params.username;
    const User = await user.findOne({ login: username });

    if (User) {
        res.status(200).send(User);
    }
    else {
        // let resp;
        // let followers;
        // let following;
        // fetch(`https://api.github.com/users/${username}`)
        //     .then((response) => response.json())
        //     .then(async (response) => {
        //         resp = response;
        //         fetch(`https://api.github.com/users/${username}/followers`)
        //             .then((respo) => respo.json())
        //             .then((respo) => {
        //                 followers = respo
        //             })
        //         fetch(`https://api.github.com/users/${username}/following`)
        //             .then((respon) => respon.json())
        //             .then((respon) => {
        //                 following = respon;

        //             })


        //     })


        // console.log(resp);
        let friends = [];
        let resp = await fetch(`https://api.github.com/users/${username}`);
        let data = await resp.json();

        let followers = await fetch(`https://api.github.com/users/${username}/followers`)
        let dat = await followers.json();

        let following = await fetch(`https://api.github.com/users/${username}/following`)
        let dt = await following.json()


       
                const mutual = dat.filter((el)=>{
                    return dt.some((ele2)=>{
                        return el.login !== ele2.login;
                    })
                })

            mutual.forEach((el)=>{
                let payLoad = {
                    login:el.login,
                    url:el.url,
                    repos:el.repos_url
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
                url:data.url,
                html_url:data.html_url,
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
                email:data.email,
                hireable: data.hireable,
                bio: data.bio,
                twitter_username: data.twitter_username,
                public_repos: data.public_repos,
                public_gists: data.public_gists,
                followers: data.followers,
                following: data.following,
                created_at: data.created_at,
                updated_at: data.updated_at,
                friends:friends
            })
            return res.status(200).send(data);
        }
        catch (err) {
            console.log(err);
            return res.status(500).send("internal server error");
        }

    }

}

const mutualfriends = (req, res) => {
    const username = req.username;

    // fetch(``)
    res.status(200).send("Hello world");
}

module.exports = {
    getset,
    mutualfriends
}