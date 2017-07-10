# CompanyFind
Releaf Scrape project utilizing npm-google, fast-csv (attempted proxy rotation)

## Parts of the App
  The main script is inside `app.js` . Although the script did not gather all the data for 5000 companies, it could have done this given proxies or a set of IPs. However, I think it's performance is still very good as a single-threaded process.
  There is a `bonus.csv`, which contains the urls and short descriptions pulled from Google.
  There is the `output.csv` which contains the urls gathered from the Google Search.
  
  I had a lot of fun on this project, so thank you!
  
## Explanation
This project is a Node.JS Script, which pulls the first url from a relevant Google search of a company. As a bonus, it can be easily configurable to attain multiple URLs (given the API),
and also grabs the description from the Google Search, which can pull further company info.

the APIs used (fast-csv, npm-google) were very helpful in writing and searching information easily and quickly. Fast-CSV both read the data and also helped format the final outputs. NPM-Google was very helpful in providing a clean and easy way to both apply proxies and also get information from the Google Search.
I also used built-in JS and algorithms (setTimeout, recursion) to regulate the speed of the script.

The only drawback and potential difficulty with the script would be dealing with Google's tough captcha / usage restrictions - a limit that was on the project from the start.
Many times throughout this task, I had to reset my IP manually to avoid being locked out completely from the search service.

There are several solutions to this, many of which interest me and may be something I implement in the future.
  1) Proxies, and Proxy Rotation - unfortunately through my research, I've found that Google Proxies have been extremely scarce since 2016. Unfortunately, I don't have access to these, and to my knowledge, very few are still even useful. However, 
  proxy rotation could potentially be used to send many more requests (making the script even faster), without worrying about ban.
  2) Alternate search engines - although I did not use other search engines, perhaps a more efficient way to perform this task would have been to spread out requests over more search engines.
  3) Using ClearBit, Lusha as a means to check or even to complete the whole task - after some research, I discovered that these could have completed the task without the 
  drudge of scrapping Google. However, they are very expensive.
  4) Captcha-Solvers - The main enemy to botting is Captcha, and employed by Google to stop scrapers like this one, I've invested some time into looking for solvers that can bypass these checks.
