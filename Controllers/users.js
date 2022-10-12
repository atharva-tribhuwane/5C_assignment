const { user } = require("../Database/users");
const fetch = require("cross-fetch");
const getset = async (req, res) => {
    const username = req.params.username;
    const User = await user.findOne({ login: username });

    if (User) {
        res.status(200).send(User);
    }
    else {
        fetch(`https://api.github.com/users/${username}`)
            .then((response) => response.json())
            .then(async (response) => {
                // console.log(response);
                try {
                    await user.create({
                        login: response.login,
                        id: response.id,
                        node_id: response.node_id,
                        avatar_url: response.avatar_url,
                        gravatar_id: response.gravatar_id,
                        url:response.url,
                        html_url:response.html_url,
                        followers_url: response.followers_url,
                        following_url: response.following_url,
                        gists_url: response.gists_url,
                        starred_url: response.starred_url,
                        subscriptions_url: response.subscriptions_url,
                        organizations_url: response.organizations_url,
                        repos_url: response.repos_url,
                        events_url: response.events_url,
                        received_events_url: response.received_events_url,
                        type: response.type,
                        site_admin: response.site_admin,
                        name: response.name,
                        blog: response.blog,
                        location: response.location,
                        email:response.email,
                        hireable: response.hireable,
                        bio: response.bio,
                        twitter_username: response.twitter_username,
                        public_repos: response.public_repos,
                        public_gists: response.public_gists,
                        followers: response.followers,
                        following: response.following,
                        created_at: response.created_at,
                        updated_at: response.updated_at
                    })
                    return res.status(200).send(response);
                }
                catch (err) {
                    return res.status(500).send("Internal server error");
                }
            })

    }

}

module.exports = {
    getset
}