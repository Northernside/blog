<!--
published: 31/05/2024 02:45:00
meta_image: /media/mc-data-scraping-thumbnail.png
-->

# Scraping Minecraft profiles, with Swag!

## Context
In essence, Minecraft accounts are stored in a database and can be accessed through the Mojang API. This API returns data such as the account’s UUID, username, current skin and cape. In order to access this data, you can either input the username or UUID of the account you want the data for.

## The Idea
If you're interested in collecting data, especially personal data then you've come to the right place!
Collecting data about Minecraft profiles isn't just some random stuff that will end up on your old and dusty HDD. People like me actually use this data to create cool stuff like statistics, search for newly released (or even yet unknown 👀) capes, and generally... for spending the rest of your free time.

There isn't a great amount of information about this topic yet, as there are only a few people doing this. However, I'm here to help! I'm going to show you how to scrape Minecraft profiles and get all the data you need. This will help me bring my yapping to a concrete form of text.

## Rate Limiting
The Mojang API is rate-limited, which means you can only send a certain amount of requests per a specific time period. The rate limit is linked to the IP address you're using. If you exceed the rate limit, you'll be blocked from accessing the API for a certain amount of time. This is certainly a problem if you're planning to scrape a lot of profiles in a short-ish amount of time.

The key to solving this problem is not to use proxies, but to use a pool of IP addresses which you will rotate every nᵗʰ request. But how do you get a pool of IP addresses? Well, to answer that question, you need to know if you want to spend a lot of money and get just a few IPs in return or if you want to spend nothing and get a lot (trillions) of IPs in return. You'll choose the latter if you're sane (doesn't matter, I'm insane and chose it anyway).

## IPv4 vs IPv6
There are two present types of IP addresses: IPv4 and IPv6. IPv4 addresses are the most common and are the ones you're probably familiar with. IPv6 addresses are the new kids on the block and are slowly replacing IPv4 addresses. The main difference between the two is that IPv4 addresses are 32 bits long, while IPv6 addresses are 128 bits long. This means that there are 2³² (`4,294,967,296`) IPv4 addresses and 2¹²⁸ (`340,282,366,920,938,463,463,374,607,431,768,211,456`) IPv6 addresses. This is a huge difference which is why you should choose IPv6 over IPv4 if you're planning to scrape a lot of profiles as providers tend to give away a lot of IPv6 addresses for free or for a very low price compared to the prices of IPv4 addresses.

There are plenty of server providers already assigning a /64 subnet to each server, which means you get 2⁶⁴ (`18,446,744,073,709,551,616`) IPv6 addresses. IPv6 prefixes (subnets) are written in CIDR notation, which is a way of representing a range of IP addresses. The notation consists of an IP address and a number after a slash, which represents the number of bits in the prefix. For example, `2001:db8::/32` is a prefix that includes all IP addresses from `2001:db8:0:0:0:0:0:0` to `2001:db8:0:ffff:ffff:ffff:ffff:ffff`. To calculate the number of IP addresses in a prefix, you can use the formula `2^(128 - prefix_length)`. For example, a /48 prefix has `2^(128 - 48) = 2^80 = 1,208,925,819,614,629,174,706,176` IP addresses.

Mojang recently started to put a rate limit onto entire /64 subnets as well, so you should consider getting yourself a /48 subnet.
There are plenty of providers that offer /48 subnets for free or for a very low price. You can find a list of providers that offer free IPv6 subnets [here](https://handwiki.org/wiki/List_of_IPv6_tunnel_brokers).

## Setting it up
To start scraping Minecraft profiles, you need to have a server with a (preferably) /48 IPv6 subnet. Once you have that and did the proper setup, you can start scraping profiles. I will not provide you with the code to scrape profiles, as I don't want to be responsible for any misuse of the Mojang API. However, you won't need to write more than 250 lines of code to get it working. It is recommended to use a language that supports proper multi-threading.

## My journey
I started scraping Minecraft profiles back in 2023 when I joined an amazing group called "Fanclub". We do a lot of silly billies with the Mojang API (besides scraping profiles). At first, I was very inexprienced and didn't know what I was doing. I was trying to use proxies which charged me a lot of money and they weren't even working properly. After a few months, I finally grasped the potential of IPv6 subnets and started using them. At first, I was just using the free /64 subnet that Hetzner assigned to my server, but after a while, more and more rate limits were put onto the subnet. I then decided to get a /48 subnet from a tunnel broker and I've been using it ever since. Back then, I was able to hit about 100,000 usernames per minute, which isn't bad, especially when you consider that I was using JavaScript. Luckily not with Node.js, but with [Bun](https://bun.sh) (not sponsored, but I wish I was!).

I tried to extend my C++ knowledge and rewrite my code in C++, but I failed miserably (or better, I gave very early on). After quite some time I consulted one of my geeky friends, named [Kapilarny](https://github.com/Kapilarny), who helped me rewrite my code in Rust. We gave up on the project after a few days (well, not officially, we just lost motivation and discontinued it). Another friend of mine has been working with [Go](https://go.dev) for quite some time and always tried to convince me to switch to Go (not just for this project, but for everything). I finally gave in and watched some videos on YouTube that briefly explain the basics of Go. After watching three or four of them, I began to write some basic silly stuff in Go to get a feel for the language. And after a few days, I finally tried to make a variant of my previous tries in Go. And guess what? It turned out surprisingly well! I was able to hit about 350,000 usernames per minute, which is a huge improvement over my previous attempts. After a day or two I even optimized it a bit and was able to hit about 800,000 usernames per minute. I was very happy with the results and decided to stick with Go for the time being. About one and a half weeks later, I gave my code another overhaul together with my friend [Mohamed](https://github.com/mxha39) and we were able to score whopping 4,500,000 usernames per minute. I was very happy with the results and decided to stick with Go for the time being.

The following graphs show the amount of usernames and UUIDs I was able to scrape per minute at the peak of my journey.


### Usernames / minute (~7.2 million peak):

![Graph of usernames per minute, peaking at 7.2 million](/media/mc-data-scraping-names.png)


### UUIDs / minute (~1.8 million peak):

![Graph of uuids per minute, peaking at 1.8 million](/media/mc-data-scraping-uuids.png)

## Storing the data
After you've scraped all the data you need, you need to store it somewhere. You can either store it in a database or in a file. If you're planning to store a lot of data (and also use it), you should consider using a database. There are plenty of databases to choose from, but I recommend using [PostgreSQL](https://www.postgresql.org/) if you're going for SQL and [LMDB](https://en.wikipedia.org/wiki/Lightning_Memory-Mapped_Database) if you're looking for a simple key-value store (which is what I am using). You should be able to figure out how to structure your data yourself, as it depends on what you're planning to do with it.

One of my HDDs which I've used to store code backups (just a local Git server) and general data (like the scraped Minecraft profiles) died on me a few weeks ago. Unfortunately, recovering that data was impossible, as the HDD was completely dead. Because of that, I lost around 3.5 million profiles and 80% of my code used for the general storage system (consisting of a database wrapper, a REST API for my different services which were able to insert new profiles, update profiles and announce their status (requests/minute, newly found profiles, etc.) and a simple web interface to view the data and query for specific results). I was very sad about this, but I learned from my mistake and started to backup my data more frequently and not on 12 year old hard drives.

I'm already in the process of rewriting the code and I'm planning to release it as open-source software. I'm also planning to write a blog post about it, so stay tuned!

## Conclusion
Scraping Minecraft profiles is a fun and interesting thing to do. It's not just about collecting data, but also about learning new things and improving your skills. This is everything I have learned from my journey and I hope you can learn something from it too. I mainly focused on scraping usernames, but you can also scrape UUIDs (or rather, the profile data (consisting of the UUID, username, skin and cape) itself) if you want to. The process is not entirely different, but you need to be aware that you shouldn't go into the millions of requests per minute, as Mojang's server purposefully close active connections.

I hope you enjoyed reading this article. If you have any questions or feedback, feel free to reach out to me on Discord [@northernsidepng](https://discord.com/users/434417514332815370) or via E-Mail [contact@northernsi.de](mailto:contact@northernsi.de). I'm always happy to help and answer your questions.

Have a great day and happy scraping!

*P.S.: Make sure to check out my friend's blog post as well: [How to Make a List of Nearly Every Minecraft Player](https://matdoes.dev/minecraft-uuids) by [matdoesdev](https://matdoes.dev).*